import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import { Facebook, MessageCircle, Link as LinkIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2 } from 'lucide-react';

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  title,
  description,
  url,
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareText = description
    ? `${title} - ${description}`
    : title;

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareText}\n${shareUrl}`
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        logger.error('Error sharing:', err);
      }
    }
  };

  // Check if native share is available
  const hasNativeShare = typeof navigator !== 'undefined' && navigator.share;

  if (hasNativeShare) {
    // On mobile devices with native share, use a single button
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNativeShare}
        className="h-8"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleFacebookShare}>
          <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" />
          <span>Share on Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsAppShare}>
          <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" />
          <span>Share on WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon className="mr-2 h-4 w-4" />
              <span>Copy Link</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
