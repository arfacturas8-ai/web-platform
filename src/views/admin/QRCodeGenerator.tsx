/**
 * Café 1973 - QR Code Generator
 * Generate QR codes for menu, tables, and custom links
 */
import React, { useState, useRef } from 'react';
import { logger } from '@/utils/logger';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Download,
  Copy,
  Check,
  QrCode,
  UtensilsCrossed,
  Grid3X3,
  Link as LinkIcon,
  Palette,
  RefreshCw
} from 'lucide-react';

type QRType = 'menu' | 'table' | 'custom';

interface QRPreset {
  type: QRType;
  label: string;
  labelEs: string;
  icon: React.ReactNode;
  description: string;
  descriptionEs: string;
}

const presets: QRPreset[] = [
  {
    type: 'menu',
    label: 'Menu',
    labelEs: 'Menú',
    icon: <UtensilsCrossed size={24} />,
    description: 'QR code linking to your digital menu',
    descriptionEs: 'Código QR que enlaza a tu menú digital',
  },
  {
    type: 'table',
    label: 'Table',
    labelEs: 'Mesa',
    icon: <Grid3X3 size={24} />,
    description: 'QR code for specific table reservations',
    descriptionEs: 'Código QR para reservas de mesa específica',
  },
  {
    type: 'custom',
    label: 'Custom Link',
    labelEs: 'Enlace Personalizado',
    icon: <LinkIcon size={24} />,
    description: 'QR code for any custom URL',
    descriptionEs: 'Código QR para cualquier URL personalizada',
  },
];

const colorPresets = [
  { name: 'Forest', fg: '#2d4a3e', bg: '#ffffff' },
  { name: 'Espresso', fg: '#8b4513', bg: '#ffffff' },
  { name: 'Classic', fg: '#000000', bg: '#ffffff' },
  { name: 'Inverted', fg: '#ffffff', bg: '#2d4a3e' },
  { name: 'Sand', fg: '#2d4a3e', bg: '#f5f0e8' },
];

const BASE_URL = window.location.origin;

