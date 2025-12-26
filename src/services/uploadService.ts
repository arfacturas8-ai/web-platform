import api from './api';

export interface UploadResponse {
  url: string;
  filename: string;
  type?: 'image' | 'video';
  size?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// File type constants
const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-m4v'];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export const uploadService = {
  uploadFile: async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    });

    return response.data;
  },

  uploadImage: async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> => {
    return uploadService.uploadFile(file, onProgress);
  },

  uploadVideo: async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 min timeout for videos
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    });

    return response.data;
  },

  deleteFile: async (filename: string): Promise<void> => {
    await api.delete(`/upload/${filename}`);
  },

  deleteVideo: async (filename: string): Promise<void> => {
    await api.delete(`/upload/videos/${filename}`);
  },

  validateImage: (file: File): { valid: boolean; error?: string } => {
    if (!IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.',
      };
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return {
        valid: false,
        error: 'File size exceeds 5MB limit.',
      };
    }

    return { valid: true };
  },

  validateVideo: (file: File): { valid: boolean; error?: string } => {
    if (!VIDEO_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only MP4, WebM, MOV, AVI and M4V are allowed.',
      };
    }

    if (file.size > MAX_VIDEO_SIZE) {
      return {
        valid: false,
        error: 'File size exceeds 100MB limit.',
      };
    }

    return { valid: true };
  },

  validateMedia: (file: File): { valid: boolean; error?: string; type?: 'image' | 'video' } => {
    const isImage = IMAGE_TYPES.includes(file.type);
    const isVideo = VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return {
        valid: false,
        error: 'Invalid file type. Only images (JPEG, PNG, WebP, GIF) and videos (MP4, WebM, MOV) are allowed.',
      };
    }

    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const sizeLimit = isVideo ? '100MB' : '5MB';

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${sizeLimit} limit.`,
      };
    }

    return { valid: true, type: isVideo ? 'video' : 'image' };
  },

  isVideo: (file: File | string): boolean => {
    if (typeof file === 'string') {
      return /\.(mp4|webm|mov|avi|m4v)$/i.test(file);
    }
    return VIDEO_TYPES.includes(file.type);
  },

  isImage: (file: File | string): boolean => {
    if (typeof file === 'string') {
      return /\.(jpg|jpeg|png|webp|gif)$/i.test(file);
    }
    return IMAGE_TYPES.includes(file.type);
  },
};
