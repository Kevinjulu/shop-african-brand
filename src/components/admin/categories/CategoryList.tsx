import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Package } from "lucide-react";
import { Category } from "@/types/admin";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  editingCategory: Category | null;
  onEditChange: (field: string, value: string) => void;
  onSave: (id: string) => void;
}

export const CategoryList = ({
  categories,
  onEdit,
  onDelete,
  editingCategory,
  onEditChange,
  onSave,
}: CategoryListProps) => {
  const { data: productCounts } = useQuery({
    queryKey: ['category-product-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category, count')
        .count()
        .group('category');

      if (error) {
        console.error('Error fetching product counts:', error);
        return {};
      }

      return data.reduce((acc, curr) => ({
        ...acc,
        [curr.category]: curr.count
      }), {});
    }
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories?.map((category) => (
          <TableRow key={category.id}>
            <TableCell>
              {editingCategory?.id === category.id ? (
                <Input
                  value={editingCategory.name}
                  onChange={(e) => onEditChange("name", e.target.value)}
                />
              ) : (
                category.name
              )}
            </TableCell>
            <TableCell>
              {editingCategory?.id === category.id ? (
                <Input
                  value={editingCategory.description || ""}
                  onChange={(e) => onEditChange("description", e.target.value)}
                />
              ) : (
                category.description
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>{productCounts?.[category.name] || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {editingCategory?.id === category.id ? (
                  <Button
                    variant="outline"
                    onClick={() => onSave(category.id)}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => onDelete(category.id)}
                  disabled={productCounts?.[category.name] > 0}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};