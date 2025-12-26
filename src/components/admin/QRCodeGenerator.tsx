import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/toast';
import { Download, QrCode, Loader2 } from 'lucide-react';
import { qrService } from '@/services/qrService';

type QRSize = 200 | 400 | 800;
type QRType = 'menu' | 'reservation';

interface QRCodeGeneratorProps {
  defaultType?: QRType;
  showTypeSelector?: boolean;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  defaultType = 'menu',
  showTypeSelector = true,
}) => {
  const { addToast } = useToast();
  const [qrType, setQrType] = useState<QRType>(defaultType);
  const [qrSize, setQrSize] = useState<QRSize>(400);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate preview when type or size changes
  useEffect(() => {
    generatePreview();
  }, [qrType, qrSize]);

  const generatePreview = async () => {
    setIsGenerating(true);
    try {
      let blob: Blob;
      if (qrType === 'menu') {
        blob = await qrService.getMenuQR(qrSize);
      } else {
        blob = await qrService.getReservationQR(qrSize);
      }

      // Create object URL for preview
      const url = URL.createObjectURL(blob);

      // Cleanup previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl(url);
    } catch (error: any) {
      addToast({
        title: 'Error',
        description: error.message || 'Failed to generate QR code preview',
        variant: 'destructive',
      });
      setPreviewUrl(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (qrType === 'menu') {
        await qrService.downloadMenuQR(qrSize);
      } else {
        await qrService.downloadReservationQR(qrSize);
      }

      addToast({
        title: 'Success',
        description: `QR code downloaded successfully`,
      });
    } catch (error: any) {
      addToast({
        title: 'Error',
        description: error.message || 'Failed to download QR code',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    if (!previewUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      addToast({
        title: 'Error',
        description: 'Unable to open print window. Please check popup blocker settings.',
        variant: 'destructive',
      });
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - ${qrType === 'menu' ? 'Menu' : 'Reservations'}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            h1 {
              font-family: Arial, sans-serif;
              margin-bottom: 20px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            .info {
              margin-top: 20px;
              font-family: Arial, sans-serif;
              text-align: center;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h1>Café 1973 - ${qrType === 'menu' ? 'Menu' : 'Reservations'}</h1>
          <img src="${previewUrl}" alt="QR Code" />
          <div class="info">
            <p>Scan this QR code to ${qrType === 'menu' ? 'view our menu' : 'make a reservation'}</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const getSizeLabel = (size: QRSize) => {
    switch (size) {
      case 200:
        return 'Small (200x200) - Digital use';
      case 400:
        return 'Medium (400x400) - Standard printing';
      case 800:
        return 'Large (800x800) - Poster/signage';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Generator
        </CardTitle>
        <CardDescription>
          Generate QR codes for your menu and reservation pages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showTypeSelector && (
          <div className="space-y-3">
            <Label>QR Code Type</Label>
            <RadioGroup
              value={qrType}
              onValueChange={(value) => setQrType(value as QRType)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="menu" id="type-menu" />
                <Label htmlFor="type-menu" className="font-normal cursor-pointer">
                  Menu - Links to your full menu
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reservation" id="type-reservation" />
                <Label htmlFor="type-reservation" className="font-normal cursor-pointer">
                  Reservations - Links to reservation form
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="space-y-3">
          <Label>QR Code Size</Label>
          <RadioGroup
            value={qrSize.toString()}
            onValueChange={(value) => setQrSize(parseInt(value) as QRSize)}
          >
            {([200, 400, 800] as QRSize[]).map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <RadioGroupItem value={size.toString()} id={`size-${size}`} />
                <Label htmlFor={`size-${size}`} className="font-normal cursor-pointer">
                  {getSizeLabel(size)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <Label>Preview</Label>
          <div className="border rounded-lg p-4 bg-muted/50 flex items-center justify-center min-h-[250px]">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Generating QR code...</p>
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="QR Code Preview"
                className="max-w-full h-auto"
                style={{ maxHeight: qrSize > 400 ? '400px' : `${qrSize}px` }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">No preview available</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={handleDownload}
            disabled={!previewUrl || isDownloading || isGenerating}
            className="flex-1"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </>
            )}
          </Button>
          <Button
            onClick={handlePrint}
            disabled={!previewUrl || isGenerating}
            variant="outline"
            className="flex-1"
          >
            Print
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
          <p><strong>Usage Tips:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Small (200x200): Perfect for websites, email signatures, and digital displays</li>
            <li>Medium (400x400): Ideal for table tents, flyers, and standard printed materials</li>
            <li>Large (800x800): Best for posters, window displays, and large signage</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
