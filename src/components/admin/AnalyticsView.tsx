import React, { memo, useMemo } from 'react'
import { BlogPost as BlogPostType } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart2, Eye, Heart, TrendingUp, FileText, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface AnalyticsViewProps {
  posts: BlogPostType[]
  comments: { id: string; author: string; content: string; post_id?: string; created_at?: string }[]
}

export const AnalyticsView = memo(({ posts, comments }: AnalyticsViewProps) => {
  const stats = useMemo(() => {
    const totalViews = posts.reduce((acc, p) => acc + (p.views_count ?? 0), 0)
    const totalLikes = posts.reduce((acc, p) => acc + (p.likes_count ?? 0), 0)
    const publishedPosts = posts.filter(p => p.published)
    const draftPosts = posts.filter(p => !p.published)
    const avgViews = publishedPosts.length > 0 ? Math.round(totalViews / publishedPosts.length) : 0
    const topPosts = [...posts].sort((a, b) => (b.views_count ?? 0) - (a.views_count ?? 0)).slice(0, 5)
    const mostLiked = [...posts].sort((a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0)).slice(0, 5)
    const recentComments = comments.slice(0, 10)

    return { totalViews, totalLikes, publishedPosts, draftPosts, avgViews, topPosts, mostLiked, recentComments }
  }, [posts, comments])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground text-sm mt-1">Overview of your blog performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Views</p>
                <p className="text-2xl font-bold mt-1">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Likes</p>
                <p className="text-2xl font-bold mt-1">{stats.totalLikes.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Published</p>
                <p className="text-2xl font-bold mt-1">{stats.publishedPosts.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Views/Post</p>
                <p className="text-2xl font-bold mt-1">{stats.avgViews.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts & Most Liked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              Most Viewed Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topPosts.length > 0 ? stats.topPosts.map((post, i) => (
              <div key={post.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[250px]">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(post.created_at), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <span className="text-sm font-mono text-blue-500">{(post.views_count ?? 0).toLocaleString()} views</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No posts yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Most Liked Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.mostLiked.length > 0 ? stats.mostLiked.map((post, i) => (
              <div key={post.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[250px]">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.published ? 'Published' : 'Draft'}</p>
                  </div>
                </div>
                <span className="text-sm font-mono text-red-500">{(post.likes_count ?? 0).toLocaleString()} likes</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No posts yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Drafts */}
      {stats.draftPosts.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Draft Posts ({stats.draftPosts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.draftPosts.map(post => (
              <div key={post.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <p className="text-sm font-medium truncate max-w-[400px]">{post.title}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(post.created_at), 'MMM d, yyyy')}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
})

AnalyticsView.displayName = 'AnalyticsView'
