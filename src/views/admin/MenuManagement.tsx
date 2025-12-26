import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DataTable, Column } from '@/components/admin/DataTable';
import { BulkActions } from '@/components/admin/BulkActions';
import { CategoryDialog } from '@/components/dialogs/CategoryDialog';
import { MenuItemDialog } from '@/components/dialogs/MenuItemDialog';
import { useToast } from '@/components/ui/toast';
import { Plus, Edit, Trash2, Grid, List } from 'lucide-react';
import { useMenu, useAllergens } from '@/hooks/useMenu';
import { MenuImportExport } from '@/components/admin/MenuImportExport';
import { getImageUrl } from '@/utils/constants';
import type { Category, MenuItem, CreateCategoryDto, CreateMenuItemDto } from '@/types/menu';

export const MenuManagement = () => {
  const { toast } = useToast();
  const {
    categories,
    menuItems,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    refetch,
  } = useMenu();

  const { data: allergens } = useAllergens();

  const [view, setView] = useState<'categories' | 'items'>('items');
  const [categoryDialog, setCategoryDialog] = useState<{
    open: boolean;
    category?: Category;
  }>({ open: false });
  const [menuItemDialog, setMenuItemDialog] = useState<{
    open: boolean;
    item?: MenuItem;
  }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'category' | 'item';
    id?: string;
  }>({ open: false, type: 'item' });
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);

  const handleSaveCategory = async (data: CreateCategoryDto) => {
    try {
      if (categoryDialog.category) {
        await updateCategory.mutateAsync({
          id: categoryDialog.category.id,
          data,
        });
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        await createCategory.mutateAsync(data);
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save category',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleSaveMenuItem = async (data: CreateMenuItemDto) => {
    try {
      if (menuItemDialog.item) {
        await updateMenuItem.mutateAsync({
          id: menuItemDialog.item.id,
          data,
        });
        toast({
          title: 'Success',
          description: 'Menu item updated successfully',
        });
      } else {
        await createMenuItem.mutateAsync(data);
        toast({
          title: 'Success',
          description: 'Menu item created successfully',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save menu item',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteDialog.type === 'category' && deleteDialog.id) {
        await deleteCategory.mutateAsync(deleteDialog.id);
        toast({
          title: 'Success',
          description: 'Category deleted successfully',
        });
      } else if (deleteDialog.type === 'item' && deleteDialog.id) {
        await deleteMenuItem.mutateAsync(deleteDialog.id);
        toast({
          title: 'Success',
          description: 'Menu item deleted successfully',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete',
        variant: 'destructive',
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) return;

    try {
      if (action === 'delete') {
        await Promise.all(
          selectedItems.map((item) => deleteMenuItem.mutateAsync(item.id))
        );
        toast({
          title: 'Success',
          description: `${selectedItems.length} items deleted`,
        });
        setSelectedItems([]);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Bulk action failed',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading menu..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load menu data"
        onRetry={() => refetch()}
      />
    );
  }

  const categoryColumns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
    },
    {
      key: 'description',
      header: 'Description',
      render: (cat) => cat.description || '-',
    },
    {
      key: 'display_order',
      header: 'Order',
      sortable: true,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (cat) => (
        <Badge variant={cat.is_active ? 'success' : 'outline'}>
          {cat.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (cat) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setCategoryDialog({ open: true, category: cat });
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialog({ open: true, type: 'category', id: cat.id });
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const itemColumns: Column<MenuItem>[] = [
    {
      key: 'image_url',
      header: 'Image',
      render: (item) =>
        item.image_url ? (
          <img
            src={getImageUrl(item.image_url)}
            alt={item.name}
            className="h-12 w-12 rounded object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded bg-muted" />
        ),
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
    },
    {
      key: 'category_id',
      header: 'Category',
      render: (item) =>
        categories.data?.find((c) => c.id === item.category_id)?.name || '-',
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (item) => `$${item.price.toFixed(2)}`,
    },
    {
      key: 'is_available',
      header: 'Available',
      render: (item) => (
        <Badge variant={item.is_available ? 'success' : 'outline'}>
          {item.is_available ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      key: 'is_featured',
      header: 'Featured',
      render: (item) =>
        item.is_featured ? <Badge variant="default">Featured</Badge> : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setMenuItemDialog({ open: true, item });
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialog({ open: true, type: 'item', id: item.id });
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">
            Manage categories and menu items
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Import/Export */}
          <MenuImportExport
            categories={categories.data || []}
            menuItems={menuItems.data || []}
            onImportComplete={() => refetch()}
          />

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={view === 'categories' ? 'default' : 'outline'}
              onClick={() => setView('categories')}
            >
              Categories
            </Button>
            <Button
              variant={view === 'items' ? 'default' : 'outline'}
              onClick={() => setView('items')}
            >
              Items
            </Button>
          </div>
        </div>
      </div>

      {view === 'categories' ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categories</CardTitle>
            <Button onClick={() => setCategoryDialog({ open: true })}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </CardHeader>
          <CardContent>
            {categories.data && categories.data.length > 0 ? (
              <DataTable
                data={categories.data}
                columns={categoryColumns}
                searchable
                searchPlaceholder="Search categories..."
              />
            ) : (
              <EmptyState
                title="No categories"
                description="Create your first category to get started"
                action={{
                  label: 'Add Category',
                  onClick: () => setCategoryDialog({ open: true }),
                }}
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Menu Items</CardTitle>
            <Button onClick={() => setMenuItemDialog({ open: true })}>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <BulkActions
              selectedCount={selectedItems.length}
              actions={[
                {
                  value: 'delete',
                  label: 'Delete selected',
                  variant: 'destructive',
                },
              ]}
              onAction={handleBulkAction}
              onClearSelection={() => setSelectedItems([])}
            />

            {menuItems.data && menuItems.data.length > 0 ? (
              <DataTable
                data={menuItems.data}
                columns={itemColumns}
                searchable
                searchPlaceholder="Search menu items..."
                selectable
                onSelectionChange={setSelectedItems}
              />
            ) : (
              <EmptyState
                title="No menu items"
                description="Create your first menu item to get started"
                action={{
                  label: 'Add Menu Item',
                  onClick: () => setMenuItemDialog({ open: true }),
                }}
              />
            )}
          </CardContent>
        </Card>
      )}

      <CategoryDialog
        open={categoryDialog.open}
        onOpenChange={(open) => setCategoryDialog({ open })}
        category={categoryDialog.category}
        onSave={handleSaveCategory}
      />

      <MenuItemDialog
        open={menuItemDialog.open}
        onOpenChange={(open) => setMenuItemDialog({ open })}
        item={menuItemDialog.item}
        categories={categories.data || []}
        allergens={allergens || []}
        onSave={handleSaveMenuItem}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title={`Delete ${deleteDialog.type}`}
        description="Are you sure? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default MenuManagement;
