import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const BulkOperations = ({ vendorId }: { vendorId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;

    setIsLoading(true);
    const file = event.target.files[0];

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/bulk-products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          operation: 'import',
          vendorId,
          formData
        })
      });

      if (!response.ok) throw new Error('Import failed');

      toast.success('Products imported successfully');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/bulk-products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'export',
          vendorId
        })
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Products exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export products');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('bulk-import')?.click()}
            disabled={isLoading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Products
          </Button>
          <input
            id="bulk-import"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Products
          </Button>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <p>
            Upload a CSV file with the following columns: name, description, price,
            category, inventory_quantity, status. Download a template by using the
            export function.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};