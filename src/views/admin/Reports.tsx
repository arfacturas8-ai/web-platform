/**
 * Cafe 1973 | Bakery - Admin Reports & Export Page
 * Generate, download, and schedule reports
 */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Plus,
  Clock,
  Trash2,
  CheckCircle
} from 'lucide-react';

const STORAGE_KEY = 'cafe1973_generated_reports';

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  format: string;
  generatedAt: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  format: string;
  frequency: string;
  nextRun: string;
}

const getInitialReports = (): GeneratedReport[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveReports = (reports: GeneratedReport[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

export const Reports: React.FC = () => {
  const { language } = useLanguage();
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(getInitialReports);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Custom Report Builder State
  const [reportType, setReportType] = useState('sales');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [format, setFormat] = useState('pdf');

  // Scheduled Reports State
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: language === 'es' ? 'Reporte Semanal de Ventas' : 'Weekly Sales Report',
      type: 'sales',
      format: 'PDF',
      frequency: language === 'es' ? 'Semanal' : 'Weekly',
      nextRun: '2024-01-15'
    },
    {
      id: '2',
      name: language === 'es' ? 'Resumen Mensual de Inventario' : 'Monthly Inventory Summary',
      type: 'inventory',
      format: 'Excel',
      frequency: language === 'es' ? 'Mensual' : 'Monthly',
      nextRun: '2024-02-01'
    }
  ]);

  const [showAddScheduled, setShowAddScheduled] = useState(false);
  const [newScheduledName, setNewScheduledName] = useState('');
  const [newScheduledType, setNewScheduledType] = useState('sales');
  const [newScheduledFormat, setNewScheduledFormat] = useState('pdf');
  const [newScheduledFrequency, setNewScheduledFrequency] = useState('weekly');

  useEffect(() => {
    saveReports(generatedReports);
  }, [generatedReports]);

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const quickReports = [
    {
      id: 'daily-sales',
      icon: DollarSign,
      title: language === 'es' ? 'Reporte de Ventas Diarias' : 'Daily Sales Report',
      description: language === 'es' ? 'Ventas del dia actual' : "Today's sales summary",
      color: 'bg-emerald-500'
    },
    {
      id: 'weekly-summary',
      icon: BarChart3,
      title: language === 'es' ? 'Resumen Semanal' : 'Weekly Summary',
      description: language === 'es' ? 'Resumen de la semana' : 'This week overview',
      color: 'bg-blue-500'
    },
    {
      id: 'monthly-overview',
      icon: TrendingUp,
      title: language === 'es' ? 'Vista Mensual' : 'Monthly Overview',
      description: language === 'es' ? 'Rendimiento del mes' : 'Monthly performance',
      color: 'bg-purple-500'
    },
    {
      id: 'inventory',
      icon: Package,
      title: language === 'es' ? 'Reporte de Inventario' : 'Inventory Report',
      description: language === 'es' ? 'Estado del inventario' : 'Stock status report',
      color: 'bg-orange-500'
    },
    {
      id: 'customers',
      icon: Users,
      title: language === 'es' ? 'Reporte de Clientes' : 'Customer Report',
      description: language === 'es' ? 'Analisis de clientes' : 'Customer analytics',
      color: 'bg-pink-500'
    },
    {
      id: 'staff-hours',
      icon: Clock,
      title: language === 'es' ? 'Horas del Personal' : 'Staff Hours Report',
      description: language === 'es' ? 'Horas trabajadas' : 'Working hours summary',
      color: 'bg-teal-500'
    }
  ];

  const reportTypes = [
    { value: 'sales', label: language === 'es' ? 'Ventas' : 'Sales' },
    { value: 'orders', label: language === 'es' ? 'Pedidos' : 'Orders' },
    { value: 'customers', label: language === 'es' ? 'Clientes' : 'Customers' },
    { value: 'inventory', label: language === 'es' ? 'Inventario' : 'Inventory' },
    { value: 'staff', label: language === 'es' ? 'Personal' : 'Staff' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' }
  ];

  const frequencyOptions = [
    { value: 'daily', label: language === 'es' ? 'Diario' : 'Daily' },
    { value: 'weekly', label: language === 'es' ? 'Semanal' : 'Weekly' },
    { value: 'monthly', label: language === 'es' ? 'Mensual' : 'Monthly' }
  ];

  const handleQuickReport = (report: typeof quickReports[0]) => {
    const newReport: GeneratedReport = {
      id: `${report.id}-${Date.now()}`,
      name: report.title,
      type: report.id,
      format: 'PDF',
      generatedAt: new Date().toISOString()
    };

    setGeneratedReports(prev => [newReport, ...prev]);
    showSuccessToast(language === 'es' ? 'Reporte generado exitosamente' : 'Report generated successfully');
  };

  const handleGenerateCustomReport = () => {
    if (!dateFrom || !dateTo) {
      showSuccessToast(language === 'es' ? 'Por favor seleccione fechas' : 'Please select dates');
      return;
    }

    const typeLabel = reportTypes.find(t => t.value === reportType)?.label || reportType;
    const newReport: GeneratedReport = {
      id: `custom-${Date.now()}`,
      name: `${typeLabel} Report`,
      type: reportType,
      format: format.toUpperCase(),
      generatedAt: new Date().toISOString(),
      dateRange: { from: dateFrom, to: dateTo }
    };

    setGeneratedReports(prev => [newReport, ...prev]);
    showSuccessToast(language === 'es' ? 'Reporte generado exitosamente' : 'Report generated successfully');

    // Reset form
    setDateFrom('');
    setDateTo('');
  };

  const handleDownload = (report: GeneratedReport) => {
    // Mock download - in production would trigger actual file download
    showSuccessToast(
      language === 'es'
        ? `Descargando ${report.name}...`
        : `Downloading ${report.name}...`
    );
  };

  const handleDeleteReport = (id: string) => {
    setGeneratedReports(prev => prev.filter(r => r.id !== id));
  };

  const handleAddScheduledReport = () => {
    if (!newScheduledName) return;

    const newScheduled: ScheduledReport = {
      id: `scheduled-${Date.now()}`,
      name: newScheduledName,
      type: newScheduledType,
      format: newScheduledFormat.toUpperCase(),
      frequency: frequencyOptions.find(f => f.value === newScheduledFrequency)?.label || newScheduledFrequency,
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setScheduledReports(prev => [...prev, newScheduled]);
    setShowAddScheduled(false);
    setNewScheduledName('');
    setNewScheduledType('sales');
    setNewScheduledFormat('pdf');
    setNewScheduledFrequency('weekly');
    showSuccessToast(language === 'es' ? 'Reporte programado agregado' : 'Scheduled report added');
  };

  const handleDeleteScheduled = (id: string) => {
    setScheduledReports(prev => prev.filter(r => r.id !== id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-CR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className="bg-forest text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle size={20} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest">
            {language === 'es' ? 'Reportes y Analiticas' : 'Reports & Analytics'}
          </h1>
          <p className="text-forest/60">
            {language === 'es'
              ? 'Genere, descargue y programe reportes'
              : 'Generate, download, and schedule reports'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-forest/60">
          <FileText size={18} />
          <span>
            {generatedReports.length} {language === 'es' ? 'reportes generados' : 'reports generated'}
          </span>
        </div>
      </div>

      {/* Quick Report Cards */}
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h2 className="text-lg font-semibold text-forest mb-4 flex items-center gap-2">
          <BarChart3 size={20} />
          {language === 'es' ? 'Reportes Rapidos' : 'Quick Reports'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickReports.map((report) => (
            <button
              key={report.id}
              onClick={() => handleQuickReport(report)}
              className="flex items-start gap-4 p-4 rounded-xl border border-sand/30 hover:border-forest/30 hover:bg-[#faf8f3] transition-all text-left group"
            >
              <div className={`w-12 h-12 ${report.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <report.icon size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-forest group-hover:text-forest/80 transition-colors">
                  {report.title}
                </h3>
                <p className="text-sm text-forest/50 mt-0.5">{report.description}</p>
              </div>
              <Download size={18} className="text-forest/30 group-hover:text-forest/60 transition-colors flex-shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Custom Report Builder */}
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h2 className="text-lg font-semibold text-forest mb-4 flex items-center gap-2">
          <Filter size={20} />
          {language === 'es' ? 'Generador de Reportes Personalizados' : 'Custom Report Builder'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-forest/70 mb-1.5">
              {language === 'es' ? 'Tipo de Reporte' : 'Report Type'}
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-sand/50 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all bg-white text-forest"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-forest/70 mb-1.5">
              {language === 'es' ? 'Desde' : 'From'}
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand/50 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-forest"
              />
              <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/40 pointer-events-none" />
            </div>
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-forest/70 mb-1.5">
              {language === 'es' ? 'Hasta' : 'To'}
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand/50 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-forest"
              />
              <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/40 pointer-events-none" />
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-forest/70 mb-1.5">
              {language === 'es' ? 'Formato' : 'Format'}
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-sand/50 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all bg-white text-forest"
            >
              {formatOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerateCustomReport}
              className="w-full px-6 py-2.5 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              {language === 'es' ? 'Generar Reporte' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-sand/30">
          <h2 className="text-lg font-semibold text-forest flex items-center gap-2">
            <Clock size={20} />
            {language === 'es' ? 'Reportes Recientes' : 'Recent Reports'}
          </h2>
        </div>
        {generatedReports.length > 0 ? (
          <div className="divide-y divide-sand/20">
            {generatedReports.slice(0, 10).map((report) => (
              <div key={report.id} className="px-6 py-4 hover:bg-[#faf8f3] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center">
                      <FileText size={18} className="text-forest" />
                    </div>
                    <div>
                      <p className="font-medium text-forest">{report.name}</p>
                      <p className="text-sm text-forest/50">
                        {formatDate(report.generatedAt)}
                        {report.dateRange && (
                          <span className="ml-2">
                            ({report.dateRange.from} - {report.dateRange.to})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-sand/30 rounded-full text-sm font-medium text-forest">
                      {report.format}
                    </span>
                    <button
                      onClick={() => handleDownload(report)}
                      className="p-2 text-forest/60 hover:text-forest hover:bg-forest/10 rounded-lg transition-colors"
                      title={language === 'es' ? 'Descargar' : 'Download'}
                    >
                      <Download size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={language === 'es' ? 'Eliminar' : 'Delete'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <FileText size={32} className="text-sand mx-auto mb-2" />
            <p className="text-forest/50">
              {language === 'es' ? 'No hay reportes generados' : 'No reports generated yet'}
            </p>
            <p className="text-sm text-forest/40 mt-1">
              {language === 'es'
                ? 'Use los reportes rapidos o el generador personalizado'
                : 'Use quick reports or the custom builder above'}
            </p>
          </div>
        )}
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-sand/30 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-forest flex items-center gap-2">
            <Calendar size={20} />
            {language === 'es' ? 'Reportes Programados' : 'Scheduled Reports'}
          </h2>
          <button
            onClick={() => setShowAddScheduled(!showAddScheduled)}
            className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            {language === 'es' ? 'Agregar' : 'Add New'}
          </button>
        </div>

        {/* Add Scheduled Report Form */}
        {showAddScheduled && (
          <div className="px-6 py-4 bg-sand/10 border-b border-sand/30">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-forest/70 mb-1.5">
                  {language === 'es' ? 'Nombre' : 'Name'}
                </label>
                <input
                  type="text"
                  value={newScheduledName}
                  onChange={(e) => setNewScheduledName(e.target.value)}
                  placeholder={language === 'es' ? 'Nombre del reporte' : 'Report name'}
                  className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-forest"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest/70 mb-1.5">
                  {language === 'es' ? 'Tipo' : 'Type'}
                </label>
                <select
                  value={newScheduledType}
                  onChange={(e) => setNewScheduledType(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all bg-white text-forest"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest/70 mb-1.5">
                  {language === 'es' ? 'Frecuencia' : 'Frequency'}
                </label>
                <select
                  value={newScheduledFrequency}
                  onChange={(e) => setNewScheduledFrequency(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all bg-white text-forest"
                >
                  {frequencyOptions.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddScheduledReport}
                  disabled={!newScheduledName}
                  className="w-full px-4 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {language === 'es' ? 'Agregar' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

        {scheduledReports.length > 0 ? (
          <div className="divide-y divide-sand/20">
            {scheduledReports.map((report) => (
              <div key={report.id} className="px-6 py-4 hover:bg-[#faf8f3] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Calendar size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-forest">{report.name}</p>
                      <p className="text-sm text-forest/50">
                        {report.frequency} - {language === 'es' ? 'Proxima ejecucion' : 'Next run'}: {report.nextRun}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 rounded-full text-sm font-medium text-blue-700">
                      {report.format}
                    </span>
                    <button
                      onClick={() => handleDeleteScheduled(report.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={language === 'es' ? 'Eliminar' : 'Delete'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Calendar size={32} className="text-sand mx-auto mb-2" />
            <p className="text-forest/50">
              {language === 'es' ? 'No hay reportes programados' : 'No scheduled reports'}
            </p>
            <p className="text-sm text-forest/40 mt-1">
              {language === 'es'
                ? 'Agregue reportes para generarlos automaticamente'
                : 'Add reports to generate them automatically'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
