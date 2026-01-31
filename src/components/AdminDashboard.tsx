import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BlogPost as BlogPostType, BlogComment, blogAPI, isSupabaseConfigured } from '@/lib/supabase'
import { adminAuth } from '@/lib/auth'
import { toast } from 'sonner'
import { PostEditor } from './admin/PostEditor'
import { AdminSidebar } from './admin/AdminSidebar'
import { AdminHeader } from './admin/AdminHeader'
import { DashboardStats } from './admin/DashboardStats'
import { PostsTable } from './admin/PostsTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface AdminDashboardProps {
  onLogout: () => void
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeView, setActiveView] = useState('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [posts, setPosts] = useState<BlogPostType[]>([])
  const [comments, setComments] = useState<(BlogComment & { post_title?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null)

  // CLI State
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['> Genesis System v4.2.0 initialized...', '> Type "help" for available commands.'])
  const [terminalInput, setTerminalInput] = useState('')
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadAllPosts()
    loadAllComments()
  }, [])

  useEffect(() => {
    if (activeView === 'cli' && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput, activeView])

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
          '  delete <id>        - Delete a post',
          '  clear              - Clear terminal',
          '  gui                - Switch to Dashboard',
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
        setActiveView('dashboard')
        addOutput('> Switching to GUI...')
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
    } catch (error: any) {
      console.error('Error saving:', error)
      toast.error(`Failed to save: ${error.message || 'Unknown error'}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      await blogAPI.deletePost(id)
      toast.success('Post deleted')
      loadAllPosts()
    } catch (error: any) {
      console.error('Error deleting:', error)
      toast.error(`Failed to delete: ${error.message || 'Unknown error'}`)
    }
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

  if (activeView === 'cli') {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col" onClick={() => document.getElementById('cli-input')?.focus()}>
        <div className="flex justify-between items-center border-b border-green-900/50 pb-2 mb-2">
           <span>GENESIS TERMINAL v4.2.0</span>
           <Button variant="ghost" size="sm" onClick={() => setActiveView('dashboard')} className="text-green-500 hover:text-green-400 hover:bg-green-900/20">
             Switch to GUI
           </Button>
        </div>
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

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      <AdminSidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={() => { adminAuth.logout(); onLogout() }}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-[280px]'}`}>
        <AdminHeader 
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto p-8 relative">
           {/* Background Elements */}
           <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-20" />
           
           <div className="max-w-7xl mx-auto space-y-8">
             {/* Header Section */}
             <div className="flex items-center justify-between">
               <div>
                 <h1 className="text-3xl font-bold tracking-tight">
                   {activeView === 'dashboard' ? 'Dashboard' : activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                 </h1>
                 <p className="text-muted-foreground mt-1">
                   Welcome back, Admin. Here's what's happening today.
                 </p>
               </div>
               <Button onClick={() => openEditor()} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                 <Plus className="w-4 h-4 mr-2" /> Create Post
               </Button>
             </div>

             {/* Content */}
             <AnimatePresence mode="wait">
               {activeView === 'dashboard' && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   transition={{ duration: 0.3 }}
                   className="space-y-8"
                 >
                   <DashboardStats 
                     stats={{
                       totalPosts: posts.length,
                       totalViews: posts.reduce((acc, p) => acc + p.views_count, 0),
                       totalComments: comments.length,
                       activeNow: 12 // Mock value
                     }}
                   />
                   
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-2 space-y-4">
                       <h2 className="text-lg font-semibold">Recent Posts</h2>
                       <PostsTable 
                         posts={posts.slice(0, 5)} 
                         onEdit={openEditor}
                         onDelete={handleDelete}
                         onView={(post) => window.open(`/blog/${post.slug}`, '_blank')}
                       />
                     </div>
                     <div className="space-y-4">
                       <h2 className="text-lg font-semibold">Recent Activity</h2>
                       <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 h-[400px]">
                          <p className="text-muted-foreground text-sm">No recent activity to display.</p>
                       </div>
                     </div>
                   </div>
                 </motion.div>
               )}

               {activeView === 'posts' && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   transition={{ duration: 0.3 }}
                 >
                    <PostsTable 
                       posts={posts} 
                       onEdit={openEditor}
                       onDelete={handleDelete}
                       onView={(post) => window.open(`/blog/${post.slug}`, '_blank')}
                    />
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
