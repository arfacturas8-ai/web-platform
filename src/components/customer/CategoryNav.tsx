import { Button } from '@/components/ui/button';
import type { Category } from '@/types/menu';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export const CategoryNav = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryNavProps) => {
  return (
    <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex gap-2 overflow-x-auto p-4">
        <Button
          variant={activeCategory === null ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onCategoryChange(null)}
        >
          All
        </Button>
        {categories
          .filter((cat) => cat.is_active)
          .sort((a, b) => a.display_order - b.display_order)
          .map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
      </div>
    </nav>
  );
};
