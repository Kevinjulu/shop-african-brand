import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { parse } from 'https://deno.land/std@0.168.0/encoding/csv.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { operation, vendorId } = await req.json()

    if (operation === 'export') {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', vendorId)

      if (error) throw error

      // Convert products to CSV
      const headers = ['name', 'description', 'price', 'category', 'inventory_quantity', 'status']
      const csv = [
        headers.join(','),
        ...products.map(product => 
          headers.map(header => JSON.stringify(product[header])).join(',')
        )
      ].join('\n')

      return new Response(csv, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=products.csv'
        }
      })
    } 
    
    if (operation === 'import') {
      const formData = await req.formData()
      const file = formData.get('file') as File
      
      if (!file) {
        throw new Error('No file provided')
      }

      const content = await file.text()
      const records = parse(content, { skipFirstRow: true })

      const products = records.map(record => ({
        name: record[0],
        description: record[1],
        price: parseFloat(record[2]),
        category: record[3],
        inventory_quantity: parseInt(record[4]),
        status: record[5] || 'draft',
        vendor_id: vendorId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('products')
        .insert(products)

      if (error) throw error

      return new Response(
        JSON.stringify({ message: 'Products imported successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Invalid operation')

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})