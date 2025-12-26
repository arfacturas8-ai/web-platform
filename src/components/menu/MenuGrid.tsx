import React from 'react';
import type { MenuItem as MenuItemType } from '@/types/menu';
import { MenuItem } from './MenuItem';

interface MenuGridProps {
  items: MenuItemType[];
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No items found in this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
};
