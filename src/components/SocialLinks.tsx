import React from 'react';
import { Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
  showLabels?: boolean;
  variant?: 'horizontal' | 'vertical';
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className = '',
  iconSize = 20,
  showLabels = false,
  variant = 'horizontal',
}) => {
  const { data: settings } = useSettings();

  const socialLinks = [
    {
      name: 'Facebook',
      url: settings?.facebook_url,
      icon: Facebook,
      color: 'hover:text-[#1877F2]',
    },
    {
      name: 'Instagram',
      url: settings?.instagram_url,
      icon: Instagram,
      color: 'hover:text-[#E4405F]',
    },
    {
      name: 'Twitter',
      url: settings?.twitter_url,
      icon: Twitter,
      color: 'hover:text-[#1DA1F2]',
    },
    {
      name: 'WhatsApp',
      url: settings?.whatsapp_number
        ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`
        : null,
      icon: MessageCircle,
      color: 'hover:text-[#25D366]',
    },
  ].filter((link) => link.url);

  if (socialLinks.length === 0) {
    return null;
  }

  const containerClasses =
    variant === 'horizontal'
      ? `flex items-center gap-4 ${className}`
      : `flex flex-col gap-3 ${className}`;

  return (
    <div className={containerClasses}>
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-muted-foreground transition-colors ${link.color}`}
            title={link.name}
            aria-label={`Visit our ${link.name}`}
          >
            <Icon size={iconSize} />
            {showLabels && <span className="text-sm">{link.name}</span>}
          </a>
        );
      })}
    </div>
  );
};
