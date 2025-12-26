/**
 * Popup Management Page
 * Admin interface for creating and managing popups
 */
import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { Plus, Edit2, Trash2, Eye, EyeOff, Copy, BarChart2, Video } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { Popup, PopupType, PopupPosition, PopupTrigger } from '@/types/popup';
import { DEFAULT_POPUP_STYLE, DEFAULT_POPUP_FREQUENCY } from '@/types/popup';

const STORAGE_KEY = 'cafe1973_admin_popups';

// Mock popup data for demo
const createDefaultPopup = (): Popup => ({
  id: `popup_${Date.now()}`,
  name: 'Nuevo Popup',
  active: false,
  type: 'modal',
  position: 'center',
  title: 'Bienvenido a Café 1973',
  subtitle: 'Descubre nuestras especialidades',
  content: '',
  showCloseButton: true,
  closeOnOverlayClick: true,
  closeOnEscape: true,
  trigger: {
    type: 'page_load',
    delay: 3,
  },
  targeting: {
    pages: ['*'],
  },
  frequency: DEFAULT_POPUP_FREQUENCY,
  style: DEFAULT_POPUP_STYLE,
  priority: 0,
  trackViews: true,
  trackClicks: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Popup type options
const POPUP_TYPES: { value: PopupType; label: string; labelEs: string }[] = [
  { value: 'modal', label: 'Modal', labelEs: 'Modal' },
  { value: 'banner', label: 'Banner', labelEs: 'Banner' },
  { value: 'slide-in', label: 'Slide-in', labelEs: 'Deslizable' },
  { value: 'toast', label: 'Toast', labelEs: 'Notificación' },
  { value: 'floating', label: 'Floating', labelEs: 'Flotante' },
  { value: 'fullscreen', label: 'Fullscreen', labelEs: 'Pantalla completa' },
];

// Position options
const POSITIONS: { value: PopupPosition; label: string }[] = [
  { value: 'center', label: 'Centro' },
  { value: 'top', label: 'Arriba' },
  { value: 'bottom', label: 'Abajo' },
  { value: 'top-left', label: 'Arriba Izquierda' },
  { value: 'top-right', label: 'Arriba Derecha' },
  { value: 'bottom-left', label: 'Abajo Izquierda' },
  { value: 'bottom-right', label: 'Abajo Derecha' },
  { value: 'left', label: 'Izquierda' },
  { value: 'right', label: 'Derecha' },
];

// Trigger options
const TRIGGERS: { value: PopupTrigger; label: string; labelEs: string }[] = [
  { value: 'page_load', label: 'Page Load', labelEs: 'Carga de página' },
  { value: 'time_delay', label: 'Time Delay', labelEs: 'Retraso de tiempo' },
  { value: 'scroll_depth', label: 'Scroll Depth', labelEs: 'Profundidad de scroll' },
  { value: 'exit_intent', label: 'Exit Intent', labelEs: 'Intención de salida' },
  { value: 'button_click', label: 'Button Click', labelEs: 'Clic en botón' },
  { value: 'inactivity', label: 'Inactivity', labelEs: 'Inactividad' },
  { value: 'add_to_cart', label: 'Add to Cart', labelEs: 'Agregar al carrito' },
  { value: 'first_visit', label: 'First Visit', labelEs: 'Primera visita' },
  { value: 'returning_visit', label: 'Returning Visit', labelEs: 'Visita recurrente' },
];

export const Popups: React.FC = () => {
  const { language } = useLanguage();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Load popups from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPopups(JSON.parse(stored));
      }
    } catch (e) {
      logger.error('Error loading popups:', e);
    }
  }, []);

  // Save popups to localStorage
  const savePopups = (newPopups: Popup[]) => {
    setPopups(newPopups);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPopups));
  };

  const handleCreatePopup = () => {
    setEditingPopup(createDefaultPopup());
    setShowEditor(true);
  };

  const handleEditPopup = (popup: Popup) => {
    setEditingPopup({ ...popup });
    setShowEditor(true);
  };

  const handleDeletePopup = (popupId: string) => {
    if (confirm(language === 'es' ? '¿Eliminar este popup?' : 'Delete this popup?')) {
      savePopups(popups.filter(p => p.id !== popupId));
    }
  };

  const handleDuplicatePopup = (popup: Popup) => {
    const duplicate: Popup = {
      ...popup,
      id: `popup_${Date.now()}`,
      name: `${popup.name} (copia)`,
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    savePopups([...popups, duplicate]);
  };

  const handleToggleActive = (popupId: string) => {
    savePopups(popups.map(p =>
      p.id === popupId ? { ...p, active: !p.active, updatedAt: new Date().toISOString() } : p
    ));
  };

  const handleSavePopup = () => {
    if (!editingPopup) return;

    const updatedPopup = {
      ...editingPopup,
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = popups.findIndex(p => p.id === editingPopup.id);
    if (existingIndex >= 0) {
      const newPopups = [...popups];
      newPopups[existingIndex] = updatedPopup;
      savePopups(newPopups);
    } else {
      savePopups([...popups, updatedPopup]);
    }

    setShowEditor(false);
    setEditingPopup(null);
  };

  const labels = {
    title: language === 'es' ? 'Gestión de Popups' : 'Popup Management',
    create: language === 'es' ? 'Crear Popup' : 'Create Popup',
    noPopups: language === 'es' ? 'No hay popups creados' : 'No popups created',
    active: language === 'es' ? 'Activo' : 'Active',
    inactive: language === 'es' ? 'Inactivo' : 'Inactive',
    trigger: language === 'es' ? 'Disparador' : 'Trigger',
    pages: language === 'es' ? 'Páginas' : 'Pages',
    save: language === 'es' ? 'Guardar' : 'Save',
    cancel: language === 'es' ? 'Cancelar' : 'Cancel',
    editTitle: language === 'es' ? 'Editar Popup' : 'Edit Popup',
    newTitle: language === 'es' ? 'Nuevo Popup' : 'New Popup',
    general: language === 'es' ? 'General' : 'General',
    content: language === 'es' ? 'Contenido' : 'Content',
    display: language === 'es' ? 'Visualización' : 'Display',
    targeting: language === 'es' ? 'Segmentación' : 'Targeting',
    style: language === 'es' ? 'Estilo' : 'Style',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest">{labels.title}</h1>
        <button
          onClick={handleCreatePopup}
          className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition-colors"
        >
          <Plus size={20} />
          {labels.create}
        </button>
      </div>

      {/* Popup List */}
      {popups.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-sand/30">
          <div className="w-16 h-16 bg-sand/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye size={32} className="text-forest/40" />
          </div>
          <p className="text-forest/60">{labels.noPopups}</p>
          <button
            onClick={handleCreatePopup}
            className="mt-4 px-6 py-2 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition-colors"
          >
            {labels.create}
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {popups.map((popup) => (
            <div
              key={popup.id}
              className="bg-white rounded-2xl border border-sand/30 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-forest truncate">{popup.name}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        popup.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {popup.active ? labels.active : labels.inactive}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-sand/30 text-forest/70 rounded-full">
                      {popup.type}
                    </span>
                  </div>
                  <p className="text-sm text-forest/60 mb-2">
                    {popup.title || '(sin título)'}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-forest/50">
                    <span>{labels.trigger}: {TRIGGERS.find(t => t.value === popup.trigger.type)?.labelEs || popup.trigger.type}</span>
                    <span>•</span>
                    <span>{labels.pages}: {popup.targeting.pages?.join(', ') || '*'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(popup.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      popup.active
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={popup.active ? 'Desactivar' : 'Activar'}
                  >
                    {popup.active ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => handleEditPopup(popup)}
                    className="p-2 rounded-lg text-forest/60 hover:bg-sand/20 transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDuplicatePopup(popup)}
                    className="p-2 rounded-lg text-forest/60 hover:bg-sand/20 transition-colors"
                    title="Duplicar"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletePopup(popup.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && editingPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Editor Header */}
            <div className="p-4 border-b border-sand/30 flex items-center justify-between">
              <h2 className="text-xl font-bold text-forest">
                {popups.find(p => p.id === editingPopup.id) ? labels.editTitle : labels.newTitle}
              </h2>
              <button
                onClick={() => { setShowEditor(false); setEditingPopup(null); }}
                className="p-2 rounded-lg hover:bg-sand/20 transition-colors"
              >
                <span className="text-xl">&times;</span>
              </button>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - General & Content */}
                <div className="space-y-6">
                  {/* General Section */}
                  <section>
                    <h3 className="font-semibold text-forest mb-3">{labels.general}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1">
                          Nombre interno
                        </label>
                        <input
                          type="text"
                          value={editingPopup.name}
                          onChange={(e) => setEditingPopup({ ...editingPopup, name: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-forest/70 mb-1">Tipo</label>
                          <select
                            value={editingPopup.type}
                            onChange={(e) => setEditingPopup({ ...editingPopup, type: e.target.value as PopupType })}
                            className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                          >
                            {POPUP_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>
                                {language === 'es' ? t.labelEs : t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-forest/70 mb-1">Posición</label>
                          <select
                            value={editingPopup.position}
                            onChange={(e) => setEditingPopup({ ...editingPopup, position: e.target.value as PopupPosition })}
                            className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                          >
                            {POSITIONS.map((p) => (
                              <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1">Disparador</label>
                        <select
                          value={editingPopup.trigger.type}
                          onChange={(e) => setEditingPopup({
                            ...editingPopup,
                            trigger: { ...editingPopup.trigger, type: e.target.value as PopupTrigger }
                          })}
                          className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                        >
                          {TRIGGERS.map((t) => (
                            <option key={t.value} value={t.value}>
                              {language === 'es' ? t.labelEs : t.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {(editingPopup.trigger.type === 'time_delay' || editingPopup.trigger.type === 'page_load') && (
                        <div>
                          <label className="block text-sm font-medium text-forest/70 mb-1">
                            Retraso (segundos)
                          </label>
                          <input
                            type="number"
                            value={editingPopup.trigger.delay || 0}
                            onChange={(e) => setEditingPopup({
                              ...editingPopup,
                              trigger: { ...editingPopup.trigger, delay: Number(e.target.value) }
                            })}
                            className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                          />
                        </div>
                      )}

                      {editingPopup.trigger.type === 'scroll_depth' && (
                        <div>
                          <label className="block text-sm font-medium text-forest/70 mb-1">
                            Profundidad de scroll (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editingPopup.trigger.scrollDepth || 50}
                            onChange={(e) => setEditingPopup({
                              ...editingPopup,
                              trigger: { ...editingPopup.trigger, scrollDepth: Number(e.target.value) }
                            })}
                            className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                          />
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Content Section */}
                  <section>
                    <h3 className="font-semibold text-forest mb-3">{labels.content}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1">Título</label>
                        <input
                          type="text"
                          value={editingPopup.title || ''}
                          onChange={(e) => setEditingPopup({ ...editingPopup, title: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1">Subtítulo</label>
                        <input
                          type="text"
                          value={editingPopup.subtitle || ''}
                          onChange={(e) => setEditingPopup({ ...editingPopup, subtitle: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1">
                          Contenido (HTML permitido)
                        </label>
                        <textarea
                          value={editingPopup.content || ''}
                          onChange={(e) => setEditingPopup({ ...editingPopup, content: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-forest/70 mb-2">Imagen</label>
                          <ImageUploader
                            value={editingPopup.image}
                            onChange={(url) => setEditingPopup({ ...editingPopup, image: url })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-forest/70 mb-2">
                            <span className="flex items-center gap-2">
                              <Video size={16} />
                              Video Promocional
                            </span>
                          </label>
                          <MediaUploader
                            value={editingPopup.videoUrl}
                            onChange={(url) => setEditingPopup({
                              ...editingPopup,
                              videoUrl: url,
                              videoType: 'uploaded'
                            })}
                            accept="video"
                          />
                          <div className="mt-2 space-y-2">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editingPopup.videoAutoplay || false}
                                onChange={(e) => setEditingPopup({ ...editingPopup, videoAutoplay: e.target.checked })}
                                className="rounded"
                              />
                              Reproducir automáticamente
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editingPopup.videoLoop || false}
                                onChange={(e) => setEditingPopup({ ...editingPopup, videoLoop: e.target.checked })}
                                className="rounded"
                              />
                              Repetir video
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editingPopup.videoMuted !== false}
                                onChange={(e) => setEditingPopup({ ...editingPopup, videoMuted: e.target.checked })}
                                className="rounded"
                              />
                              Iniciar silenciado
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column - Targeting & Style */}
                <div className="space-y-6">
                  {/* Targeting Section */}
                  <section>
                    <h3 className="font-semibold text-forest mb-3">{labels.targeting}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1">
                          Páginas (separadas por coma, * = todas)
                        </label>
                        <input
                          type="text"
                          value={editingPopup.targeting.pages?.join(', ') || '*'}
                          onChange={(e) => setEditingPopup({
                            ...editingPopup,
                            targeting: {
                              ...editingPopup.targeting,
                              pages: e.target.value.split(',').map(p => p.trim())
                            }
                          })}
                          className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                          placeholder="*, /menu, /reservations"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1">
                          Páginas excluidas
                        </label>
                        <input
                          type="text"
                          value={editingPopup.targeting.excludePages?.join(', ') || ''}
                          onChange={(e) => setEditingPopup({
                            ...editingPopup,
                            targeting: {
                              ...editingPopup.targeting,
                              excludePages: e.target.value ? e.target.value.split(',').map(p => p.trim()) : undefined
                            }
                          })}
                          className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                          placeholder="/checkout, /cart"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1">Prioridad</label>
                        <input
                          type="number"
                          value={editingPopup.priority || 0}
                          onChange={(e) => setEditingPopup({ ...editingPopup, priority: Number(e.target.value) })}
                          className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                        />
                        <p className="text-xs text-forest/50 mt-1">Mayor prioridad = se muestra primero</p>
                      </div>
                    </div>
                  </section>

                  {/* Style Section */}
                  <section>
                    <h3 className="font-semibold text-forest mb-3">{labels.style}</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-forest/70 mb-1">Fondo</label>
                          <input
                            type="color"
                            value={editingPopup.style.backgroundColor}
                            onChange={(e) => setEditingPopup({
                              ...editingPopup,
                              style: { ...editingPopup.style, backgroundColor: e.target.value }
                            })}
                            className="w-full h-10 rounded-xl border border-sand/50 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-forest/70 mb-1">Texto</label>
                          <input
                            type="color"
                            value={editingPopup.style.textColor}
                            onChange={(e) => setEditingPopup({
                              ...editingPopup,
                              style: { ...editingPopup.style, textColor: e.target.value }
                            })}
                            className="w-full h-10 rounded-xl border border-sand/50 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-forest/70 mb-1">Acento</label>
                          <input
                            type="color"
                            value={editingPopup.style.accentColor}
                            onChange={(e) => setEditingPopup({
                              ...editingPopup,
                              style: { ...editingPopup.style, accentColor: e.target.value }
                            })}
                            className="w-full h-10 rounded-xl border border-sand/50 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-forest/70 mb-1">
                            Border radius (px)
                          </label>
                          <input
                            type="number"
                            value={editingPopup.style.borderRadius}
                            onChange={(e) => setEditingPopup({
                              ...editingPopup,
                              style: { ...editingPopup.style, borderRadius: Number(e.target.value) }
                            })}
                            className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-forest/70 mb-1">
                            Max width (px)
                          </label>
                          <input
                            type="number"
                            value={editingPopup.style.maxWidth}
                            onChange={(e) => setEditingPopup({
                              ...editingPopup,
                              style: { ...editingPopup.style, maxWidth: Number(e.target.value) }
                            })}
                            className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1">Animación</label>
                        <select
                          value={editingPopup.style.animation || 'scale'}
                          onChange={(e) => setEditingPopup({
                            ...editingPopup,
                            style: { ...editingPopup.style, animation: e.target.value as 'fade' | 'slide' | 'scale' | 'bounce' }
                          })}
                          className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                        >
                          <option value="fade">Fade</option>
                          <option value="slide">Slide</option>
                          <option value="scale">Scale</option>
                          <option value="bounce">Bounce</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingPopup.style.overlay}
                            onChange={(e) => setEditingPopup({
                              ...editingPopup,
                              style: { ...editingPopup.style, overlay: e.target.checked }
                            })}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-forest/70">Mostrar overlay</span>
                        </label>
                      </div>
                    </div>
                  </section>

                  {/* Display Options */}
                  <section>
                    <h3 className="font-semibold text-forest mb-3">{labels.display}</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPopup.showCloseButton !== false}
                          onChange={(e) => setEditingPopup({ ...editingPopup, showCloseButton: e.target.checked })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-forest/70">Mostrar botón de cerrar</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPopup.closeOnOverlayClick !== false}
                          onChange={(e) => setEditingPopup({ ...editingPopup, closeOnOverlayClick: e.target.checked })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-forest/70">Cerrar al hacer clic en overlay</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPopup.closeOnEscape !== false}
                          onChange={(e) => setEditingPopup({ ...editingPopup, closeOnEscape: e.target.checked })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-forest/70">Cerrar con tecla Escape</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPopup.trackViews}
                          onChange={(e) => setEditingPopup({ ...editingPopup, trackViews: e.target.checked })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-forest/70">Rastrear vistas</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPopup.trackClicks}
                          onChange={(e) => setEditingPopup({ ...editingPopup, trackClicks: e.target.checked })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-forest/70">Rastrear clics</span>
                      </label>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Editor Footer */}
            <div className="p-4 border-t border-sand/30 flex justify-end gap-3">
              <button
                onClick={() => { setShowEditor(false); setEditingPopup(null); }}
                className="px-6 py-2 rounded-xl border border-sand/50 text-forest/70 hover:bg-sand/10 transition-colors"
              >
                {labels.cancel}
              </button>
              <button
                onClick={handleSavePopup}
                className="px-6 py-2 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition-colors"
              >
                {labels.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popups;
