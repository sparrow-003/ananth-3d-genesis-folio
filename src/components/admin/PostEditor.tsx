import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, X, Send, Calendar as CalendarIcon, MapPin, 
  MessageSquare, User, Tag, Link as LinkIcon, 
  ChevronLeft, MoreVertical, Globe, Eye, Trash2,
  Clock, FileText, Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from 'date-fns'
import { BlogPost } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PostEditorProps {
  post: BlogPost | null
  onSave: (data: any, shouldPublish: boolean) => Promise<void>
  onClose: () => void
  onDelete?: (id: string) => void
}

export const PostEditor = ({ post, onSave, onClose, onDelete }: PostEditorProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    featured_image: '',
    tags: '',
    published: false,
    publish_at: '',
    allow_comments: true,
    author_name: 'Ananth',
    location: ''
  })

  const [publishDate, setPublishDate] = useState<Date | undefined>(undefined)
  const [publishTime, setPublishTime] = useState<string>('')
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        featured_image: post.featured_image || '',
        tags: post.tags ? post.tags.join(', ') : '',
        published: post.published,
        publish_at: post.publish_at || '',
        allow_comments: post.allow_comments ?? true,
        author_name: post.author_name ?? 'Ananth',
        location: post.location || ''
      })
      
      if (post.publish_at) {
        setScheduleEnabled(true)
        setPublishDate(new Date(post.publish_at))
        setPublishTime(format(new Date(post.publish_at), 'HH:mm'))
      }
    }
  }, [post])

  const handleSave = async (shouldPublish: boolean) => {
    try {
      if (!formData.title) {
        toast.error('Title is required')
        return
      }

      let finalPublishAt: string | null = null
      if (scheduleEnabled && publishDate) {
        const [hh = '00', mm = '00'] = publishTime.split(':')
        const d = new Date(publishDate)
        d.setHours(parseInt(hh), parseInt(mm), 0, 0)
        finalPublishAt = d.toISOString()
      }

      const dataToSave = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        publish_at: finalPublishAt,
        published: shouldPublish
      }

      await onSave(dataToSave, shouldPublish)
    } catch (error) {
      console.error('Editor save error:', error)
    }
  }

  // Auto-generate slug from title if empty
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: prev.slug || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }))
  }

  const commentCount = post?.comments_count || 0

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-bottom-4 duration-300">
      {/* Top Bar - Blogger Style */}
      <div className="h-16 border-b flex items-center justify-between px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 text-white p-1.5 rounded-md">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">
              {post ? 'Edit Post' : 'New Post'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {post && onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-zinc-500 hover:text-red-600"
              onClick={() => {
                if(window.confirm('Delete this post?')) onDelete(post.id)
              }}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
          
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          
          <Button variant="secondary" onClick={() => handleSave(false)}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          
          <Button 
            onClick={() => handleSave(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            {scheduleEnabled && publishDate ? 'Schedule' : (formData.published ? 'Update' : 'Publish')}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-5xl mx-auto w-full">
          {showPreview ? (
            <div className="prose dark:prose-invert max-w-none">
              <h1>{formData.title}</h1>
              <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg">
                {formData.content}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Input
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Post Title"
                className="text-3xl font-bold border-none px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
              
              <Textarea
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                placeholder="Write your story..."
                className="min-h-[500px] resize-none border-none px-0 text-lg focus-visible:ring-0 font-mono leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Right Sidebar - Blogger Style Settings */}
        <div className="w-80 border-l bg-muted/10 overflow-y-auto hidden lg:block">
          <div className="p-4 font-semibold text-sm text-muted-foreground border-b flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Post Settings
          </div>
          
          <Accordion type="multiple" defaultValue={['publish', 'labels']} className="w-full">
            
            {/* Publish Settings */}
            <AccordionItem value="publish">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="w-4 h-4 text-orange-600" />
                  <span>Published on</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Automatic</span>
                  <Switch 
                    checked={!scheduleEnabled} 
                    onCheckedChange={(checked) => {
                      setScheduleEnabled(!checked)
                      if (checked) {
                        setPublishDate(undefined)
                        setPublishTime('')
                      }
                    }}
                  />
                </div>
                
                {scheduleEnabled && (
                  <div className="space-y-3 pt-2 animate-in fade-in zoom-in-95">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 h-4" />
                          {publishDate ? format(publishDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={publishDate}
                          onSelect={setPublishDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Input 
                      type="time" 
                      value={publishTime}
                      onChange={e => setPublishTime(e.target.value)}
                    />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Labels / Tags */}
            <AccordionItem value="labels">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span>Labels</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Textarea 
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  placeholder="Separate with commas (e.g. Tech, News, AI)"
                  className="resize-none h-20 text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Use commas to separate multiple labels.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Permalink */}
            <AccordionItem value="permalink">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-2 text-sm">
                  <LinkIcon className="w-4 h-4 text-green-600" />
                  <span>Permalink</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={!formData.slug}
                      onCheckedChange={(checked) => !checked && setFormData({...formData, slug: formData.slug})} 
                    />
                    <span className="text-sm text-muted-foreground">Automatic Permalink</span>
                  </div>
                  <Input 
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    placeholder="custom-url-slug"
                    className="font-mono text-xs"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Location */}
            <AccordionItem value="location">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>Location</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Input 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. Bangalore, India"
                />
              </AccordionContent>
            </AccordionItem>

            {/* Options */}
            <AccordionItem value="options">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-2 text-sm">
                  <MoreVertical className="w-4 h-4 text-purple-600" />
                  <span>Options</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Reader Comments</label>
                  <div className="flex items-center justify-between border p-2 rounded-md">
                    <span className="text-sm">Allow</span>
                    <Switch 
                      checked={formData.allow_comments}
                      onCheckedChange={c => setFormData({...formData, allow_comments: c})}
                    />
                  </div>
                  {post && (
                    <div className="flex items-center justify-between border p-2 rounded-md bg-muted/30">
                       <span className="text-sm text-muted-foreground">Total Comments</span>
                       <span className="text-sm font-bold">{commentCount}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Author Name</label>
                  <Input 
                    value={formData.author_name}
                    onChange={e => setFormData({...formData, author_name: e.target.value})}
                    placeholder="Author Name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Excerpt</label>
                  <Textarea 
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="Short summary for SEO..."
                    className="h-20 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Featured Image URL</label>
                  <Input 
                    value={formData.featured_image}
                    onChange={e => setFormData({...formData, featured_image: e.target.value})}
                    placeholder="https://..."
                    className="text-xs font-mono"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}