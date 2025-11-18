import { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Loader2, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { toast } from 'sonner';

interface LogoUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (compressedImage: string) => void;
  currentLogo?: string;
  aspectRatio?: number; // 1 for square icon, undefined for free-form logo
  title?: string;
  description?: string;
}

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const LogoUploadDialog = ({
  open,
  onClose,
  onSave,
  aspectRatio,
  title = 'Upload Logo',
  description = 'Upload and crop your company logo. The image will be optimized to 512x512px.'
}: LogoUploadDialogProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: CroppedArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CroppedArea
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Set canvas size based on aspect ratio
    const maxSize = 512;

    // Calculate crop aspect ratio from the actual cropped area
    const cropAspectRatio = pixelCrop.width / pixelCrop.height;

    if (aspectRatio === 1) {
      // Square icon - force 1:1
      canvas.width = maxSize;
      canvas.height = maxSize;
    } else {
      // Free-form logo or custom aspect - maintain user's selected crop area aspect ratio
      if (cropAspectRatio > 1) {
        // Wider than tall - constrain by width
        canvas.width = maxSize;
        canvas.height = Math.round(maxSize / cropAspectRatio);
      } else {
        // Taller than wide - constrain by height
        canvas.height = maxSize;
        canvas.width = Math.round(maxSize * cropAspectRatio);
      }
    }

    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert to blob with compression
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }

          // Convert blob to data URL
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        },
        'image/jpeg', // Convert all to JPEG for consistency
        0.85 // 85% quality for good balance
      );
    });
  };

  const handleSave = async () => {
    if (!imageSrc) {
      toast.error('Please select an image');
      return;
    }

    if (!croppedAreaPixels) {
      toast.error('Please wait for image to load');
      return;
    }

    setIsProcessing(true);

    try {
      const processedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Check final size
      const sizeInBytes = Math.round((processedImage.length * 3) / 4);
      const sizeInKB = Math.round(sizeInBytes / 1024);

      console.log(`Optimized logo size: ${sizeInKB}KB`);

      if (sizeInBytes > 500 * 1024) {
        toast.warning('Logo is larger than recommended (500KB). Consider using a simpler image.');
      }

      onSave(processedImage);
      toast.success('Logo uploaded and optimized successfully');

      // Reset state
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);

      onClose();
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!imageSrc ? (
            // Upload area
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-2"
                  >
                    Choose file
                  </Button>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400 max-w-xs">
                  PNG, JPG, SVG up to 10MB
                </p>
              </div>
            </div>
          ) : (
            // Crop area
            <div className="space-y-4">
              <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  {...(aspectRatio ? { aspect: aspectRatio } : {})}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="rect"
                  showGrid={true}
                  style={{
                    containerStyle: {
                      borderRadius: '0.5rem',
                    },
                  }}
                />
              </div>

              {/* Zoom Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ZoomOut className="w-4 h-4" />
                    Zoom
                  </label>
                  <ZoomIn className="w-4 h-4 text-gray-500" />
                </div>
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={1}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Change Image Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Choose Different Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!imageSrc || isProcessing}
            className="bg-[#635bff] hover:bg-[#5045e5]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Save Logo'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
