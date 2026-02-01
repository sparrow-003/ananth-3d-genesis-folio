import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// Simple admin key for fallback auth (set in secrets)
const ADMIN_KEY = Deno.env.get('ADMIN_SECRET_KEY') || 'alex@2004'

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check admin authentication
    const adminKey = req.headers.get('x-admin-key')
    const authHeader = req.headers.get('authorization')

    // Create Supabase client with service role for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    let isAuthorized = false

    // Check if using admin key (fallback auth)
    if (adminKey === ADMIN_KEY) {
      isAuthorized = true
    }

    // Check if using Supabase JWT with admin role
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (user && !error) {
        // Check admin role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single()
        
        if (roleData) {
          isAuthorized = true
        }
      }
    }

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const path = url.pathname.replace('/admin-blog', '')

    // Route handling
    if (req.method === 'GET' && path === '/posts') {
      // Get all posts (admin view)
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return new Response(JSON.stringify(data), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    if (req.method === 'POST' && path === '/posts') {
      // Create new post
      const body = await req.json()
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          title: body.title,
          content: body.content,
          excerpt: body.excerpt,
          slug: body.slug,
          featured_image: body.featured_image || null,
          tags: body.tags || [],
          published: body.published || false,
          publish_at: body.publish_at || null,
          allow_comments: body.allow_comments ?? true,
          author_name: body.author_name || 'Ananth',
          location: body.location || null,
          likes_count: 0,
          views_count: 0
        }])
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), { 
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    if (req.method === 'PUT' && path.startsWith('/posts/')) {
      // Update post
      const id = path.replace('/posts/', '')
      const body = await req.json()

      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          ...body,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    if (req.method === 'DELETE' && path.startsWith('/posts/')) {
      // Delete post
      const id = path.replace('/posts/', '')

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      return new Response(JSON.stringify({ success: true }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Admin blog error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})