-- Blog Posts Table
CREATE TABLE blog_posts (
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
    views_count INTEGER DEFAULT 0
);

-- Blog Likes Table (for tracking user likes)
CREATE TABLE blog_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_ip TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_ip)
);

-- Indexes for better performance
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_publish_at ON blog_posts(publish_at);
CREATE INDEX idx_blog_likes_post_id ON blog_likes(post_id);

-- RLS (Row Level Security) Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
CREATE POLICY "Public can view published or scheduled posts" ON blog_posts
    FOR SELECT USING (
        published = true
        OR (publish_at IS NOT NULL AND publish_at <= NOW())
    );

-- Allow public read access to likes
CREATE POLICY "Public can view likes" ON blog_likes
    FOR SELECT USING (true);

-- Allow public insert/delete for likes (for like/unlike functionality)
CREATE POLICY "Public can insert likes" ON blog_likes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can delete own likes" ON blog_likes
    FOR DELETE USING (true);

-- Functions for incrementing/decrementing counters
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts 
    SET views_count = views_count + 1 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts 
    SET likes_count = likes_count + 1 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts 
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