export const QRCodeGenerator: React.FC = () => {
  const { language } = useLanguage();
  const qrRef = useRef<HTMLDivElement>(null);

  const [selectedType, setSelectedType] = useState<QRType>('menu');
  const [tableNumber, setTableNumber] = useState('1');
  const [customUrl, setCustomUrl] = useState('');
  const [qrSize, setQrSize] = useState(256);
  const [fgColor, setFgColor] = useState('#2d4a3e');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);
  const [includeLabel, setIncludeLabel] = useState(true);

  // Generate URL based on type
  const getQRUrl = (): string => {
    switch (selectedType) {
      case 'menu':
        return `${BASE_URL}/menu`;
      case 'table':
        return `${BASE_URL}/reservations?table=${tableNumber}`;
      case 'custom':
        return customUrl || BASE_URL;
      default:
        return BASE_URL;
    }
  };

  // Get label for QR code
  const getQRLabel = (): string => {
    switch (selectedType) {
      case 'menu':
        return language === 'es' ? 'Escanea para ver el menú' : 'Scan for menu';
      case 'table':
        return language === 'es' ? `Mesa ${tableNumber}` : `Table ${tableNumber}`;
      case 'custom':
        return language === 'es' ? 'Escanéame' : 'Scan me';
      default:
        return '';
    }
  };

  const qrUrl = getQRUrl();

  // Copy URL to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error('Failed to copy:', err);
    }
  };

  // Download QR code as PNG
  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Add padding for label
    const padding = includeLabel ? 60 : 40;
    canvas.width = qrSize + padding * 2;
    canvas.height = qrSize + padding * 2 + (includeLabel ? 40 : 0);

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw QR code
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, padding, padding, qrSize, qrSize);

      // Add label if enabled
      if (includeLabel) {
        ctx.fillStyle = fgColor;
        ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(getQRLabel(), canvas.width / 2, qrSize + padding + 30);
      }

      // Download
      const link = document.createElement('a');
      const fileName = selectedType === 'table'
        ? `qr-table-${tableNumber}.png`
        : `qr-${selectedType}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Download SVG
  const handleDownloadSVG = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    const fileName = selectedType === 'table'
      ? `qr-table-${tableNumber}.svg`
      : `qr-${selectedType}.svg`;
    link.download = fileName;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  };

  // Bulk generate table QR codes
  const handleBulkDownload = async (count: number) => {
    for (let i = 1; i <= count; i++) {
      setTableNumber(String(i));
      await new Promise(resolve => setTimeout(resolve, 500));
      handleDownload();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center">
            <QrCode size={24} className="text-forest" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-forest">
              {language === 'es' ? 'Generador de Códigos QR' : 'QR Code Generator'}
            </h1>
            <p className="text-forest/60">
              {language === 'es'
                ? 'Crea códigos QR para tu menú, mesas y más'
                : 'Create QR codes for your menu, tables, and more'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Settings */}
        <div className="space-y-6">
          {/* Type Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200">
            <h2 className="text-lg font-semibold text-forest mb-4">
              {language === 'es' ? 'Tipo de QR' : 'QR Type'}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.type}
                  onClick={() => setSelectedType(preset.type)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedType === preset.type
                      ? 'border-forest bg-forest/5'
                      : 'border-sand-200 hover:border-forest/30'
                  }`}
                >
                  <div className={`mb-2 ${selectedType === preset.type ? 'text-forest' : 'text-forest/50'}`}>
                    {preset.icon}
                  </div>
                  <p className={`text-sm font-medium ${
                    selectedType === preset.type ? 'text-forest' : 'text-forest/70'
                  }`}>
                    {language === 'es' ? preset.labelEs : preset.label}
                  </p>
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-forest/60">
              {language === 'es'
                ? presets.find(p => p.type === selectedType)?.descriptionEs
                : presets.find(p => p.type === selectedType)?.description}
            </p>
          </div>

          {/* Type-specific settings */}
          {selectedType === 'table' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200">
              <h2 className="text-lg font-semibold text-forest mb-4">
                {language === 'es' ? 'Número de Mesa' : 'Table Number'}
              </h2>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-24 px-4 py-3 border border-sand-200 rounded-xl text-center text-lg font-semibold focus:outline-none focus:border-forest"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkDownload(5)}
                    className="px-4 py-2 text-sm bg-sand/30 text-forest rounded-lg hover:bg-sand/50 transition-colors"
                  >
                    {language === 'es' ? 'Descargar 1-5' : 'Download 1-5'}
                  </button>
                  <button
                    onClick={() => handleBulkDownload(10)}
                    className="px-4 py-2 text-sm bg-sand/30 text-forest rounded-lg hover:bg-sand/50 transition-colors"
                  >
                    {language === 'es' ? 'Descargar 1-10' : 'Download 1-10'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedType === 'custom' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200">
              <h2 className="text-lg font-semibold text-forest mb-4">
                {language === 'es' ? 'URL Personalizada' : 'Custom URL'}
              </h2>
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-sand-200 rounded-xl focus:outline-none focus:border-forest"
              />
            </div>
          )}

          {/* Appearance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200">
            <h2 className="text-lg font-semibold text-forest mb-4 flex items-center gap-2">
              <Palette size={20} />
              {language === 'es' ? 'Apariencia' : 'Appearance'}
            </h2>

            {/* Color Presets */}
            <div className="mb-4">
              <label className="text-sm text-forest/70 mb-2 block">
                {language === 'es' ? 'Colores predefinidos' : 'Color presets'}
              </label>
              <div className="flex gap-2 flex-wrap">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setFgColor(preset.fg);
                      setBgColor(preset.bg);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all ${
                      fgColor === preset.fg && bgColor === preset.bg
                        ? 'border-forest'
                        : 'border-sand-200 hover:border-forest/30'
                    }`}
                    style={{
                      backgroundColor: preset.bg,
                      color: preset.fg,
                      borderColor: fgColor === preset.fg && bgColor === preset.bg ? preset.fg : undefined
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-forest/70 mb-2 block">
                  {language === 'es' ? 'Color del QR' : 'QR Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-sand-200"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-sand-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-forest/70 mb-2 block">
                  {language === 'es' ? 'Color de fondo' : 'Background'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-sand-200"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-sand-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="mb-4">
              <label className="text-sm text-forest/70 mb-2 block">
                {language === 'es' ? 'Tamaño' : 'Size'}: {qrSize}px
              </label>
              <input
                type="range"
                min="128"
                max="512"
                step="32"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full accent-forest"
              />
            </div>

            {/* Include Label */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLabel}
                onChange={(e) => setIncludeLabel(e.target.checked)}
                className="w-5 h-5 rounded border-sand-200 text-forest focus:ring-forest"
              />
              <span className="text-sm text-forest">
                {language === 'es' ? 'Incluir etiqueta en descarga' : 'Include label in download'}
              </span>
            </label>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:sticky lg:top-6 h-fit">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-200">
            <h2 className="text-lg font-semibold text-forest mb-4">
              {language === 'es' ? 'Vista Previa' : 'Preview'}
            </h2>

            {/* QR Code Display */}
            <div
              ref={qrRef}
              className="flex flex-col items-center justify-center p-8 rounded-xl mb-6"
              style={{ backgroundColor: bgColor }}
            >
              <QRCodeSVG
                value={qrUrl}
                size={qrSize}
                fgColor={fgColor}
                bgColor={bgColor}
                level="H"
                includeMargin={false}
              />
              {includeLabel && (
                <p
                  className="mt-4 text-base font-medium"
                  style={{ color: fgColor }}
                >
                  {getQRLabel()}
                </p>
              )}
            </div>

            {/* URL Display */}
            <div className="mb-6">
              <label className="text-sm text-forest/70 mb-2 block">
                {language === 'es' ? 'URL del código' : 'QR URL'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={qrUrl}
                  readOnly
                  className="flex-1 px-4 py-2 bg-sand/20 border border-sand-200 rounded-lg text-sm text-forest/70 truncate"
                />
                <button
                  onClick={handleCopyUrl}
                  className="p-2 bg-sand/30 rounded-lg hover:bg-sand/50 transition-colors"
                  title={language === 'es' ? 'Copiar URL' : 'Copy URL'}
                >
                  {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} className="text-forest" />}
                </button>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition-colors"
              >
                <Download size={20} />
                PNG
              </button>
              <button
                onClick={handleDownloadSVG}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-sand/30 text-forest rounded-xl font-medium hover:bg-sand/50 transition-colors"
              >
                <Download size={20} />
                SVG
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-4 p-4 bg-sand/20 rounded-xl">
            <h3 className="text-sm font-semibold text-forest mb-2">
              {language === 'es' ? 'Consejos' : 'Tips'}
            </h3>
            <ul className="text-xs text-forest/70 space-y-1">
              <li>• {language === 'es' ? 'Usa SVG para impresión de alta calidad' : 'Use SVG for high-quality printing'}</li>
              <li>• {language === 'es' ? 'PNG es mejor para uso digital' : 'PNG is better for digital use'}</li>
              <li>• {language === 'es' ? 'Tamaño mínimo recomendado: 2cm x 2cm' : 'Minimum recommended size: 2cm x 2cm'}</li>
              <li>• {language === 'es' ? 'Asegura buen contraste entre colores' : 'Ensure good contrast between colors'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
