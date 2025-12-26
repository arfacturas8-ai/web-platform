/**
 * Menu Import/Export Component
 * Handles CSV import and export for menu items and categories
 */
import React, { useState, useRef } from 'react';
import { logger } from '@/utils/logger';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { menuService } from '@/services/menuService';
import type { MenuItem, Category, CreateMenuItemDto, CreateCategoryDto } from '@/types/menu';

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

interface MenuImportExportProps {
  categories: Category[];
  menuItems: MenuItem[];
  onImportComplete: () => void;
}

// CSV parsing helper
const parseCSV = (text: string): string[][] => {
  const lines = text.split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }).filter(row => row.some(cell => cell.length > 0));
};

// CSV generation helper
const generateCSV = (headers: string[], rows: string[][]): string => {
  const escapeCell = (cell: string) => {
    if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
      return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const dataLines = rows.map(row => row.map(escapeCell).join(','));
  return [headerLine, ...dataLines].join('\n');
};

export const MenuImportExport: React.FC<MenuImportExportProps> = ({
  categories,
  menuItems,
  onImportComplete,
}) => {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [importType, setImportType] = useState<'items' | 'categories'>('items');
  const [previewData, setPreviewData] = useState<string[][] | null>(null);

  const labels = {
    title: language === 'es' ? 'Importar / Exportar' : 'Import / Export',
    importItems: language === 'es' ? 'Importar Productos' : 'Import Items',
    importCategories: language === 'es' ? 'Importar Categorías' : 'Import Categories',
    exportItems: language === 'es' ? 'Exportar Productos' : 'Export Items',
    exportCategories: language === 'es' ? 'Exportar Categorías' : 'Export Categories',
    downloadTemplate: language === 'es' ? 'Descargar Plantilla' : 'Download Template',
    selectFile: language === 'es' ? 'Seleccionar archivo CSV' : 'Select CSV file',
    preview: language === 'es' ? 'Vista previa' : 'Preview',
    import: language === 'es' ? 'Importar' : 'Import',
    cancel: language === 'es' ? 'Cancelar' : 'Cancel',
    importing: language === 'es' ? 'Importando...' : 'Importing...',
    success: language === 'es' ? 'importados correctamente' : 'imported successfully',
    failed: language === 'es' ? 'fallaron' : 'failed',
    close: language === 'es' ? 'Cerrar' : 'Close',
    rows: language === 'es' ? 'filas' : 'rows',
  };

  // Export menu items to CSV
  const exportMenuItems = () => {
    const headers = [
      'id',
      'category_id',
      'category_name',
      'name',
      'name_es',
      'description',
      'description_es',
      'price',
      'image_url',
      'is_available',
      'is_featured',
      'display_order',
      'allergens',
    ];

    const rows = menuItems.map(item => {
      const category = categories.find(c => c.id === item.category_id);
      return [
        item.id,
        item.category_id,
        category?.name || '',
        item.name,
        item.name_es || '',
        item.description || '',
        item.description_es || '',
        item.price.toString(),
        item.image_url || '',
        item.is_available ? 'true' : 'false',
        item.is_featured ? 'true' : 'false',
        item.display_order.toString(),
        item.allergens.map(a => a.name).join(';'),
      ];
    });

    const csv = generateCSV(headers, rows);
    downloadFile(csv, 'menu_items.csv', 'text/csv');
  };

  // Export categories to CSV
  const exportCategories = () => {
    const headers = [
      'id',
      'name',
      'name_es',
      'description',
      'description_es',
      'display_order',
      'is_active',
    ];

    const rows = categories.map(cat => [
      cat.id,
      cat.name,
      cat.name_es || '',
      cat.description || '',
      cat.description_es || '',
      cat.display_order.toString(),
      cat.is_active ? 'true' : 'false',
    ]);

    const csv = generateCSV(headers, rows);
    downloadFile(csv, 'categories.csv', 'text/csv');
  };

  // Download template
  const downloadTemplate = (type: 'items' | 'categories') => {
    if (type === 'items') {
      const headers = [
        'name',
        'name_es',
        'category_name',
        'description',
        'description_es',
        'price',
        'image_url',
        'is_available',
        'is_featured',
        'display_order',
      ];
      const exampleRow = [
        'Cappuccino',
        'Capuchino',
        'Coffee',
        'Classic Italian coffee with steamed milk foam',
        'Café italiano clásico con espuma de leche',
        '3500',
        '',
        'true',
        'false',
        '1',
      ];
      const csv = generateCSV(headers, [exampleRow]);
      downloadFile(csv, 'menu_items_template.csv', 'text/csv');
    } else {
      const headers = [
        'name',
        'name_es',
        'description',
        'description_es',
        'display_order',
        'is_active',
      ];
      const exampleRow = [
        'Coffee',
        'Café',
        'Hot and cold coffee drinks',
        'Bebidas de café calientes y frías',
        '1',
        'true',
      ];
      const csv = generateCSV(headers, [exampleRow]);
      downloadFile(csv, 'categories_template.csv', 'text/csv');
    }
  };

  // Helper to download file
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      setPreviewData(parsed);
    };
    reader.readAsText(file);
  };

  // Import menu items
  const importMenuItems = async (data: string[][]) => {
    const headers = data[0].map(h => h.toLowerCase().replace(/\s+/g, '_'));
    const rows = data.slice(1);

    const result: ImportResult = { success: 0, failed: 0, errors: [] };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const item: Record<string, string> = {};
        headers.forEach((header, index) => {
          item[header] = row[index] || '';
        });

        // Find category by name
        let categoryId = item.category_id;
        if (!categoryId && item.category_name) {
          const category = categories.find(
            c => c.name.toLowerCase() === item.category_name.toLowerCase() ||
                 c.name_es?.toLowerCase() === item.category_name.toLowerCase()
          );
          if (category) {
            categoryId = category.id;
          } else {
            throw new Error(`Categoría no encontrada: ${item.category_name}`);
          }
        }

        if (!categoryId) {
          throw new Error('category_id o category_name requerido');
        }

        const createDto: CreateMenuItemDto = {
          category_id: categoryId,
          name: item.name,
          name_es: item.name_es || undefined,
          description: item.description || undefined,
          description_es: item.description_es || undefined,
          price: parseFloat(item.price) || 0,
          image_url: item.image_url || undefined,
          is_available: item.is_available?.toLowerCase() !== 'false',
          is_featured: item.is_featured?.toLowerCase() === 'true',
          display_order: parseInt(item.display_order) || i + 1,
        };

        // Check if item exists (by id or name in same category)
        const existingItem = menuItems.find(
          m => m.id === item.id ||
               (m.category_id === categoryId && m.name.toLowerCase() === item.name.toLowerCase())
        );

        if (existingItem) {
          await menuService.updateMenuItem(existingItem.id, createDto);
        } else {
          await menuService.createMenuItem(createDto);
        }

        result.success++;
      } catch (error: any) {
        result.failed++;
        result.errors.push(`Fila ${i + 2}: ${error.message || 'Error desconocido'}`);
      }
    }

    return result;
  };

  // Import categories
  const importCategories = async (data: string[][]) => {
    const headers = data[0].map(h => h.toLowerCase().replace(/\s+/g, '_'));
    const rows = data.slice(1);

    const result: ImportResult = { success: 0, failed: 0, errors: [] };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const item: Record<string, string> = {};
        headers.forEach((header, index) => {
          item[header] = row[index] || '';
        });

        const createDto: CreateCategoryDto = {
          name: item.name,
          name_es: item.name_es || undefined,
          description: item.description || undefined,
          description_es: item.description_es || undefined,
          display_order: parseInt(item.display_order) || i + 1,
          is_active: item.is_active?.toLowerCase() !== 'false',
        };

        // Check if category exists
        const existingCategory = categories.find(
          c => c.id === item.id || c.name.toLowerCase() === item.name.toLowerCase()
        );

        if (existingCategory) {
          await menuService.updateCategory(existingCategory.id, createDto);
        } else {
          await menuService.createCategory(createDto);
        }

        result.success++;
      } catch (error: any) {
        result.failed++;
        result.errors.push(`Fila ${i + 2}: ${error.message || 'Error desconocido'}`);
      }
    }

    return result;
  };

  // Handle import
  const handleImport = async () => {
    if (!previewData || previewData.length < 2) return;

    setIsImporting(true);
    try {
      const result = importType === 'items'
        ? await importMenuItems(previewData)
        : await importCategories(previewData);

      setImportResult(result);
      if (result.success > 0) {
        onImportComplete();
      }
    } catch (error) {
      logger.error('Import error:', error);
      setImportResult({
        success: 0,
        failed: previewData.length - 1,
        errors: ['Error general de importación'],
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Open import modal
  const openImportModal = (type: 'items' | 'categories') => {
    setImportType(type);
    setPreviewData(null);
    setImportResult(null);
    setShowModal(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Export Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 bg-forest/10 text-forest rounded-xl hover:bg-forest/20 transition-colors">
            <Download size={18} />
            <span className="hidden sm:inline">{language === 'es' ? 'Exportar' : 'Export'}</span>
          </button>
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-sand/30 overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[180px]">
            <button
              onClick={exportMenuItems}
              className="w-full px-4 py-2 text-left text-sm hover:bg-sand/10 transition-colors"
            >
              {labels.exportItems}
            </button>
            <button
              onClick={exportCategories}
              className="w-full px-4 py-2 text-left text-sm hover:bg-sand/10 transition-colors"
            >
              {labels.exportCategories}
            </button>
          </div>
        </div>

        {/* Import Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors">
            <Upload size={18} />
            <span className="hidden sm:inline">{language === 'es' ? 'Importar' : 'Import'}</span>
          </button>
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-sand/30 overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[200px]">
            <button
              onClick={() => openImportModal('items')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-sand/10 transition-colors"
            >
              {labels.importItems}
            </button>
            <button
              onClick={() => openImportModal('categories')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-sand/10 transition-colors"
            >
              {labels.importCategories}
            </button>
            <div className="border-t border-sand/20 my-1" />
            <button
              onClick={() => downloadTemplate('items')}
              className="w-full px-4 py-2 text-left text-sm text-forest/60 hover:bg-sand/10 transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet size={16} />
              Plantilla Productos
            </button>
            <button
              onClick={() => downloadTemplate('categories')}
              className="w-full px-4 py-2 text-left text-sm text-forest/60 hover:bg-sand/10 transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet size={16} />
              Plantilla Categorías
            </button>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-sand/30 flex items-center justify-between">
              <h2 className="text-xl font-bold text-forest">
                {importType === 'items' ? labels.importItems : labels.importCategories}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-sand/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!importResult ? (
                <>
                  {/* File Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-forest/70 mb-2">
                      {labels.selectFile}
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="w-full px-4 py-3 border-2 border-dashed border-sand/50 rounded-xl cursor-pointer hover:border-forest/50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-forest file:text-white hover:file:bg-forest/90"
                    />
                  </div>

                  {/* Preview */}
                  {previewData && previewData.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-forest/70 mb-2">
                        {labels.preview} ({previewData.length - 1} {labels.rows})
                      </h3>
                      <div className="border border-sand/30 rounded-xl overflow-x-auto max-h-64">
                        <table className="w-full text-sm">
                          <thead className="bg-sand/10">
                            <tr>
                              {previewData[0].map((header, i) => (
                                <th key={i} className="px-3 py-2 text-left font-medium text-forest/70 whitespace-nowrap">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.slice(1, 6).map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-t border-sand/20">
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="px-3 py-2 whitespace-nowrap max-w-[200px] truncate">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                            {previewData.length > 6 && (
                              <tr className="border-t border-sand/20">
                                <td colSpan={previewData[0].length} className="px-3 py-2 text-center text-forest/50">
                                  ... y {previewData.length - 6} filas más
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Result */
                <div className="text-center py-8">
                  {importResult.success > 0 ? (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-500" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle size={32} className="text-red-500" />
                    </div>
                  )}

                  <p className="text-lg font-medium text-forest mb-2">
                    {importResult.success} {labels.success}
                  </p>
                  {importResult.failed > 0 && (
                    <p className="text-sm text-red-500 mb-4">
                      {importResult.failed} {labels.failed}
                    </p>
                  )}

                  {importResult.errors.length > 0 && (
                    <div className="mt-4 text-left bg-red-50 rounded-xl p-4 max-h-40 overflow-y-auto">
                      <p className="font-medium text-red-700 mb-2">Errores:</p>
                      <ul className="text-sm text-red-600 space-y-1">
                        {importResult.errors.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-sand/30 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-xl border border-sand/50 text-forest/70 hover:bg-sand/10 transition-colors"
              >
                {importResult ? labels.close : labels.cancel}
              </button>
              {!importResult && previewData && previewData.length > 1 && (
                <button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="px-6 py-2 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isImporting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {labels.importing}
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      {labels.import}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden input for file selection */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".csv"
        onChange={handleFileSelect}
      />
    </>
  );
};

export default MenuImportExport;
