-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    featured_image TEXT,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT false,
    publish_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    allow_comments BOOLEAN DEFAULT true,
    author_name TEXT DEFAULT 'Ananth',
    location TEXT
);

-- Blog Likes Table (for tracking user likes)
CREATE TABLE IF NOT EXISTS blog_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_ip TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_ip)
);

-- Blog Comments Table
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_at ON blog_posts(publish_at);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON blog_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);

-- RLS (Row Level Security) Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean re-run)
DROP POLICY IF EXISTS "Public can view published posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can view published or scheduled posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow all operations on blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can view likes" ON blog_likes;
DROP POLICY IF EXISTS "Public can insert likes" ON blog_likes;
DROP POLICY IF EXISTS "Public can delete own likes" ON blog_likes;
DROP POLICY IF EXISTS "Public can view comments" ON blog_comments;
DROP POLICY IF EXISTS "Public can insert comments" ON blog_comments;
DROP POLICY IF EXISTS "Public can delete comments" ON blog_comments;

-- BLOG POSTS POLICIES
-- Allow public to read published posts
CREATE POLICY "Public can view published posts" ON blog_posts
    FOR SELECT USING (published = true);

-- Allow all operations for admin (using anon key for simplicity)
CREATE POLICY "Allow all operations on blog_posts" ON blog_posts
    FOR ALL USING (true) WITH CHECK (true);

-- BLOG LIKES POLICIES
CREATE POLICY "Public can view likes" ON blog_likes
    FOR SELECT USING (true);

CREATE POLICY "Public can insert likes" ON blog_likes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can delete own likes" ON blog_likes
    FOR DELETE USING (true);

-- BLOG COMMENTS POLICIES
CREATE POLICY "Public can view comments" ON blog_comments
    FOR SELECT USING (true);

CREATE POLICY "Public can insert comments" ON blog_comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can delete comments" ON blog_comments
    FOR DELETE USING (true);

-- Functions for incrementing/decrementing counters
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts 
    SET views_count = views_count + 1 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts 
    SET likes_count = likes_count + 1 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts 
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample blog post if table is empty
INSERT INTO blog_posts (title, content, excerpt, slug, tags, published, author_name)
SELECT 
    'Welcome to My Blog',
    '# Welcome to My Blog!

This is my first blog post. I''m excited to share my thoughts, projects, and experiences with you.

## What to Expect

- **Tech tutorials** and coding insights
- **Project showcases** from my portfolio
- **Personal thoughts** on software development
- **Tips and tricks** I''ve learned along the way

## Stay Connected

Feel free to explore my other posts and don''t forget to like and comment!

```javascript
// Here''s a code example
const greeting = "Hello, World!";
console.log(greeting);
```

Thanks for reading! 🚀',
    'Welcome to my blog! I''m excited to share my thoughts, projects, and experiences with you.',
    'welcome-to-my-blog',
    ARRAY['welcome', 'introduction', 'blog'],
    true,
    'Ananth'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts LIMIT 1);
