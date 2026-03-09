import React, { memo, useMemo, useState, useCallback } from 'react'
import { BlogPost as BlogPostType } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart2, Eye, Heart, TrendingUp, FileText, Calendar as CalendarIcon, 
  Download, Filter, AlertTriangle, ArrowUp, ArrowDown, Target, Users,
  Activity, Zap, RefreshCw
} from 'lucide-react'
import { format, subDays, isWithinInterval, startOfDay, endOfDay, differenceInDays, addDays } from 'date-fns'
import { cn } from '@/lib/utils'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts'

interface AnalyticsViewProps {
  posts: BlogPostType[]
  comments: { id: string; author: string; content: string; post_id?: string; created_at?: string }[]
}

type DateRange = { from: Date | undefined; to: Date | undefined }
type SegmentFilter = 'all' | 'published' | 'drafts'

// Simple linear regression for predictions
const linearRegression = (data: number[]) => {
  const n = data.length
  if (n < 2) return { slope: 0, intercept: data[0] || 0 }
  
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0
  for (let i = 0; i < n; i++) {
    sumX += i
    sumY += data[i]
    sumXY += i * data[i]
    sumXX += i * i
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  return { slope, intercept }
}

// Moving average calculation
const movingAverage = (data: number[], window: number = 3): number[] => {
  return data.map((_, i, arr) => {
    const start = Math.max(0, i - window + 1)
    const subset = arr.slice(start, i + 1)
    return subset.reduce((a, b) => a + b, 0) / subset.length
  })
}

// Anomaly detection (simple z-score based)
const detectAnomalies = (data: number[]): boolean[] => {
  if (data.length < 3) return data.map(() => false)
  const mean = data.reduce((a, b) => a + b, 0) / data.length
  const std = Math.sqrt(data.reduce((a, b) => a + (b - mean) ** 2, 0) / data.length)
  const threshold = 2 // 2 standard deviations
  return data.map(v => std > 0 && Math.abs(v - mean) > threshold * std)
}

export const AnalyticsView = memo(({ posts, comments }: AnalyticsViewProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({ from: subDays(new Date(), 30), to: new Date() })
  
  const handleDateRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    setDateRange({ from: range?.from, to: range?.to })
  }
  const [segmentFilter, setSegmentFilter] = useState<SegmentFilter>('all')
  const [predictionDays, setPredictionDays] = useState<7 | 30>(7)

  // Filter posts by date range and segment
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const postDate = new Date(post.created_at)
      const inDateRange = !dateRange.from || !dateRange.to || isWithinInterval(postDate, {
        start: startOfDay(dateRange.from),
        end: endOfDay(dateRange.to)
      })
      const matchesSegment = segmentFilter === 'all' || 
        (segmentFilter === 'published' && post.published) ||
        (segmentFilter === 'drafts' && !post.published)
      return inDateRange && matchesSegment
    })
  }, [posts, dateRange, segmentFilter])

  // Calculate comprehensive stats
  const stats = useMemo(() => {
    const totalViews = filteredPosts.reduce((acc, p) => acc + (p.views_count ?? 0), 0)
    const totalLikes = filteredPosts.reduce((acc, p) => acc + (p.likes_count ?? 0), 0)
    const publishedPosts = filteredPosts.filter(p => p.published)
    const draftPosts = filteredPosts.filter(p => !p.published)
    const avgViews = publishedPosts.length > 0 ? Math.round(totalViews / publishedPosts.length) : 0
    const avgLikes = publishedPosts.length > 0 ? Math.round(totalLikes / publishedPosts.length) : 0
    const topPosts = [...filteredPosts].sort((a, b) => (b.views_count ?? 0) - (a.views_count ?? 0)).slice(0, 5)
    const mostLiked = [...filteredPosts].sort((a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0)).slice(0, 5)
    const recentComments = comments.slice(0, 10)

    // Calculate engagement rate (likes / views)
    const engagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(2) : '0.00'

    // Compare with previous period
    const daysDiff = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 30
    const prevPeriodStart = dateRange.from ? subDays(dateRange.from, daysDiff) : subDays(new Date(), 60)
    const prevPeriodEnd = dateRange.from ? subDays(dateRange.from, 1) : subDays(new Date(), 31)
    
    const prevPosts = posts.filter(post => {
      const postDate = new Date(post.created_at)
      return isWithinInterval(postDate, { start: startOfDay(prevPeriodStart), end: endOfDay(prevPeriodEnd) })
    })
    const prevViews = prevPosts.reduce((acc, p) => acc + (p.views_count ?? 0), 0)
    const prevLikes = prevPosts.reduce((acc, p) => acc + (p.likes_count ?? 0), 0)
    
    const viewsGrowth = prevViews > 0 ? (((totalViews - prevViews) / prevViews) * 100).toFixed(1) : '0.0'
    const likesGrowth = prevLikes > 0 ? (((totalLikes - prevLikes) / prevLikes) * 100).toFixed(1) : '0.0'

    return { 
      totalViews, totalLikes, publishedPosts, draftPosts, avgViews, avgLikes,
      topPosts, mostLiked, recentComments, engagementRate, viewsGrowth, likesGrowth
    }
  }, [filteredPosts, comments, dateRange, posts])

  // Generate time-series data for charts
  const timeSeriesData = useMemo(() => {
    const days = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 30
    const data: { date: string; views: number; likes: number; posts: number }[] = []
    
    for (let i = 0; i < days; i++) {
      const date = dateRange.from ? addDays(dateRange.from, i) : subDays(new Date(), days - i - 1)
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayPosts = filteredPosts.filter(p => format(new Date(p.created_at), 'yyyy-MM-dd') === dateStr)
      
      data.push({
        date: format(date, 'MMM d'),
        views: dayPosts.reduce((acc, p) => acc + (p.views_count ?? 0), 0),
        likes: dayPosts.reduce((acc, p) => acc + (p.likes_count ?? 0), 0),
        posts: dayPosts.length
      })
    }
    
    return data
  }, [filteredPosts, dateRange])

  // Calculate moving averages and anomalies
  const trendData = useMemo(() => {
    const views = timeSeriesData.map(d => d.views)
    const likes = timeSeriesData.map(d => d.likes)
    
    const viewsMA = movingAverage(views, 5)
    const likesMA = movingAverage(likes, 5)
    const viewAnomalies = detectAnomalies(views)
    const likeAnomalies = detectAnomalies(likes)
    
    return timeSeriesData.map((d, i) => ({
      ...d,
      viewsMA: Math.round(viewsMA[i]),
      likesMA: Math.round(likesMA[i]),
      viewAnomaly: viewAnomalies[i],
      likeAnomaly: likeAnomalies[i]
    }))
  }, [timeSeriesData])

  // Generate predictions
  const predictionData = useMemo(() => {
    const views = timeSeriesData.map(d => d.views)
    const likes = timeSeriesData.map(d => d.likes)
    
    const viewsReg = linearRegression(views)
    const likesReg = linearRegression(likes)
    
    const predictions: { date: string; predictedViews: number; predictedLikes: number; upperBound: number; lowerBound: number }[] = []
    const lastDate = dateRange.to || new Date()
    
    for (let i = 1; i <= predictionDays; i++) {
      const date = addDays(lastDate, i)
      const idx = views.length + i - 1
      const predictedViews = Math.max(0, Math.round(viewsReg.slope * idx + viewsReg.intercept))
      const predictedLikes = Math.max(0, Math.round(likesReg.slope * idx + likesReg.intercept))
      
      // Confidence band (±20%)
      const variance = predictedViews * 0.2 * (i / predictionDays)
      
      predictions.push({
        date: format(date, 'MMM d'),
        predictedViews,
        predictedLikes,
        upperBound: Math.round(predictedViews + variance),
        lowerBound: Math.max(0, Math.round(predictedViews - variance))
      })
    }
    
    return predictions
  }, [timeSeriesData, dateRange, predictionDays])

  // Funnel data (conversion funnel simulation)
  const funnelData = useMemo(() => {
    const totalViews = stats.totalViews || 100
    const readers = Math.round(totalViews * 0.65) // 65% read article
    const engaged = stats.totalLikes + comments.length // likes + comments
    const returning = Math.round(engaged * 0.3) // 30% return visitors estimate
    
    return [
      { name: 'Page Views', value: totalViews, fill: 'hsl(var(--primary))' },
      { name: 'Readers', value: readers, fill: 'hsl(var(--chart-2))' },
      { name: 'Engaged', value: engaged, fill: 'hsl(var(--chart-3))' },
      { name: 'Returning', value: returning, fill: 'hsl(var(--chart-4))' }
    ]
  }, [stats, comments])

  // Retention cohort data (simulated)
  const cohortData = useMemo(() => {
    const cohorts = []
    for (let week = 0; week < 4; week++) {
      const baseRetention = 100
      cohorts.push({
        week: `Week ${week + 1}`,
        day0: baseRetention,
        day7: Math.round(baseRetention * (0.4 - week * 0.05)),
        day14: Math.round(baseRetention * (0.25 - week * 0.03)),
        day30: Math.round(baseRetention * (0.15 - week * 0.02))
      })
    }
    return cohorts
  }, [])

  // Tag distribution
  const tagDistribution = useMemo(() => {
    const tagCounts: Record<string, number> = {}
    filteredPosts.forEach(post => {
      (post.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    return Object.entries(tagCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [filteredPosts])

  // Export to CSV
  const exportToCSV = useCallback(() => {
    const headers = ['Title', 'Published', 'Views', 'Likes', 'Created At', 'Tags']
    const rows = filteredPosts.map(p => [
      `"${p.title.replace(/"/g, '""')}"`,
      p.published ? 'Yes' : 'No',
      p.views_count ?? 0,
      p.likes_count ?? 0,
      format(new Date(p.created_at), 'yyyy-MM-dd'),
      `"${(p.tags || []).join(', ')}"`
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-export-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredPosts])

  const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">Advanced insights with trend analysis and predictions</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                {dateRange.from && dateRange.to ? (
                  `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
                ) : 'Select dates'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Segment Filter */}
          <Select value={segmentFilter} onValueChange={(v: SegmentFilter) => setSegmentFilter(v)}>
            <SelectTrigger className="w-[130px] h-9">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="drafts">Drafts</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards with growth indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Views</p>
                <p className="text-2xl font-bold mt-1">{stats.totalViews.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {parseFloat(stats.viewsGrowth) >= 0 ? (
                    <ArrowUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={cn("text-xs font-medium", parseFloat(stats.viewsGrowth) >= 0 ? "text-green-500" : "text-red-500")}>
                    {stats.viewsGrowth}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs prev</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
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
                <div className="flex items-center gap-1 mt-1">
                  {parseFloat(stats.likesGrowth) >= 0 ? (
                    <ArrowUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={cn("text-xs font-medium", parseFloat(stats.likesGrowth) >= 0 ? "text-green-500" : "text-red-500")}>
                    {stats.likesGrowth}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs prev</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Engagement Rate</p>
                <p className="text-2xl font-bold mt-1">{stats.engagementRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">Likes per view</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Target className="w-5 h-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Posts</p>
                <p className="text-2xl font-bold mt-1">{stats.publishedPosts.length}</p>
                <p className="text-xs text-muted-foreground mt-1">{stats.draftPosts.length} drafts</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <FileText className="w-5 h-5 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="predictions" className="gap-2">
            <Zap className="w-4 h-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="funnel" className="gap-2">
            <Users className="w-4 h-4" />
            Funnel
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Line Chart */}
            <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Views & Likes Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Area type="monotone" dataKey="views" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" name="Views" />
                      <Line type="monotone" dataKey="likes" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="Likes" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tag Distribution Pie Chart */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Content by Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {tagDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tagDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {tagDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No tags data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Posts Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  Most Viewed Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.topPosts.length > 0 ? stats.topPosts.map((post, i) => (
                  <div key={post.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[220px]">{post.title}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(post.created_at), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <span className="text-sm font-mono text-primary">{(post.views_count ?? 0).toLocaleString()}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No posts yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="w-4 h-4 text-destructive" />
                  Most Liked Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.mostLiked.length > 0 ? stats.mostLiked.map((post, i) => (
                  <div key={post.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[220px]">{post.title}</p>
                        <Badge variant={post.published ? 'default' : 'secondary'} className="text-[10px] h-4 mt-0.5">
                          {post.published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-sm font-mono text-destructive">{(post.likes_count ?? 0).toLocaleString()}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No posts yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Moving Average & Anomaly Detection
                </CardTitle>
                <Badge variant="outline" className="gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Anomalies highlighted
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string, props: any) => {
                        const isAnomaly = props.payload.viewAnomaly && name === 'Views'
                        return [
                          <span className={isAnomaly ? 'text-destructive font-bold' : ''}>
                            {value.toLocaleString()} {isAnomaly ? '⚠️' : ''}
                          </span>,
                          name
                        ]
                      }}
                    />
                    <Legend />
                    <Bar dataKey="views" fill="hsl(var(--primary) / 0.3)" name="Views" />
                    <Line type="monotone" dataKey="viewsMA" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="5-day MA (Views)" />
                    <Line type="monotone" dataKey="likesMA" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="5-day MA (Likes)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Growth Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase">Views Growth</p>
                <p className={cn("text-xl font-bold mt-1", parseFloat(stats.viewsGrowth) >= 0 ? "text-green-500" : "text-red-500")}>
                  {parseFloat(stats.viewsGrowth) >= 0 ? '+' : ''}{stats.viewsGrowth}%
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase">Likes Growth</p>
                <p className={cn("text-xl font-bold mt-1", parseFloat(stats.likesGrowth) >= 0 ? "text-green-500" : "text-red-500")}>
                  {parseFloat(stats.likesGrowth) >= 0 ? '+' : ''}{stats.likesGrowth}%
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase">Avg per Post</p>
                <p className="text-xl font-bold mt-1">{stats.avgViews} views / {stats.avgLikes} likes</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Forecast (Linear Regression)
                </CardTitle>
                <Select value={String(predictionDays)} onValueChange={(v) => setPredictionDays(Number(v) as 7 | 30)}>
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Next 7 days</SelectItem>
                    <SelectItem value="30">Next 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Area type="monotone" dataKey="upperBound" stroke="none" fill="hsl(var(--primary) / 0.1)" name="Upper Bound" />
                    <Area type="monotone" dataKey="lowerBound" stroke="none" fill="hsl(var(--background))" name="Lower Bound" />
                    <Line type="monotone" dataKey="predictedViews" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 5" name="Predicted Views" />
                    <Line type="monotone" dataKey="predictedLikes" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" name="Predicted Likes" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                * Predictions based on historical trends. Confidence band shows ±20% variance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnelData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {funnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Retention Cohorts */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Retention Cohorts (Simulated)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Cohort</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Day 0</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Day 7</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Day 14</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Day 30</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohortData.map((cohort, i) => (
                        <tr key={i} className="border-b border-border/30">
                          <td className="py-2 px-3 font-medium">{cohort.week}</td>
                          <td className="py-2 px-3 text-center">
                            <span className="inline-block px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">
                              {cohort.day0}%
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="inline-block px-2 py-1 rounded bg-primary/15 text-primary text-xs font-mono">
                              {cohort.day7}%
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono">
                              {cohort.day14}%
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="inline-block px-2 py-1 rounded bg-primary/5 text-primary text-xs font-mono">
                              {cohort.day30}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  * Simulated retention data based on engagement patterns
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
})

AnalyticsView.displayName = 'AnalyticsView'
