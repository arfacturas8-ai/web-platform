/**
 * Media Uploader Component
 * Handles both image and video uploads with preview
 */
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Video, Play, Pause } from 'lucide-react';
import { uploadService } from '@/services/uploadService';
import { getImageUrl } from '@/utils/constants';

interface MediaUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  accept?: 'image' | 'video' | 'all';
  label?: string;
}

export const MediaUploader = ({
  value,
  onChange,
  onRemove,
  accept = 'all',
  label,
}: MediaUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [previewType, setPreviewType] = useState<'image' | 'video' | null>(
    value ? (uploadService.isVideo(value) ? 'video' : 'image') : null
  );
  const [error, setError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Determine accept types
  const getAcceptTypes = () => {
    switch (accept) {
      case 'image':
        return 'image/jpeg,image/jpg,image/png,image/webp,image/gif';
      case 'video':
        return 'video/mp4,video/webm,video/quicktime';
      default:
        return 'image/jpeg,image/jpg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime';
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate based on accept type
    let validation;
    if (accept === 'image') {
      validation = uploadService.validateImage(file);
    } else if (accept === 'video') {
      validation = uploadService.validateVideo(file);
    } else {
      validation = uploadService.validateMedia(file);
    }

    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    const isVideo = uploadService.isVideo(file);
    setPreviewType(isVideo ? 'video' : 'image');

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const result = isVideo
        ? await uploadService.uploadVideo(file, (p) => setProgress(p.percentage))
        : await uploadService.uploadFile(file, (p) => setProgress(p.percentage));
      onChange(result.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setPreview(undefined);
      setPreviewType(null);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    setPreviewType(null);
    onChange('');
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const displayUrl = preview?.startsWith('data:') ? preview : (preview ? getImageUrl(preview) : '');

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-forest/70 mb-1">{label}</label>}

      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          {previewType === 'video' ? (
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={displayUrl}
                className="h-48 w-full object-contain"
                onEnded={() => setIsPlaying(false)}
              />
              <button
                type="button"
                onClick={toggleVideoPlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-12 w-12 text-white" />
                ) : (
                  <Play className="h-12 w-12 text-white" />
                )}
              </button>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/60 rounded text-white text-xs">
                <Video size={12} />
                Video
              </div>
            </div>
          ) : (
            <img
              src={displayUrl}
              alt="Preview"
              className="h-48 w-full rounded-lg object-cover"
            />
          )}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute right-2 top-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50"
        >
          {accept === 'video' ? (
            <Video className="mb-2 h-8 w-8 text-muted-foreground" />
          ) : accept === 'image' ? (
            <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
          ) : (
            <div className="flex gap-2 mb-2">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
              <Video className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <p className="text-sm font-medium">
            {accept === 'video' ? 'Click to upload video' : accept === 'image' ? 'Click to upload image' : 'Click to upload media'}
          </p>
          <p className="text-xs text-muted-foreground">
            {accept === 'video'
              ? 'MP4, WebM, or MOV (max 100MB)'
              : accept === 'image'
              ? 'JPEG, PNG, or WebP (max 5MB)'
              : 'Images (max 5MB) or Videos (max 100MB)'}
          </p>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Uploading... {progress}%
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default MediaUploader;
