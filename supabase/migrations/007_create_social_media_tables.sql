CREATE TABLE social_platforms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    connected BOOLEAN NOT NULL DEFAULT false,
    username TEXT,
    followers INTEGER,
    last_post TIMESTAMPTZ,
    auto_post BOOLEAN NOT NULL DEFAULT false,
    post_template TEXT
);

CREATE TABLE social_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_post_id UUID,
    author_id UUID REFERENCES auth.users(id),
    blog_title TEXT,
    platforms TEXT[],
    content TEXT,
    scheduled_time TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'draft',
    engagement JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    posted_at TIMESTAMPTZ
);

INSERT INTO social_platforms (id, name, post_template) VALUES
('twitter', 'Twitter', '🚀 New blog post: {title}\n\n{excerpt}\n\n{url}\n\n{hashtags}'),
('facebook', 'Facebook', '📖 Check out my latest blog post: {title}\n\n{excerpt}\n\n{url}'),
('linkedin', 'LinkedIn', '💡 New article published: {title}\n\n{excerpt}\n\n{url}\n\n{hashtags}'),
('instagram', 'Instagram', '✨ New blog post is live!\n\n{title}\n\n{excerpt}\n\nLink in bio 👆\n\n{hashtags}');
