import { useEffect, useState } from 'react'
import { Dialog, IconButton, MobileStepper, Button } from '@mui/material'
import { Close, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { useSwipeable } from 'react-swipeable' // Import useSwipeable hook

interface ImageGalleryProps {
  images: string[]
  open: boolean
  onClose: () => void
  initialIndex: number
}

export function ImageGallery({ images, open, onClose, initialIndex }: ImageGalleryProps) {
  const [activeStep, setActiveStep] = useState(initialIndex)
  const maxSteps = images.length
useEffect(()=>{
setActiveStep(initialIndex)
},[initialIndex])
  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, maxSteps - 1))
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0))
  }

  const handleStepChange = (step: number) => {
    setActiveStep(step)
  }

  // Handle closing the dialog
  const handleClose = () => {
    onClose()
  }

  // Swipeable setup
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handleBack,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  return (
    <Dialog open={open} onClose={handleClose}>
    <div className="relative h-[80vh] max-w-[90vw] mx-auto flex flex-col" {...swipeHandlers}>
      <IconButton
        edge="start"
        color="inherit"
        onClick={handleClose}
        aria-label="close"
        className="absolute top-4 right-4 z-10"
      >
        <Close />
      </IconButton>
  
      {/* Image Container */}
      <div className="flex-grow flex items-center justify-center">
        <img
          src={images[activeStep]}
          alt={`Gallery image ${activeStep + 1}`}
          className="max-h-[calc(100%-80px)] max-w-full w-auto h-auto object-contain"
        />
      </div>
  
      {/* Mobile Stepper attached to the bottom of the image view */}
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
        className="bg-opacity-50 bg-black"
      />
    </div>
  </Dialog>
  
  )
}
