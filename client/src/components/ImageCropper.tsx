import React, { useState, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Cropper from 'react-easy-crop';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleCropComplete = useCallback(async () => {
    if (!croppedAreaPixels) {
      console.warn('Cropped area not set yet.');
      return;
    }
    try {
      const croppedBlob = await getCroppedImage(imageSrc, croppedAreaPixels);
      setCroppedImage(URL.createObjectURL(croppedBlob)); // Set for preview
      onCropComplete(croppedBlob); // Pass Blob to parent
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  }, [croppedAreaPixels, imageSrc, onCropComplete]);

  const getCroppedImage = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
    const image = new Image();
    image.src = imageSrc;
    await image.decode();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      });
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Box sx={{ position: 'relative', width: '100%', height: '300px', marginBottom: 2 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={(newCrop) => setCrop(newCrop)}
          onZoomChange={setZoom}
          onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
        />
      </Box>

      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCropComplete}
          disabled={!croppedAreaPixels}
        >
          Crop Image
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>

      {croppedImage && (
        <Box sx={{ marginTop: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Cropped Image
          </Typography>
          <img
            src={croppedImage}
            alt="Cropped"
            style={{ maxWidth: '100%', border: '1px solid #ccc', borderRadius: '8px' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ImageCropper;
