/**
 * Content Manager Page
 * Admin interface for managing home page banners, sections, and content
 */
import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical, Save, Image, Video } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { getImageUrl } from '@/utils/constants';
import type {
  HeroBanner,
  FeatureItem,
  PromoBanner,
  Testimonial,
  GalleryImage,
} from '@/types/content';
import {
  DEFAULT_HERO,
  DEFAULT_FEATURES,
  AVAILABLE_ICONS,
} from '@/types/content';

const CONTENT_STORAGE_KEY = 'cafe1973_site_content';

interface TabProps {
  id: string;
  label: string;
  labelEs: string;
}

const tabs: TabProps[] = [
  { id: 'hero', label: 'Hero Banner', labelEs: 'Banner Principal' },
  { id: 'features', label: 'Features', labelEs: 'Características' },
  { id: 'promo', label: 'Promo Banner', labelEs: 'Banner Promocional' },
  { id: 'testimonials', label: 'Testimonials', labelEs: 'Testimonios' },
  { id: 'gallery', label: 'Gallery', labelEs: 'Galería' },
];

export const ContentManager: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('hero');
  const [hero, setHero] = useState<HeroBanner>(DEFAULT_HERO);
  const [features, setFeatures] = useState<FeatureItem[]>(DEFAULT_FEATURES);
  const [promo, setPromo] = useState<PromoBanner | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load content from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (stored) {
        const content = JSON.parse(stored);
        if (content.hero) setHero(content.hero);
        if (content.features) setFeatures(content.features);
        if (content.promo) setPromo(content.promo);
        if (content.testimonials) setTestimonials(content.testimonials);
        if (content.gallery) setGallery(content.gallery);
      }
    } catch (e) {
      logger.error('Error loading content:', e);
    }
  }, []);

  // Save content
  const saveContent = () => {
    setIsSaving(true);
    try {
      const content = {
        hero,
        features,
        promo,
        testimonials,
        gallery,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
      setHasChanges(false);
    } catch (e) {
      logger.error('Error saving content:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const markChanged = () => setHasChanges(true);

  const labels = {
    title: language === 'es' ? 'Gestor de Contenido' : 'Content Manager',
    save: language === 'es' ? 'Guardar Cambios' : 'Save Changes',
    saving: language === 'es' ? 'Guardando...' : 'Saving...',
    unsaved: language === 'es' ? 'Cambios sin guardar' : 'Unsaved changes',
    addFeature: language === 'es' ? 'Agregar Característica' : 'Add Feature',
    addTestimonial: language === 'es' ? 'Agregar Testimonio' : 'Add Testimonial',
    addImage: language === 'es' ? 'Agregar Imagen' : 'Add Image',
    addVideo: language === 'es' ? 'Agregar Video' : 'Add Video',
  };

  // Hero editor
  const renderHeroEditor = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-sand/30 p-6">
        <h3 className="font-semibold text-forest mb-4">
          {language === 'es' ? 'Configuración del Banner Principal' : 'Hero Banner Configuration'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-forest/70 mb-1">
              {language === 'es' ? 'Título (Inglés)' : 'Title (English)'}
            </label>
            <input
              type="text"
              value={hero.title}
              onChange={(e) => { setHero({ ...hero, title: e.target.value }); markChanged(); }}
              className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest/70 mb-1">
              {language === 'es' ? 'Título (Español)' : 'Title (Spanish)'}
            </label>
            <input
              type="text"
              value={hero.title_es}
              onChange={(e) => { setHero({ ...hero, title_es: e.target.value }); markChanged(); }}
              className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-forest/70 mb-1">Subtitle (EN)</label>
            <input
              type="text"
              value={hero.subtitle || ''}
              onChange={(e) => { setHero({ ...hero, subtitle: e.target.value }); markChanged(); }}
              className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest/70 mb-1">Subtitle (ES)</label>
            <input
              type="text"
              value={hero.subtitle_es || ''}
              onChange={(e) => { setHero({ ...hero, subtitle_es: e.target.value }); markChanged(); }}
              className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
            />
          </div>

          {/* Tagline */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-forest/70 mb-1">Tagline (EN)</label>
            <textarea
              value={hero.tagline || ''}
              onChange={(e) => { setHero({ ...hero, tagline: e.target.value }); markChanged(); }}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-forest/70 mb-1">Tagline (ES)</label>
            <textarea
              value={hero.tagline_es || ''}
              onChange={(e) => { setHero({ ...hero, tagline_es: e.target.value }); markChanged(); }}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
            />
          </div>

          {/* Image and Video */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-forest/70 mb-2">
                {language === 'es' ? 'Imagen de Fondo' : 'Background Image'}
              </label>
              <ImageUploader
                value={hero.image_url ? getImageUrl(hero.image_url) : undefined}
                onChange={(url) => { setHero({ ...hero, image_url: url }); markChanged(); }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest/70 mb-2">
                <span className="flex items-center gap-2">
                  <Video size={16} />
                  {language === 'es' ? 'Video de Fondo (Opcional)' : 'Background Video (Optional)'}
                </span>
              </label>
              <MediaUploader
                value={hero.video_url ? getImageUrl(hero.video_url) : undefined}
                onChange={(url) => { setHero({ ...hero, video_url: url }); markChanged(); }}
                accept="video"
              />
              {hero.video_url && (
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hero.video_autoplay !== false}
                      onChange={(e) => { setHero({ ...hero, video_autoplay: e.target.checked }); markChanged(); }}
                      className="rounded"
                    />
                    {language === 'es' ? 'Reproducir automáticamente' : 'Autoplay'}
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hero.video_loop !== false}
                      onChange={(e) => { setHero({ ...hero, video_loop: e.target.checked }); markChanged(); }}
                      className="rounded"
                    />
                    {language === 'es' ? 'Repetir video' : 'Loop video'}
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hero.video_muted !== false}
                      onChange={(e) => { setHero({ ...hero, video_muted: e.target.checked }); markChanged(); }}
                      className="rounded"
                    />
                    {language === 'es' ? 'Silenciado' : 'Muted'}
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* CTA Primary */}
          <div>
            <label className="block text-sm font-medium text-forest/70 mb-1">CTA Primary (EN)</label>
            <input
              type="text"
              value={hero.cta_primary_text || ''}
              onChange={(e) => { setHero({ ...hero, cta_primary_text: e.target.value }); markChanged(); }}
              className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest/70 mb-1">CTA Primary Link</label>
            <input
              type="text"
              value={hero.cta_primary_link || ''}
              onChange={(e) => { setHero({ ...hero, cta_primary_link: e.target.value }); markChanged(); }}
              className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
              placeholder="/menu"
            />
          </div>

          {/* CTA Secondary */}
          <div>
            <label className="block text-sm font-medium text-forest/70 mb-1">CTA Secondary (EN)</label>
            <input
              type="text"
              value={hero.cta_secondary_text || ''}
              onChange={(e) => { setHero({ ...hero, cta_secondary_text: e.target.value }); markChanged(); }}
              className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest/70 mb-1">CTA Secondary Link</label>
            <input
              type="text"
              value={hero.cta_secondary_link || ''}
              onChange={(e) => { setHero({ ...hero, cta_secondary_link: e.target.value }); markChanged(); }}
              className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
              placeholder="/reservations"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Features editor
  const renderFeaturesEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-forest">
          {language === 'es' ? 'Características del Negocio' : 'Business Features'}
        </h3>
        <button
          onClick={() => {
            setFeatures([
              ...features,
              {
                id: `f${Date.now()}`,
                icon: 'Star',
                title: '',
                title_es: '',
                description: '',
                description_es: '',
                is_active: true,
                display_order: features.length,
              },
            ]);
            markChanged();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors"
        >
          <Plus size={18} />
          {labels.addFeature}
        </button>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className="bg-white rounded-2xl border border-sand/30 p-4"
          >
            <div className="flex items-start gap-4">
              <button className="p-2 text-forest/40 hover:text-forest cursor-grab">
                <GripVertical size={20} />
              </button>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest/70 mb-1">Icon</label>
                  <select
                    value={feature.icon}
                    onChange={(e) => {
                      const updated = [...features];
                      updated[index].icon = e.target.value;
                      setFeatures(updated);
                      markChanged();
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                  >
                    {AVAILABLE_ICONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest/70 mb-1">Title (EN)</label>
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => {
                      const updated = [...features];
                      updated[index].title = e.target.value;
                      setFeatures(updated);
                      markChanged();
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest/70 mb-1">Title (ES)</label>
                  <input
                    type="text"
                    value={feature.title_es}
                    onChange={(e) => {
                      const updated = [...features];
                      updated[index].title_es = e.target.value;
                      setFeatures(updated);
                      markChanged();
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest/70 mb-1">Description (EN)</label>
                  <input
                    type="text"
                    value={feature.description}
                    onChange={(e) => {
                      const updated = [...features];
                      updated[index].description = e.target.value;
                      setFeatures(updated);
                      markChanged();
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest/70 mb-1">Description (ES)</label>
                  <input
                    type="text"
                    value={feature.description_es}
                    onChange={(e) => {
                      const updated = [...features];
                      updated[index].description_es = e.target.value;
                      setFeatures(updated);
                      markChanged();
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const updated = [...features];
                    updated[index].is_active = !updated[index].is_active;
                    setFeatures(updated);
                    markChanged();
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    feature.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {feature.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => {
                    setFeatures(features.filter((_, i) => i !== index));
                    markChanged();
                  }}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Promo banner editor
  const renderPromoEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-forest">
          {language === 'es' ? 'Banner Promocional (Top de página)' : 'Promo Banner (Top of page)'}
        </h3>
        {!promo && (
          <button
            onClick={() => {
              setPromo({
                id: `promo_${Date.now()}`,
                text: '',
                text_es: '',
                background_color: '#223833',
                text_color: '#ffffff',
                is_active: false,
                dismissible: true,
              });
              markChanged();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors"
          >
            <Plus size={18} />
            {language === 'es' ? 'Crear Banner' : 'Create Banner'}
          </button>
        )}
      </div>

      {promo && (
        <div className="bg-white rounded-2xl border border-sand/30 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-forest/70 mb-1">Text (EN)</label>
              <input
                type="text"
                value={promo.text}
                onChange={(e) => { setPromo({ ...promo, text: e.target.value }); markChanged(); }}
                className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                placeholder="Free delivery on orders over $20!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest/70 mb-1">Text (ES)</label>
              <input
                type="text"
                value={promo.text_es}
                onChange={(e) => { setPromo({ ...promo, text_es: e.target.value }); markChanged(); }}
                className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                placeholder="Envío gratis en pedidos mayores a ₡10,000!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest/70 mb-1">Link (opcional)</label>
              <input
                type="text"
                value={promo.link || ''}
                onChange={(e) => { setPromo({ ...promo, link: e.target.value }); markChanged(); }}
                className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                placeholder="/menu"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-forest/70 mb-1">Background</label>
                <input
                  type="color"
                  value={promo.background_color}
                  onChange={(e) => { setPromo({ ...promo, background_color: e.target.value }); markChanged(); }}
                  className="w-full h-10 rounded-xl border border-sand/50 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-forest/70 mb-1">Text Color</label>
                <input
                  type="color"
                  value={promo.text_color}
                  onChange={(e) => { setPromo({ ...promo, text_color: e.target.value }); markChanged(); }}
                  className="w-full h-10 rounded-xl border border-sand/50 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-sand/20">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={promo.is_active}
                  onChange={(e) => { setPromo({ ...promo, is_active: e.target.checked }); markChanged(); }}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-forest/70">{language === 'es' ? 'Activo' : 'Active'}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={promo.dismissible}
                  onChange={(e) => { setPromo({ ...promo, dismissible: e.target.checked }); markChanged(); }}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-forest/70">{language === 'es' ? 'Puede cerrarse' : 'Dismissible'}</span>
              </label>
            </div>
            <button
              onClick={() => { setPromo(null); markChanged(); }}
              className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              {language === 'es' ? 'Eliminar' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Gallery editor
  const renderGalleryEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-forest">
          {language === 'es' ? 'Galería de Medios' : 'Media Gallery'}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setGallery([
                ...gallery,
                {
                  id: `img_${Date.now()}`,
                  image_url: '',
                  alt_text: '',
                  alt_text_es: '',
                  media_type: 'image',
                  is_active: true,
                  display_order: gallery.length,
                },
              ]);
              markChanged();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors"
          >
            <Image size={18} />
            {labels.addImage}
          </button>
          <button
            onClick={() => {
              setGallery([
                ...gallery,
                {
                  id: `vid_${Date.now()}`,
                  image_url: '',
                  video_url: '',
                  alt_text: '',
                  alt_text_es: '',
                  media_type: 'video',
                  is_active: true,
                  display_order: gallery.length,
                },
              ]);
              markChanged();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-forest/80 text-white rounded-xl hover:bg-forest/70 transition-colors"
          >
            <Video size={18} />
            {labels.addVideo}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((item, index) => (
          <div key={item.id} className="bg-white rounded-2xl border border-sand/30 overflow-hidden p-4">
            {/* Media type badge */}
            <div className="flex items-center gap-2 mb-3">
              {item.media_type === 'video' ? (
                <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  <Video size={12} />
                  Video
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  <Image size={12} />
                  {language === 'es' ? 'Imagen' : 'Image'}
                </span>
              )}
            </div>

            {/* Media uploader */}
            {item.media_type === 'video' ? (
              <MediaUploader
                value={item.video_url ? getImageUrl(item.video_url) : undefined}
                onChange={(url) => {
                  const updated = [...gallery];
                  updated[index].video_url = url;
                  setGallery(updated);
                  markChanged();
                }}
                accept="video"
              />
            ) : (
              <ImageUploader
                value={item.image_url ? getImageUrl(item.image_url) : undefined}
                onChange={(url) => {
                  const updated = [...gallery];
                  updated[index].image_url = url;
                  setGallery(updated);
                  markChanged();
                }}
              />
            )}

            <div className="mt-3 space-y-3">
              <input
                type="text"
                value={item.alt_text}
                onChange={(e) => {
                  const updated = [...gallery];
                  updated[index].alt_text = e.target.value;
                  setGallery(updated);
                  markChanged();
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-sand/50 focus:outline-none focus:border-forest"
                placeholder={item.media_type === 'video' ? (language === 'es' ? 'Descripción (EN)' : 'Description (EN)') : 'Alt text (EN)'}
              />
              <input
                type="text"
                value={item.alt_text_es || ''}
                onChange={(e) => {
                  const updated = [...gallery];
                  updated[index].alt_text_es = e.target.value;
                  setGallery(updated);
                  markChanged();
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-sand/50 focus:outline-none focus:border-forest"
                placeholder={item.media_type === 'video' ? (language === 'es' ? 'Descripción (ES)' : 'Description (ES)') : 'Alt text (ES)'}
              />
              <select
                value={item.category || ''}
                onChange={(e) => {
                  const updated = [...gallery];
                  updated[index].category = e.target.value;
                  setGallery(updated);
                  markChanged();
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-sand/50 focus:outline-none focus:border-forest"
              >
                <option value="">{language === 'es' ? 'Categoría (opcional)' : 'Category (optional)'}</option>
                <option value="food">{language === 'es' ? 'Comida' : 'Food'}</option>
                <option value="drinks">{language === 'es' ? 'Bebidas' : 'Drinks'}</option>
                <option value="interior">{language === 'es' ? 'Interior' : 'Interior'}</option>
                <option value="team">{language === 'es' ? 'Equipo' : 'Team'}</option>
                <option value="promo">{language === 'es' ? 'Promociones' : 'Promotions'}</option>
              </select>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    const updated = [...gallery];
                    updated[index].is_active = !updated[index].is_active;
                    setGallery(updated);
                    markChanged();
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    item.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {item.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => {
                    setGallery(gallery.filter((_, i) => i !== index));
                    markChanged();
                  }}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Testimonials editor (simplified)
  const renderTestimonialsEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-forest">
          {language === 'es' ? 'Testimonios y Reseñas' : 'Testimonials & Reviews'}
        </h3>
        <button
          onClick={() => {
            setTestimonials([
              ...testimonials,
              {
                id: `t_${Date.now()}`,
                author_name: '',
                rating: 5,
                text: '',
                is_active: true,
                display_order: testimonials.length,
              },
            ]);
            markChanged();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl hover:bg-forest/90 transition-colors"
        >
          <Plus size={18} />
          {labels.addTestimonial}
        </button>
      </div>

      <div className="space-y-4">
        {testimonials.map((t, index) => (
          <div key={t.id} className="bg-white rounded-2xl border border-sand/30 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest/70 mb-1">Author</label>
                <input
                  type="text"
                  value={t.author_name}
                  onChange={(e) => {
                    const updated = [...testimonials];
                    updated[index].author_name = e.target.value;
                    setTestimonials(updated);
                    markChanged();
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest/70 mb-1">Rating</label>
                <select
                  value={t.rating}
                  onChange={(e) => {
                    const updated = [...testimonials];
                    updated[index].rating = parseInt(e.target.value);
                    setTestimonials(updated);
                    markChanged();
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} estrellas</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest/70 mb-1">Source</label>
                <input
                  type="text"
                  value={t.source || ''}
                  onChange={(e) => {
                    const updated = [...testimonials];
                    updated[index].source = e.target.value;
                    setTestimonials(updated);
                    markChanged();
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                  placeholder="Google, TripAdvisor..."
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-forest/70 mb-1">Review Text</label>
                <textarea
                  value={t.text}
                  onChange={(e) => {
                    const updated = [...testimonials];
                    updated[index].text = e.target.value;
                    setTestimonials(updated);
                    markChanged();
                  }}
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl border border-sand/50 focus:outline-none focus:border-forest"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => {
                  const updated = [...testimonials];
                  updated[index].is_active = !updated[index].is_active;
                  setTestimonials(updated);
                  markChanged();
                }}
                className={`p-2 rounded-lg transition-colors ${
                  t.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {t.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button
                onClick={() => {
                  setTestimonials(testimonials.filter((_, i) => i !== index));
                  markChanged();
                }}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest">{labels.title}</h1>
          {hasChanges && (
            <p className="text-sm text-amber-600 mt-1">{labels.unsaved}</p>
          )}
        </div>
        <button
          onClick={saveContent}
          disabled={isSaving || !hasChanges}
          className="flex items-center gap-2 px-6 py-2 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? labels.saving : labels.save}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-forest text-white'
                : 'bg-sand/20 text-forest hover:bg-sand/40'
            }`}
          >
            {language === 'es' ? tab.labelEs : tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'hero' && renderHeroEditor()}
        {activeTab === 'features' && renderFeaturesEditor()}
        {activeTab === 'promo' && renderPromoEditor()}
        {activeTab === 'testimonials' && renderTestimonialsEditor()}
        {activeTab === 'gallery' && renderGalleryEditor()}
      </div>
    </div>
  );
};

export default ContentManager;
