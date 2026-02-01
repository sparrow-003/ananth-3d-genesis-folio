import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Save, X, Send, Calendar as CalendarIcon, MapPin, 
  MessageSquare, User, Tag, Link as LinkIcon, 
  ChevronLeft, MoreVertical, Globe, Eye, Trash2,
  Clock, FileText, Settings, Image as ImageIcon,
  LayoutTemplate, Bold, Italic, Heading, Quote, 
  List, Code
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
  const [activeTab, setActiveTab] = useState('write')

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

  // Markdown insert function
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('post-content-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.content
    const before = text.substring(0, start)
    const selection = text.substring(start, end)
    const after = text.substring(end)

    const newContent = before + prefix + (selection || '') + suffix + after
    
    setFormData({ ...formData, content: newContent })
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + prefix.length + (selection ? selection.length : 0) + (selection ? suffix.length : 0)
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
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

  // Reusable Settings Render Function
  const renderPostSettings = () => (
    <Accordion type="multiple" defaultValue={['publish', 'meta']} className="w-full">
      {/* Publish Settings */}
      <AccordionItem value="publish" className="border-border">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>Publishing</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Schedule</span>
            <Switch 
              checked={scheduleEnabled} 
              onCheckedChange={(checked) => {
                setScheduleEnabled(checked)
                if (!checked) {
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

      {/* Meta Data */}
      <AccordionItem value="meta" className="border-border">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-blue-500" />
            <span>Meta Data</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Excerpt</label>
            <Textarea 
              value={formData.excerpt}
              onChange={e => setFormData({...formData, excerpt: e.target.value})}
              placeholder="Short summary for SEO..."
              className="h-20 text-sm resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Tags</label>
            <Input 
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              placeholder="Tech, Design, Life..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Slug</label>
            <Input 
              value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value})}
              placeholder="custom-url-slug"
              className="font-mono text-xs"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Featured Image */}
      <AccordionItem value="media" className="border-border">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <ImageIcon className="w-4 h-4 text-purple-500" />
            <span>Media</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Featured Image URL</label>
            <Input 
              value={formData.featured_image}
              onChange={e => setFormData({...formData, featured_image: e.target.value})}
              placeholder="https://..."
              className="text-xs font-mono"
            />
          </div>
          {formData.featured_image && (
            <div className="mt-2 rounded-lg overflow-hidden border border-border">
              <img src={formData.featured_image} alt="Preview" className="w-full h-auto" />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Advanced */}
      <AccordionItem value="advanced" className="border-border">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <MoreVertical className="w-4 h-4 text-orange-500" />
            <span>Advanced</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Allow Comments</span>
            <Switch 
              checked={formData.allow_comments}
              onCheckedChange={c => setFormData({...formData, allow_comments: c})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Author</label>
            <Input 
              value={formData.author_name}
              onChange={e => setFormData({...formData, author_name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Location</label>
            <Input 
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              placeholder="e.g. Bangalore"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )

  const commentCount = post?.comments_count || 0

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-bottom-4 duration-300">
      {/* Top Bar */}
      <div className="h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {post ? 'Edit Post' : 'New Post'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formData.published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block mr-4">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </Tabs>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden">
                <Settings className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 overflow-y-auto">
              <SheetTitle className="sr-only">Post Settings</SheetTitle>
              <div className="p-4 font-semibold text-sm text-muted-foreground border-b border-border flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Post Settings
              </div>
              {renderPostSettings()}
            </SheetContent>
          </Sheet>

          {post && onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex text-muted-foreground hover:text-red-600 hover:bg-red-500/10"
              onClick={() => {
                if(window.confirm('Delete this post?')) onDelete(post.id)
              }}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
          
          <Button variant="outline" onClick={() => handleSave(false)} className="hidden sm:flex">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          
          <Button 
            onClick={() => handleSave(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Send className="w-4 h-4 mr-2" />
            {scheduleEnabled && publishDate ? 'Schedule' : (formData.published ? 'Update' : 'Publish')}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12">
            {activeTab === 'write' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="group relative">
                  <Input
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Post Title"
                    className="text-3xl md:text-5xl font-bold border-none px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent text-foreground"
                  />
                  <div className="absolute -left-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hidden lg:block">
                    <LayoutTemplate className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm py-2 border-b border-border flex gap-1 mb-4">
                   <Button variant="ghost" size="sm" onClick={() => insertMarkdown('**', '**')} title="Bold">
                     <Bold className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => insertMarkdown('*', '*')} title="Italic">
                     <Italic className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => insertMarkdown('### ')} title="Heading">
                     <Heading className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => insertMarkdown('> ')} title="Quote">
                     <Quote className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => insertMarkdown('- ')} title="List">
                     <List className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => insertMarkdown('`', '`')} title="Code">
                     <Code className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => insertMarkdown('[', '](url)')} title="Link">
                     <LinkIcon className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => insertMarkdown('![alt text](', ')')} title="Image">
                     <ImageIcon className="w-4 h-4" />
                   </Button>
                </div>

                <Textarea
                  id="post-content-textarea"
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  placeholder="Tell your story..."
                  className="min-h-[calc(100vh-300px)] resize-none border-none px-0 text-lg focus-visible:ring-0 leading-relaxed bg-transparent font-mono text-foreground"
                />
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none animate-in fade-in duration-500">
                <h1>{formData.title || 'Untitled Post'}</h1>
                {formData.featured_image && (
                  <img src={formData.featured_image} alt="Cover" className="w-full h-64 object-cover rounded-xl my-8" />
                )}
                <div className="whitespace-pre-wrap">
                  {formData.content || 'Start writing to see preview...'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Settings (Desktop) */}
        <div className="w-80 border-l border-border bg-muted/10 overflow-y-auto custom-scrollbar hidden xl:block">
          <div className="p-4 font-semibold text-sm text-muted-foreground border-b border-border flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Post Settings
          </div>
          {renderPostSettings()}
        </div>
      </div>
    </div>
  )
}
