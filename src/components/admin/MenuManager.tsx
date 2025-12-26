import React from 'react';
import { useMenuItems, useDeleteMenuItem } from '@/hooks/useMenu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';


export const MenuManager: React.FC = () => {
  const { t, language } = useLanguage();
  const { addToast } = useToast();
  const { data: menuItems, isLoading } = useMenuItems();
  const deleteMenuItem = useDeleteMenuItem();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteMenuItem.mutateAsync(id);
      addToast({
        title: t('success'),
        description: 'Menu item deleted successfully',
      });
    } catch (error) {
      addToast({
        title: t('error'),
        description: 'Failed to delete menu item',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t('menuItems')}</h2>
        <Button>Add Item</Button>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>{t('price')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {language === 'es' && item.name_es ? item.name_es : item.name}
                </TableCell>
                <TableCell>Category</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.is_available ? t('available') : t('unavailable')}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">
                    {t('edit')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteMenuItem.isPending}
                  >
                    {t('delete')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
