import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import Cropper from 'react-easy-crop';
import { StyledFileInput } from './StyledFileInput';

interface ImageUploadAndCropProps {
  onImageCropped: (croppedImage: string) => void;
}

const ImageUploadAndCrop: React.FC<ImageUploadAndCropProps> = ({ onImageCropped }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageSrc(reader.result as string);
          setShowCropper(true);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {
    const croppedImage = await getCroppedImage(imageSrc!, croppedAreaPixels);
    onImageCropped(croppedImage);
    setShowCropper(false);
    setImageSrc(null);
  };

  const getCroppedImage = async (imageSrc: string, croppedAreaPixels: any) => {
    const image = new Image();
    image.src = imageSrc;
    await image.decode();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(URL.createObjectURL(blob));
      });
    });
  };

  return (
    <Box>
      <StyledFileInput type="file" accept="image/*" onChange={handleImageUpload} />
      {showCropper && imageSrc && (
        <Box sx={{ position: 'relative', width: '100%', height: 300, marginBottom: 2 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
          <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary" onClick={() => handleCropComplete({}, {})}>
              Crop Image
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setShowCropper(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ImageUploadAndCrop;