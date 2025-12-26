import api from './api';

export interface QRGenerateRequest {
  type: 'menu' | 'reservation' | 'table' | 'custom';
  table_id?: string;
  table_number?: string;
  custom_url?: string;
  custom_filename?: string;
  size?: 200 | 400 | 800;
}

export interface QRGenerateResponse {
  success: boolean;
  filepath: string;
  filename: string;
  type: string;
  table_number?: string;
  size: number;
}

export interface QRListResponse {
  success: boolean;
  qr_codes: string[];
  count: number;
}

export const qrService = {
  /**
   * Generate a QR code
   */
  async generate(request: QRGenerateRequest): Promise<QRGenerateResponse> {
    const response = await api.post('/admin/qr/generate', {
      ...request,
      size: request.size || 400,
    });
    return response.data;
  },

  /**
   * Get menu QR code as image blob
   */
  async getMenuQR(size: 200 | 400 | 800 = 400): Promise<Blob> {
    const response = await api.get(`/admin/qr/menu?size=${size}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get reservation QR code as image blob
   */
  async getReservationQR(size: 200 | 400 | 800 = 400): Promise<Blob> {
    const response = await api.get(`/admin/qr/reservation?size=${size}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get table QR code as image blob
   */
  async getTableQR(tableId: string, size: 200 | 400 | 800 = 400): Promise<Blob> {
    const response = await api.get(`/admin/qr/table/${tableId}?size=${size}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * List all generated QR codes
   */
  async list(): Promise<QRListResponse> {
    const response = await api.get('/admin/qr/list');
    return response.data;
  },

  /**
   * Download QR code as PNG file
   */
  downloadQR(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Generate and download menu QR code
   */
  async downloadMenuQR(size: 200 | 400 | 800 = 400) {
    const blob = await this.getMenuQR(size);
    this.downloadQR(blob, `menu_qr_${size}.png`);
  },

  /**
   * Generate and download reservation QR code
   */
  async downloadReservationQR(size: 200 | 400 | 800 = 400) {
    const blob = await this.getReservationQR(size);
    this.downloadQR(blob, `reservation_qr_${size}.png`);
  },

  /**
   * Generate and download table QR code
   */
  async downloadTableQR(tableId: string, tableNumber: string, size: 200 | 400 | 800 = 400) {
    const blob = await this.getTableQR(tableId, size);
    this.downloadQR(blob, `table_${tableNumber}_qr_${size}.png`);
  },
};
