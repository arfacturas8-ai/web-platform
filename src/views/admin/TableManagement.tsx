/**
 * Café 1973 | Bakery - Interactive Table Management
 * Visual floor plan with drag-and-drop table positioning
 */
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTables, useCreateTable, useUpdateTable, useDeleteTable } from '@/hooks/useTables';
import { useReservations } from '@/hooks/useReservations';
import { useToast } from '@/components/ui/toast';
import { qrService } from '@/services/qrService';
import type { Table, CreateTableDto } from '@/types/reservation';
import {
  Grid3X3,
  Plus,
  Edit,
  Trash2,
  QrCode,
  Users,
  Move,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  Download,
  Settings,
  Coffee,
  CircleDot,
  Square,
  Circle,
  AlertCircle,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';

interface TablePosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shape: 'square' | 'round' | 'rectangle';
}

type TableStatus = 'available' | 'occupied' | 'reserved' | 'unavailable';

export const TableManagement = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: tables, isLoading, error, refetch } = useTables();
  const createTable = useCreateTable();
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();

  // Fetch today's reservations for table status
  const today = new Date().toISOString().split('T')[0];
  const { data: reservations } = useReservations({ date: today });

  // Map of table_id to reservation status for quick lookup
  const tableReservationStatus = useMemo(() => {
    const statusMap: Record<string, { status: 'reserved' | 'occupied'; reservation?: any }> = {};
    if (!reservations) return statusMap;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    (reservations as any[]).forEach((res: any) => {
      if (!res.table_id || res.status === 'cancelled' || res.status === 'no_show') return;

      // Parse reservation time (assuming format "HH:MM")
      const [hours, minutes] = (res.reservation_time || '').split(':').map(Number);
      const resTimeInMinutes = hours * 60 + minutes;
      const endTimeInMinutes = resTimeInMinutes + 90; // Assume 90-min duration

      if (res.status === 'seated' || res.status === 'in_progress') {
        statusMap[res.table_id] = { status: 'occupied', reservation: res };
      } else if (res.status === 'confirmed' || res.status === 'pending') {
        // If within reservation window, mark as reserved
        if (currentTime >= resTimeInMinutes - 30 && currentTime <= endTimeInMinutes) {
          statusMap[res.table_id] = { status: 'reserved', reservation: res };
        }
      }
    });

    return statusMap;
  }, [reservations]);

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [tablePositions, setTablePositions] = useState<Record<string, TablePosition>>({});
  const floorPlanRef = useRef<HTMLDivElement>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    table_number: '',
    capacity: 4,
    location: '',
    shape: 'square' as 'square' | 'round' | 'rectangle',
    is_active: true
  });

  const getTableStatus = (table: Table): TableStatus => {
    if (!table.is_active) return 'unavailable';
    // Check if table has an active reservation
    const resStatus = tableReservationStatus[table.id];
    if (resStatus) return resStatus.status;
    return 'available';
  };

  const getStatusStyle = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700' };
      case 'occupied':
        return { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700' };
      case 'reserved':
        return { bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-700' };
      case 'unavailable':
        return { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-500' };
    }
  };

  const getStatusLabel = (status: TableStatus) => {
    const labels: Record<TableStatus, Record<string, string>> = {
      available: { es: 'Disponible', en: 'Available' },
      occupied: { es: 'Ocupada', en: 'Occupied' },
      reserved: { es: 'Reservada', en: 'Reserved' },
      unavailable: { es: 'No disponible', en: 'Unavailable' },
    };
    return labels[status][language] || labels[status]['en'];
  };

  const handleDragStart = (e: React.DragEvent, table: Table) => {
    e.dataTransfer.setData('tableId', table.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const tableId = e.dataTransfer.getData('tableId');
    if (!tableId || !floorPlanRef.current) return;

    const rect = floorPlanRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTablePositions(prev => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        id: tableId,
        x: Math.max(5, Math.min(85, x)),
        y: Math.max(5, Math.min(85, y)),
        width: prev[tableId]?.width || 12,
        height: prev[tableId]?.height || 12,
        rotation: prev[tableId]?.rotation || 0,
        shape: prev[tableId]?.shape || 'square'
      }
    }));
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSaveTable = async () => {
    try {
      const data: CreateTableDto = {
        table_number: formData.table_number,
        capacity: formData.capacity,
        location: formData.location || undefined,
        is_active: formData.is_active
      };

      if (editingTable) {
        await updateTable.mutateAsync({ id: editingTable.id, data });
        toast({
          title: language === 'es' ? 'Mesa actualizada' : 'Table updated',
          description: language === 'es' ? 'Los cambios se guardaron correctamente' : 'Changes saved successfully',
        });
      } else {
        await createTable.mutateAsync(data);
        toast({
          title: language === 'es' ? 'Mesa creada' : 'Table created',
          description: language === 'es' ? 'La mesa se agregó correctamente' : 'Table added successfully',
        });
      }
      setShowAddModal(false);
      setEditingTable(null);
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || (language === 'es' ? 'Error al guardar' : 'Failed to save'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (!confirm(language === 'es' ? '¿Eliminar esta mesa?' : 'Delete this table?')) return;
    try {
      await deleteTable.mutateAsync(id);
      toast({
        title: language === 'es' ? 'Mesa eliminada' : 'Table deleted',
      });
      setSelectedTable(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleGenerateQR = async (table: Table) => {
    try {
      await qrService.downloadTableQR(table.id, table.table_number.toString(), 400);
      toast({
        title: language === 'es' ? 'QR descargado' : 'QR downloaded',
        description: `Mesa ${table.table_number}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      table_number: '',
      capacity: 4,
      location: '',
      shape: 'square',
      is_active: true
    });
  };

  const openEditModal = (table: Table) => {
    setEditingTable(table);
    setFormData({
      table_number: table.table_number.toString(),
      capacity: table.capacity,
      location: table.location || '',
      shape: 'square',
      is_active: table.is_active
    });
    setShowAddModal(true);
  };

  // Stats
  const totalTables = tables?.length || 0;
  const activeTables = tables?.filter(t => t.is_active).length || 0;
  const totalCapacity = tables?.reduce((sum, t) => sum + (t.is_active ? t.capacity : 0), 0) || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sand border-t-forest rounded-full animate-spin mx-auto mb-4" />
          <p className="text-forest/60">{language === 'es' ? 'Cargando mesas...' : 'Loading tables...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-forest mb-2">Error</h2>
          <button onClick={() => refetch()} className="px-4 py-2 bg-forest text-white rounded-xl">
            {language === 'es' ? 'Reintentar' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest">
            {language === 'es' ? 'Gestión de Mesas' : 'Table Management'}
          </h1>
          <p className="text-forest/60">
            {language === 'es' ? 'Mapa visual del restaurante' : 'Visual restaurant floor plan'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-sand/30 rounded-xl p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'map' ? 'bg-white text-forest shadow-sm' : 'text-forest/60'
              }`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-forest shadow-sm' : 'text-forest/60'
              }`}
            >
              {language === 'es' ? 'Lista' : 'List'}
            </button>
          </div>
          <button
            onClick={() => { resetForm(); setEditingTable(null); setShowAddModal(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors"
          >
            <Plus size={18} />
            <span>{language === 'es' ? 'Agregar Mesa' : 'Add Table'}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-forest rounded-xl flex items-center justify-center">
              <Grid3X3 size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-forest">{totalTables}</p>
              <p className="text-xs text-forest/60">{language === 'es' ? 'Total Mesas' : 'Total Tables'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-forest">{activeTables}</p>
              <p className="text-xs text-forest/60">{language === 'es' ? 'Activas' : 'Active'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sand rounded-xl flex items-center justify-center">
              <Users size={20} className="text-forest" />
            </div>
            <div>
              <p className="text-2xl font-bold text-forest">{totalCapacity}</p>
              <p className="text-xs text-forest/60">{language === 'es' ? 'Capacidad' : 'Capacity'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Plan / List View */}
      {viewMode === 'map' ? (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          {/* Legend */}
          <div className="px-6 py-3 border-b border-sand/30 flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full" />
              {language === 'es' ? 'Disponible' : 'Available'}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-500 rounded-full" />
              {language === 'es' ? 'Reservada' : 'Reserved'}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              {language === 'es' ? 'Ocupada' : 'Occupied'}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full" />
              {language === 'es' ? 'Inactiva' : 'Inactive'}
            </span>
          </div>

          {/* Floor Plan Canvas */}
          <div
            ref={floorPlanRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`relative min-h-[500px] bg-[#faf8f3] p-6 ${isDragging ? 'bg-sand/20' : ''}`}
            style={{
              backgroundImage: 'radial-gradient(circle, #d1bd92 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            {/* Restaurant Layout Hints */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-forest/10 rounded-lg text-xs text-forest/60">
              {language === 'es' ? 'Entrada' : 'Entrance'}
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 bg-forest/10 rounded-lg text-xs text-forest/60">
              {language === 'es' ? 'Cocina' : 'Kitchen'}
            </div>
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-forest/10 rounded-lg text-xs text-forest/60">
              {language === 'es' ? 'Terraza' : 'Terrace'}
            </div>

            {/* Tables */}
            {tables && tables.length > 0 ? (
              tables.map((table) => {
                const status = getTableStatus(table);
                const style = getStatusStyle(status);
                const position = tablePositions[table.id] || {
                  x: 10 + (tables.indexOf(table) % 5) * 18,
                  y: 15 + Math.floor(tables.indexOf(table) / 5) * 20,
                  width: 14,
                  height: 14,
                  rotation: 0,
                  shape: 'square'
                };

                return (
                  <div
                    key={table.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, table)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedTable(table)}
                    className={`absolute cursor-move transition-all duration-200 hover:scale-105 ${
                      selectedTable?.id === table.id ? 'ring-4 ring-forest ring-offset-2' : ''
                    }`}
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      transform: `rotate(${position.rotation}deg)`,
                    }}
                  >
                    <div
                      className={`${style.bg} ${style.border} border-2 ${
                        position.shape === 'round' ? 'rounded-full' : 'rounded-xl'
                      } flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow`}
                      style={{
                        width: `${position.width * 6}px`,
                        height: `${position.height * 6}px`,
                      }}
                    >
                      <span className="font-bold text-forest text-lg">
                        {table.table_number}
                      </span>
                      <span className="text-xs text-forest/60 flex items-center gap-1">
                        <Users size={10} />
                        {table.capacity}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Coffee size={48} className="text-sand mx-auto mb-4" />
                  <p className="text-forest/50">
                    {language === 'es' ? 'No hay mesas configuradas' : 'No tables configured'}
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 px-4 py-2 bg-forest text-white rounded-xl"
                  >
                    {language === 'es' ? 'Agregar primera mesa' : 'Add first table'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Selected Table Details */}
          {selectedTable && (
            <div className="px-6 py-4 border-t border-sand/30 bg-sand/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{selectedTable.table_number}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-forest">
                      {language === 'es' ? 'Mesa' : 'Table'} {selectedTable.table_number}
                    </h3>
                    <p className="text-sm text-forest/60">
                      {selectedTable.capacity} {language === 'es' ? 'personas' : 'guests'}
                      {selectedTable.location && ` • ${selectedTable.location}`}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(getTableStatus(selectedTable)).bg} ${getStatusStyle(getTableStatus(selectedTable)).text}`}>
                    {getStatusLabel(getTableStatus(selectedTable))}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGenerateQR(selectedTable)}
                    className="p-2 text-forest/60 hover:text-forest hover:bg-white rounded-lg transition-colors"
                    title="QR Code"
                  >
                    <QrCode size={20} />
                  </button>
                  <button
                    onClick={() => openEditModal(selectedTable)}
                    className="p-2 text-forest/60 hover:text-forest hover:bg-white rounded-lg transition-colors"
                    title={language === 'es' ? 'Editar' : 'Edit'}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteTable(selectedTable.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={language === 'es' ? 'Eliminar' : 'Delete'}
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedTable(null)}
                    className="p-2 text-forest/40 hover:text-forest hover:bg-white rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="divide-y divide-sand/20">
            {tables && tables.length > 0 ? (
              tables.map((table) => {
                const status = getTableStatus(table);
                const style = getStatusStyle(status);

                return (
                  <div
                    key={table.id}
                    className="p-4 hover:bg-[#faf8f3] transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">{table.table_number}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-forest">
                          {language === 'es' ? 'Mesa' : 'Table'} {table.table_number}
                        </h3>
                        <p className="text-sm text-forest/60">
                          {table.capacity} {language === 'es' ? 'personas' : 'guests'}
                          {table.location && ` • ${table.location}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                        {getStatusLabel(status)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleGenerateQR(table)}
                          className="p-2 text-forest/60 hover:text-forest hover:bg-sand/30 rounded-lg transition-colors"
                        >
                          <QrCode size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(table)}
                          className="p-2 text-forest/60 hover:text-forest hover:bg-sand/30 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTable(table.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <Coffee size={48} className="text-sand mx-auto mb-4" />
                <p className="text-forest/50">
                  {language === 'es' ? 'No hay mesas configuradas' : 'No tables configured'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-scale-in">
            <div className="px-6 py-4 border-b border-sand/30 flex items-center justify-between">
              <h2 className="text-lg font-bold text-forest">
                {editingTable
                  ? (language === 'es' ? 'Editar Mesa' : 'Edit Table')
                  : (language === 'es' ? 'Nueva Mesa' : 'New Table')}
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setEditingTable(null); resetForm(); }}
                className="p-2 text-forest/40 hover:text-forest rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-1.5">
                  {language === 'es' ? 'Número de Mesa' : 'Table Number'} *
                </label>
                <input
                  type="number"
                  value={formData.table_number}
                  onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#faf8f3] rounded-xl border border-sand/30 text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1.5">
                  {language === 'es' ? 'Capacidad' : 'Capacity'} *
                </label>
                <div className="flex gap-2">
                  {[2, 4, 6, 8, 10].map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setFormData({ ...formData, capacity: cap })}
                      className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
                        formData.capacity === cap
                          ? 'bg-forest text-white'
                          : 'bg-[#faf8f3] text-forest hover:bg-sand/30'
                      }`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1.5">
                  {language === 'es' ? 'Ubicación' : 'Location'}
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#faf8f3] rounded-xl border border-sand/30 text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                >
                  <option value="">{language === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                  <option value="interior">{language === 'es' ? 'Interior' : 'Indoor'}</option>
                  <option value="terraza">{language === 'es' ? 'Terraza' : 'Terrace'}</option>
                  <option value="ventana">{language === 'es' ? 'Ventana' : 'Window'}</option>
                  <option value="privado">{language === 'es' ? 'Privado' : 'Private'}</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-sand/30 text-forest focus:ring-forest/20"
                />
                <label htmlFor="is_active" className="text-sm text-forest">
                  {language === 'es' ? 'Mesa activa (disponible para reservas)' : 'Active table (available for reservations)'}
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-sand/30 flex gap-3">
              <button
                onClick={() => { setShowAddModal(false); setEditingTable(null); resetForm(); }}
                className="flex-1 px-4 py-2.5 bg-sand/30 text-forest rounded-xl font-medium hover:bg-sand/50 transition-colors"
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveTable}
                disabled={!formData.table_number || createTable.isPending || updateTable.isPending}
                className="flex-1 px-4 py-2.5 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition-colors disabled:opacity-50"
              >
                {createTable.isPending || updateTable.isPending
                  ? (language === 'es' ? 'Guardando...' : 'Saving...')
                  : (language === 'es' ? 'Guardar' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagement;
