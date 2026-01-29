import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Save, X, Send, Calendar as CalendarIcon, MapPin, 
  MessageSquare, User, Tag, Link as LinkIcon, 
  ChevronLeft, MoreVertical, Globe, Eye, Trash2,
  Clock, FileText, Settings, Sparkles, Image as ImageIcon,
  Type, AlignLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from 'date-fns'
import { BlogPost } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { parseMarkdown } from '@/lib/markdown'

interface PostEditorProps {
  post: BlogPost | null
  onSave: (data: Partial<BlogPost>, shouldPublish: boolean) => Promise<void>
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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
        const date = new Date(post.publish_at)
        if (!isNaN(date.getTime())) {
          setScheduleEnabled(true)
          setPublishDate(date)
          setPublishTime(format(date, 'HH:mm'))
        }
      }
    }
  }, [post])

  const handleSave = async (shouldPublish: boolean) => {
    try {
      if (!formData.title) {
        toast.error('Identity (Title) is required to initiate broadcast.')
        return
      }

      let finalPublishAt: string | null = null
      if (scheduleEnabled && publishDate) {
        const [hh = '00', mm = '00'] = publishTime.split(':')
        const d = new Date(publishDate)
        d.setHours(parseInt(hh), parseInt(mm), 0, 0)
        finalPublishAt = d.toISOString()
      }

      const dataToSave: Partial<BlogPost> = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        publish_at: finalPublishAt || undefined,
        published: shouldPublish
      }

      await onSave(dataToSave, shouldPublish)
    } catch (error) {
      console.error('Editor save error:', error)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: prev.slug || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }))
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col font-sans text-zinc-200 overflow-hidden">
      {/* Top Navigation */}
      <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur-xl relative z-30">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-black text-white tracking-tighter hidden sm:block uppercase">
              {post ? 'Updating Frequency' : 'New Broadcast'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className={cn(
              "rounded-xl font-bold transition-all px-4",
              showPreview ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          
          <div className="h-4 w-[1px] bg-zinc-800 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSave(false)}
            className="text-zinc-400 hover:text-white font-bold px-4 rounded-xl"
          >
            <Save className="w-4 h-4 mr-2" />
            Hold Draft
          </Button>
          
          <Button 
            onClick={() => handleSave(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-6 rounded-xl shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
          >
            <Send className="w-4 h-4 mr-2" />
            {scheduleEnabled && publishDate ? 'Schedule' : (formData.published ? 'Update' : 'Broadcast')}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn("rounded-xl transition-all", sidebarOpen ? "text-emerald-400 bg-emerald-500/5" : "text-zinc-500")}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Workspace Gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20 min-h-full">
            <AnimatePresence mode="wait">
              {showPreview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="prose prose-invert prose-emerald max-w-none"
                >
                  <h1 className="text-5xl font-black tracking-tighter mb-8 leading-tight">{formData.title || 'Untitled Signal'}</h1>
                  {formData.featured_image && (
                    <img src={formData.featured_image} alt="" className="w-full aspect-video object-cover rounded-3xl mb-12 border border-zinc-800 shadow-2xl" />
                  )}
                  <div
                    className="blog-content leading-relaxed text-zinc-400 font-serif text-lg"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(formData.content) }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <Input
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="SIGNAL IDENTITY"
                    className="text-5xl font-black bg-transparent border-none p-0 h-auto focus-visible:ring-0 placeholder:text-zinc-800 tracking-tighter uppercase leading-tight caret-emerald-500"
                  />

                  <div className="relative group">
                    <div className="absolute -left-12 top-2 opacity-0 group-focus-within:opacity-100 transition-opacity hidden lg:block">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
                        <AlignLeft className="w-4 h-4 text-emerald-400/50" />
                      </div>
                    </div>
                    <Textarea
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                      placeholder="Input neural data sequence... (Markdown supported)"
                      className="min-h-[600px] resize-none bg-transparent border-none p-0 text-xl focus-visible:ring-0 font-mono leading-relaxed placeholder:text-zinc-800 caret-emerald-500 text-zinc-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Control Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 bg-zinc-900/50 border-l border-zinc-900 backdrop-blur-2xl flex flex-col z-20"
            >
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <span className="font-black text-xs uppercase tracking-[0.2em] text-emerald-400">Control Parameters</span>
                {post && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* Status Group */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Temporal Scheduling
                  </h4>

                  <div className="space-y-4 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-400">Automatic</span>
                      <Switch
                        checked={!scheduleEnabled}
                        onCheckedChange={(checked) => setScheduleEnabled(!checked)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>

                    {scheduleEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 pt-3 border-t border-zinc-800/50"
                      >
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-bold text-xs bg-zinc-900 border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all">
                              <CalendarIcon className="mr-2 h-3.5 w-3.5 text-emerald-400" />
                              {publishDate ? format(publishDate, 'PPP') : 'Select Cycle'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
                            <Calendar
                              mode="single"
                              selected={publishDate}
                              onSelect={setPublishDate}
                              className="bg-zinc-900 text-white"
                            />
                          </PopoverContent>
                        </Popover>
                        <Input
                          type="time"
                          value={publishTime}
                          onChange={e => setPublishTime(e.target.value)}
                          className="bg-zinc-900 border-zinc-800 rounded-xl text-xs font-mono focus:border-emerald-500/50"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Metadata Group */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Tag className="w-3 h-3 text-emerald-400" /> Label Tagging
                  </h4>
                  <Textarea
                    value={formData.tags}
                    onChange={e => setFormData({...formData, tags: e.target.value})}
                    placeholder="Separate with commas (AI, Tech, 3D...)"
                    className="bg-zinc-950/50 border-zinc-800 rounded-2xl text-xs min-h-[80px] focus:border-emerald-500/50"
                  />
                </div>

                {/* Identity Group */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3 text-emerald-400" /> Bio Signatures
                  </h4>
                  <div className="space-y-3 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Origin (Author)</label>
                      <Input
                        value={formData.author_name}
                        onChange={e => setFormData({...formData, author_name: e.target.value})}
                        className="bg-zinc-900 border-zinc-800 rounded-xl text-[10px] font-mono focus:border-emerald-500/50"
                        placeholder="Author ID"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Coordinate (Location)</label>
                      <Input
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        className="bg-zinc-900 border-zinc-800 rounded-xl text-[10px] font-mono focus:border-emerald-500/50"
                        placeholder="e.g. Neo Tokyo, JP"
                      />
                    </div>
                  </div>
                </div>

                {/* Permalink Group */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <LinkIcon className="w-3 h-3 text-emerald-400" /> Node Path
                  </h4>
                  <div className="space-y-3 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-400">Auto Slug</span>
                      <Switch
                        checked={!formData.slug}
                        onCheckedChange={(checked) => !checked && setFormData({...formData, slug: formData.slug})}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>
                    <Input
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                      placeholder="custom-path-sequence"
                      className="bg-zinc-900 border-zinc-800 rounded-xl text-[10px] font-mono focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                {/* Advanced Group */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Settings className="w-3 h-3 text-emerald-400" /> Advanced Logic
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs font-bold text-zinc-400">Feedback Node</span>
                      <Switch
                        checked={formData.allow_comments}
                        onCheckedChange={c => setFormData({...formData, allow_comments: c})}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Featured Optic (URL)</label>
                      <Input
                        value={formData.featured_image}
                        onChange={e => setFormData({...formData, featured_image: e.target.value})}
                        className="bg-zinc-950/50 border-zinc-800 rounded-xl text-[10px] font-mono focus:border-emerald-500/50"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Neural Excerpt</label>
                      <Textarea
                        value={formData.excerpt}
                        onChange={e => setFormData({...formData, excerpt: e.target.value})}
                        className="bg-zinc-950/50 border-zinc-800 rounded-xl text-xs min-h-[100px] focus:border-emerald-500/50"
                        placeholder="Short descriptive sequence..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-zinc-800 bg-zinc-950/50">
                 <div className="flex items-center justify-center gap-2 text-[10px] font-black text-zinc-700 uppercase tracking-tighter">
                   <Globe className="w-3 h-3" /> Genesis Global Node X-99
                 </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-3xl shadow-2xl backdrop-blur-xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tighter flex items-center gap-3 text-red-500">
              <Trash2 className="w-6 h-6" /> TERMINATE?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400 font-medium py-2 leading-relaxed">
              Are you sure you want to purge <span className="text-white font-bold">"{formData.title || 'this signal'}"</span>? This action is irreversible and the neural data will be lost from the mainframe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-2">
            <AlertDialogCancel className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white rounded-xl font-bold h-12 transition-all">
              Hold Position
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => post && onDelete?.(post.id)}
              className="flex-1 bg-red-500 hover:bg-red-400 text-white font-black rounded-xl h-12 shadow-lg shadow-red-500/20 transition-all"
            >
              Confirm Purge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}