import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Search, Tag } from "lucide-react";

interface SEOToolsProps {
  productId: string;
  initialData: {
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string[];
    canonical_url?: string;
  };
}

export const SEOTools = ({ productId, initialData }: SEOToolsProps) => {
  const [seoData, setSeoData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          seo_title: seoData.seo_title,
          seo_description: seoData.seo_description,
          seo_keywords: seoData.seo_keywords,
          canonical_url: seoData.canonical_url,
        })
        .eq('id', productId);

      if (error) throw error;
      toast.success('SEO data updated successfully');
    } catch (error) {
      console.error('Error updating SEO data:', error);
      toast.error('Failed to update SEO data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          SEO Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Tag className="w-4 h-4" />
            SEO Title
          </label>
          <Input
            value={seoData.seo_title || ''}
            onChange={(e) => setSeoData({ ...seoData, seo_title: e.target.value })}
            placeholder="Enter SEO optimized title"
            maxLength={60}
          />
          <p className="text-xs text-gray-500">
            {(seoData.seo_title?.length || 0)}/60 characters
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">SEO Description</label>
          <Textarea
            value={seoData.seo_description || ''}
            onChange={(e) => setSeoData({ ...seoData, seo_description: e.target.value })}
            placeholder="Enter meta description"
            maxLength={160}
          />
          <p className="text-xs text-gray-500">
            {(seoData.seo_description?.length || 0)}/160 characters
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Keywords
          </label>
          <Input
            value={seoData.seo_keywords?.join(', ') || ''}
            onChange={(e) => setSeoData({
              ...seoData,
              seo_keywords: e.target.value.split(',').map(k => k.trim())
            })}
            placeholder="Enter keywords separated by commas"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Canonical URL
          </label>
          <Input
            value={seoData.canonical_url || ''}
            onChange={(e) => setSeoData({ ...seoData, canonical_url: e.target.value })}
            placeholder="Enter canonical URL"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full"
        >
          Save SEO Settings
        </Button>
      </CardContent>
    </Card>
  );
};