import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  BarChart2,
  MessageSquare,
  Settings,
  Layout,
  LogOut,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Bold,
  Italic,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  Quote,
  Heading,
  Code,
  Eye,
  Save,
  Send,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Globe,
  Terminal,
  X,
  Check,
  AlertCircle,
  Trash2
} from 'lucide-react'
import { BlogPost as BlogPostType, BlogComment, blogAPI, isSupabaseConfigured } from '@/lib/supabase'
import { adminAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar
} from 'recharts'

interface AdminDashboardProps {
  onLogout: () => void
}

import { PostEditor } from './admin/PostEditor'

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeView, setActiveView] = useState<'posts' | 'stats' | 'comments' | 'settings' | 'layout'>('posts')
  const [posts, setPosts] = useState<BlogPostType[]>([])
  const [comments, setComments] = useState<(BlogComment & { post_title?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [cliMode, setCliMode] = useState(false)
  
  // Editor State
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null)
  
  // CLI State
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['> Genesis System v4.2.0 initialized...', '> Type "help" for available commands.'])
  const [terminalInput, setTerminalInput] = useState('')
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadAllPosts()
    if (activeView === 'comments' || activeView === 'stats') {
      loadAllComments()
    }
  }, [activeView])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput, cliMode])

  const loadAllPosts = async () => {
    try {
      setLoading(true)
      const data = await blogAPI.getAllPosts()
      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const loadAllComments = async () => {
    try {
      const data = await blogAPI.getAllComments()
      setComments(data)
    } catch (error) {
      console.error('Error loading comments:', error)
      toast.error('Failed to load comments')
    }
  }

  // --- CLI Logic ---
  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = terminalInput.trim().toLowerCase()
    if (!cmd) return

    if (cmd === 'clear') {
      setTerminalOutput([])
      setTerminalInput('')
      return
    }

    const addOutput = (lines: string | string[]) => {
      setTerminalOutput(prev => [...prev, ...(Array.isArray(lines) ? lines : [lines])])
    }

    addOutput(`$ ${terminalInput}`)
    setTerminalInput('')
    
    const args = cmd.split(' ')
    const command = args[0]

    switch (command) {
      case 'help':
        addOutput([
          '> Available commands:',
          '  list               - List all blog posts',
          '  stats              - Show analytics summary',
          '  status             - Show system status',
          '  edit <id>          - Open post in editor',
          '  publish <id>       - Publish a post',
          '  unpublish <id>     - Unpublish a post',
          '  set <id> <k> <v>   - Quick edit (title/slug/excerpt/tags)',
          '  delete <id>        - Delete a post',
          '  clear              - Clear terminal',
          '  gui                - Switch to Graphical Interface',
          '  exit               - Exit CLI mode'
        ])
        break
      case 'list':
        if (posts.length === 0) addOutput('> No posts found.')
        else {
          addOutput(['> ID | TITLE | STATUS | VIEWS', '> --------------------------------'])
          posts.forEach(p => addOutput(`  ${p.id.substring(0, 8)}... | ${p.title.substring(0, 15)}... | ${p.published ? 'LIVE' : 'DRAFT'} | ${p.views_count}`))
        }
        break
      case 'stats':
         const totalViews = posts.reduce((acc, p) => acc + p.views_count, 0)
         addOutput([
           '> System Statistics:',
           `  Total Posts: ${posts.length}`,
           `  Total Views: ${totalViews}`
         ])
         break
      case 'status':
         addOutput([`> System: Genesis v4.2.0`, `> Connection: ${isSupabaseConfigured ? 'Supabase' : 'Mock Mode'}`])
         break
      case 'gui':
      case 'exit':
        setCliMode(false)
        addOutput('> Switching to GUI...')
        break
      case 'new':
        openEditor()
        addOutput('> Opening editor for new post...')
        break
      case 'edit':
        if (args[1]) {
           const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
           if (post) {
             openEditor(post)
             addOutput(`> Opening editor for "${post.title}"...`)
           } else addOutput(`> Error: Post "${args[1]}" not found.`)
        } else addOutput('> Usage: edit <id>')
        break
      case 'publish':
        if (args[1]) {
           const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
           if (post) {
             if (!post.published) {
               addOutput(`> Publishing "${post.title}"...`)
               await blogAPI.updatePost(post.id, { published: true })
               addOutput(`> Success: Post is now LIVE.`)
               loadAllPosts()
             } else addOutput(`> Post is already published.`)
           } else addOutput(`> Error: Post "${args[1]}" not found.`)
        } else addOutput('> Usage: publish <id>')
        break
      case 'unpublish':
        if (args[1]) {
           const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
           if (post) {
             if (post.published) {
               addOutput(`> Unpublishing "${post.title}"...`)
               await blogAPI.updatePost(post.id, { published: false })
               addOutput(`> Success: Post reverted to DRAFT.`)
               loadAllPosts()
             } else addOutput(`> Post is already a draft.`)
           } else addOutput(`> Error: Post "${args[1]}" not found.`)
        } else addOutput('> Usage: unpublish <id>')
        break
      case 'delete':
        if (args[1]) {
           const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
           if (post) {
             if (args[2] === '--force') {
                addOutput(`> Deleting "${post.title}"...`)
                await blogAPI.deletePost(post.id)
                addOutput(`> Success: Post deleted.`)
                loadAllPosts()
             } else {
                addOutput(`> WARNING: This will permanently delete "${post.title}".`)
                addOutput(`> Type "delete ${args[1]} --force" to confirm.`)
             }
           } else addOutput(`> Error: Post "${args[1]}" not found.`)
        } else addOutput('> Usage: delete <id>')
        break
      case 'set':
        if (args.length >= 4) {
          const [_, id, field, ...valParts] = args
          const val = valParts.join(' ').replace(/^["']|["']$/g, '')
          const post = posts.find(p => p.id.startsWith(id) || p.id === id)
          
          if (post) {
            const allowedFields = ['title', 'slug', 'excerpt', 'tags']
            if (allowedFields.includes(field)) {
               try {
                 addOutput(`> Updating ${field} to "${val}"...`)
                 // Handle tags specially
                 const updateData = field === 'tags' 
                   ? { tags: val.split(',').map(t => t.trim()) }
                   : { [field]: val }
                 
                 await blogAPI.updatePost(post.id, updateData)
                 addOutput(`> Success: Updated.`)
                 loadAllPosts()
               } catch(e) {
                 addOutput(`> Error: Update failed.`)
               }
            } else {
               addOutput(`> Error: Field "${field}" not editable via CLI. Allowed: ${allowedFields.join(', ')}`)
            }
          } else addOutput(`> Error: Post "${id}" not found.`)
        } else addOutput('> Usage: set <id> <field> <value>')
        break
      default:
        addOutput(`> Command not found: ${command}`)
    }
  }

  // --- Editor Logic ---
  const openEditor = (post?: BlogPostType) => {
    setEditingPost(post || null)
    setShowEditor(true)
  }

  const closeEditor = () => {
    setShowEditor(false)
    setEditingPost(null)
  }

  const handleSave = async (data: any, shouldPublish: boolean) => {
    try {
      const isScheduled = data.published && data.publish_at && new Date(data.publish_at) > new Date()
      
      if (editingPost) {
        await blogAPI.updatePost(editingPost.id, data)
        toast.success(isScheduled ? 'Post scheduled!' : (data.published ? 'Post updated!' : 'Draft saved'))
      } else {
        await blogAPI.createPost(data)
        toast.success(isScheduled ? 'Post scheduled!' : (data.published ? 'Post created!' : 'Draft saved'))
      }

      closeEditor()
      loadAllPosts()
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Failed to save')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      await blogAPI.deletePost(id)
      toast.success('Post deleted')
      loadAllPosts()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return
    try {
      await blogAPI.deleteComment(id)
      toast.success('Comment deleted')
      loadAllComments()
    } catch (error) {
      toast.error('Failed to delete comment')
    }
  }

  // --- Views ---

  if (cliMode) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col" onClick={() => document.getElementById('cli-input')?.focus()}>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pb-4" ref={terminalRef}>
          {terminalOutput.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">{line}</div>
          ))}
        </div>
        <form onSubmit={handleCommand} className="flex gap-2 border-t border-green-900/50 pt-2">
          <span className="text-green-500 font-bold">{'>'}</span>
          <input
            id="cli-input"
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-green-500 focus:ring-0"
            autoFocus
            autoComplete="off"
          />
        </form>
      </div>
    )
  }

  if (showEditor) {
    return (
      <PostEditor 
        post={editingPost}
        onSave={handleSave}
        onClose={closeEditor}
        onDelete={handleDelete}
      />
    )
  }

  // --- Main Dashboard Layout ---
  return (
    <div className="min-h-screen bg-zinc-100 flex font-sans text-zinc-900">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-zinc-200 flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-zinc-100">
          <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center text-white font-bold text-lg mr-3">
            B
          </div>
          <span className="font-bold text-xl tracking-tight text-zinc-800">Blogger</span>
        </div>

        <div className="p-4">
          <Button 
             onClick={() => openEditor()} 
             className="w-full bg-white border border-zinc-200 hover:border-orange-500 hover:bg-orange-50 text-orange-600 font-bold rounded-full h-12 shadow-sm flex items-center gap-2 transition-all justify-start px-6"
          >
            <Plus className="w-5 h-5" /> New Post
          </Button>
        </div>

        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {[
            { id: 'posts', icon: FileText, label: 'Posts' },
            { id: 'stats', icon: BarChart2, label: 'Stats' },
            { id: 'comments', icon: MessageSquare, label: 'Comments' },
            { id: 'earnings', icon: Globe, label: 'Earnings' },
            { id: 'pages', icon: Layout, label: 'Pages' },
            { id: 'layout', icon: Layout, label: 'Layout' },
            { id: 'theme', icon: ImageIcon, label: 'Theme' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-3 text-sm font-medium transition-colors rounded-r-full mr-2 ${
                activeView === item.id 
                  ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' 
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border-l-4 border-transparent'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-zinc-100">
          <Button
            variant="ghost"
            onClick={() => setCliMode(true)}
            className="w-full justify-start text-zinc-500 hover:text-zinc-900 px-4 rounded-sm mb-2"
          >
            <Terminal className="w-4 h-4 mr-3" /> CLI Mode
          </Button>
          <Button
            variant="ghost"
            onClick={() => { adminAuth.logout(); onLogout() }}
            className="w-full justify-start text-zinc-500 hover:text-red-600 px-4 rounded-sm"
          >
            <LogOut className="w-4 h-4 mr-3" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 max-w-7xl mx-auto w-full">
        
        {/* Posts View */}
        {activeView === 'posts' && (
          <div className="space-y-6">
             <div className="flex items-center justify-between">
               <h1 className="text-2xl font-bold text-zinc-800">Posts</h1>
               <div className="flex items-center gap-2">
                 <div className="relative">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                   <Input placeholder="Search posts..." className="pl-9 w-64 bg-white border-zinc-200 rounded-sm focus:border-orange-500 focus:ring-0" />
                 </div>
                 <Button variant="outline" className="rounded-sm border-zinc-200 text-zinc-600 bg-white">Manage</Button>
               </div>
             </div>

             <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
               {/* Filters */}
               <div className="flex items-center gap-4 p-4 border-b border-zinc-100 text-sm text-zinc-500 bg-zinc-50/50">
                 <span className="font-bold text-orange-600 border-b-2 border-orange-600 pb-4 -mb-4 px-1">All ({posts.length})</span>
                 <span className="cursor-pointer hover:text-zinc-800 pb-4 -mb-4 px-1">Published ({posts.filter(p => p.published && (!p.publish_at || new Date(p.publish_at) <= new Date())).length})</span>
                 <span className="cursor-pointer hover:text-zinc-800 pb-4 -mb-4 px-1">Drafts ({posts.filter(p => !p.published).length})</span>
                 <span className="cursor-pointer hover:text-zinc-800 pb-4 -mb-4 px-1">Scheduled ({posts.filter(p => p.published && p.publish_at && new Date(p.publish_at) > new Date()).length})</span>
               </div>

               {/* Post List */}
               <div className="divide-y divide-zinc-100">
                 {loading ? (
                   <div className="p-8 text-center text-zinc-400">Loading posts...</div>
                 ) : posts.length === 0 ? (
                   <div className="p-12 text-center flex flex-col items-center gap-4">
                     <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
                       <FileText className="w-8 h-8 text-zinc-300" />
                     </div>
                     <p className="text-zinc-500 font-medium">No posts found</p>
                     <Button onClick={() => openEditor()} className="rounded-sm bg-orange-600 hover:bg-orange-700 text-white">Create your first post</Button>
                   </div>
                 ) : (
                   posts.map(post => (
                     <div key={post.id} className="group flex items-center gap-4 p-4 hover:bg-orange-50/30 transition-colors cursor-pointer relative" onClick={() => openEditor(post)}>
                        <div className="w-10 h-10 bg-zinc-100 rounded-sm flex items-center justify-center flex-shrink-0 font-bold text-zinc-400 uppercase">
                          {post.title.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-zinc-800 truncate group-hover:text-orange-600 transition-colors">{post.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                             {post.published ? (
                               post.publish_at && new Date(post.publish_at) > new Date() ? (
                                 <span className="text-blue-600 font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Scheduled</span>
                               ) : (
                                 <span className="text-green-600 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Published</span>
                               )
                             ) : (
                               <span className="text-orange-500 font-medium flex items-center gap-1"><FileText className="w-3 h-3" /> Draft</span>
                             )}
                             <span>•</span>
                             <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                             <span>•</span>
                             <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views_count}</span>
                             <span>•</span>
                             <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.comments_count || 0}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-red-600" onClick={(e) => { e.stopPropagation(); handleDelete(post.id) }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                     </div>
                   ))
                 )}
               </div>
             </div>
          </div>
        )}

        {/* Stats View */}
        {activeView === 'stats' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-800">Stats</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 border border-zinc-200 rounded-sm shadow-sm">
                 <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Total Views</h3>
                 <p className="text-4xl font-bold text-zinc-900">{posts.reduce((acc, p) => acc + p.views_count, 0)}</p>
                 <div className="mt-4 h-1 w-full bg-zinc-100 overflow-hidden">
                   <div className="h-full bg-orange-500 w-3/4" />
                 </div>
              </div>
              <div className="bg-white p-6 border border-zinc-200 rounded-sm shadow-sm">
                 <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Total Posts</h3>
                 <p className="text-4xl font-bold text-zinc-900">{posts.length}</p>
                 <div className="mt-4 h-1 w-full bg-zinc-100 overflow-hidden">
                   <div className="h-full bg-blue-500 w-1/2" />
                 </div>
              </div>
              <div className="bg-white p-6 border border-zinc-200 rounded-sm shadow-sm">
                 <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Total Comments</h3>
                 <p className="text-4xl font-bold text-zinc-900">{comments.length}</p>
                 <div className="mt-4 h-1 w-full bg-zinc-100 overflow-hidden">
                   <div className="h-full bg-green-500 w-1/2" />
                 </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-zinc-200 rounded-sm shadow-sm">
              <h3 className="font-bold text-lg mb-6">Views Overview</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={posts.slice(0, 7).map(p => ({ name: p.title.substring(0, 10), views: p.views_count }))}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ border: 'none', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="views" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Comments View */}
        {activeView === 'comments' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-800">Comments</h1>
            
            <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
              <div className="divide-y divide-zinc-100">
                {comments.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-zinc-300" />
                    </div>
                    <p className="text-zinc-500 font-medium">No comments found</p>
                  </div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="group p-6 hover:bg-orange-50/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600 font-bold text-xs">
                            {comment.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-zinc-900 block text-sm">{comment.author}</span>
                            <span className="text-xs text-zinc-500">on <span className="font-medium text-orange-600">{comment.post_title || 'Unknown Post'}</span></span>
                          </div>
                        </div>
                        <span className="text-xs text-zinc-400">{format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')}</span>
                      </div>
                      
                      <p className="text-zinc-600 text-sm pl-11 mb-4">{comment.content}</p>
                      
                      <div className="pl-11 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 -ml-2"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Settings / Other Views */}
        {['settings', 'layout', 'theme', 'pages', 'earnings'].includes(activeView) && (
           <div className="bg-white border border-zinc-200 rounded-sm shadow-sm p-8 max-w-3xl">
              <h2 className="text-xl font-bold mb-6 capitalize">{activeView}</h2>
              
              {activeView === 'settings' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-orange-600 font-bold border-b border-zinc-100 pb-2">Basic</h3>
                    <div className="grid grid-cols-3 gap-4 py-2">
                       <div className="text-zinc-500 font-medium">Title</div>
                       <div className="col-span-2 text-zinc-900 font-medium">Genesis Blog</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                       <div className="text-zinc-500 font-medium">Description</div>
                       <div className="col-span-2 text-zinc-900">A futuristic tech blog about AI and 3D web.</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-orange-600 font-bold border-b border-zinc-100 pb-2">Privacy</h3>
                    <div className="flex items-center justify-between py-2">
                       <div className="text-zinc-900 font-medium">Visible to search engines</div>
                       <Switch checked={true} className="data-[state=checked]:bg-orange-500" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-orange-600 font-bold border-b border-zinc-100 pb-2">Publishing</h3>
                    <div className="grid grid-cols-3 gap-4 py-2">
                       <div className="text-zinc-500 font-medium">Blog Address</div>
                       <div className="col-span-2 text-zinc-900 font-mono bg-zinc-50 p-2 rounded-sm">ananth-dev.blogspot.com</div>
                    </div>
                  </div>
                </div>
              )}

              {activeView !== 'settings' && (
                <div className="text-center py-12 text-zinc-400">
                  <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Settings className="w-8 h-8 text-zinc-300" />
                  </div>
                  <p>This module is currently under construction.</p>
                </div>
              )}
           </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard