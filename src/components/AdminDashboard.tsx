import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BlogPost as BlogPostType, BlogComment, blogAPI, isSupabaseConfigured } from '@/lib/supabase'
import { adminAuth } from '@/lib/auth'
import { useBlogOperations } from '@/hooks/useBlogOperations'
import { toast } from 'sonner'
import { PostEditor } from './admin/PostEditor'
import { AdminSidebar } from './admin/AdminSidebar'
import { AdminHeader } from './admin/AdminHeader'
import { DashboardStats } from './admin/DashboardStats'
import { PostsTable } from './admin/PostsTable'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'

interface AdminDashboardProps {
  onLogout: () => void
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeView, setActiveView] = useState('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null)

  // CLI State
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['> Genesis System v4.2.0 initialized...', '> Type "help" for available commands.'])
  const [terminalInput, setTerminalInput] = useState('')
  const terminalRef = useRef<HTMLDivElement>(null)

  const queryClient = useQueryClient()
  const { createPost, updatePost, deletePost, isLoading: operationLoading } = useBlogOperations()

  // Fetch posts with React Query
  const { 
    data: posts = [], 
    isLoading: postsLoading, 
    error: postsError,
    refetch: refetchPosts 
  } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: blogAPI.getAllPosts,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    retry: 1, // Reduced retry to prevent long loading times
    retryDelay: 1000
  })

  // Fetch comments with React Query
  const { 
    data: comments = [], 
    isLoading: commentsLoading,
    error: commentsError 
  } = useQuery({
    queryKey: ['admin-comments'],
    queryFn: blogAPI.getAllComments,
    refetchInterval: 60000, // Refetch every minute
    retry: 1,
    retryDelay: 1000
  })

  useEffect(() => {
    if (activeView === 'cli' && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput, activeView])

  // Manual refresh function
  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-posts'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-comments'] })
      ])
      toast.success('Data refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh data')
    }
  }, [queryClient])

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
          '  refresh            - Refresh data',
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
           `  Total Views: ${totalViews}`,
           `  Total Comments: ${comments.length}`
         ])
         break
      case 'status':
         addOutput([
           `> System: Genesis v4.2.0`, 
           `> Connection: ${isSupabaseConfigured ? 'Supabase Connected' : 'Mock Mode'}`,
           `> Posts Loaded: ${posts.length}`,
           `> Comments Loaded: ${comments.length}`
         ])
         break
      case 'refresh':
        addOutput('> Refreshing data...')
        try {
          await handleRefresh()
          addOutput('> Data refreshed successfully')
        } catch (error) {
          addOutput('> Error: Failed to refresh data')
        }
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
      case 'publish':
        if (args[1]) {
          const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
          if (post && !post.published) {
            try {
              await updatePost(post.id, { published: true })
              addOutput(`> Published "${post.title}"`)
            } catch (error) {
              addOutput(`> Error: Failed to publish post`)
            }
          } else if (post?.published) {
            addOutput(`> Error: Post is already published`)
          } else {
            addOutput(`> Error: Post "${args[1]}" not found`)
          }
        } else addOutput('> Usage: publish <id>')
        break
      case 'delete':
        if (args[1]) {
          const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
          if (post) {
            try {
              await deletePost(post.id)
              addOutput(`> Deleted "${post.title}"`)
            } catch (error) {
              addOutput(`> Error: Failed to delete post`)
            }
          } else {
            addOutput(`> Error: Post "${args[1]}" not found`)
          }
        } else addOutput('> Usage: delete <id>')
        break
      default:
        addOutput(`> Command not found: ${command}`)
    }
  }

  // --- Editor Logic ---
  const openEditor = useCallback((post?: BlogPostType) => {
    setEditingPost(post || null)
    setShowEditor(true)
  }, [])

  const closeEditor = useCallback(() => {
    setShowEditor(false)
    setEditingPost(null)
  }, [])

  const handleSave = async (data: any, shouldPublish: boolean) => {
    try {
      const isScheduled = data.published && data.publish_at && new Date(data.publish_at) > new Date()
      
      if (editingPost) {
        await updatePost(editingPost.id, data)
        toast.success(isScheduled ? 'Post scheduled!' : (data.published ? 'Post updated!' : 'Draft saved'))
      } else {
        await createPost(data)
        toast.success(isScheduled ? 'Post scheduled!' : (data.published ? 'Post created!' : 'Draft saved'))
      }

      closeEditor()
    } catch (error: any) {
      console.error('Error saving:', error)
      throw error // Let PostEditor handle the error display
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return
    
    try {
      await deletePost(id)
    } catch (error: any) {
      console.error('Error deleting:', error)
      // Error is handled by the hook
    }
  }

  const handleViewPost = useCallback((post: BlogPostType) => {
    window.open(`/blog/${post.slug}`, '_blank')
  }, [])

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
               <div className="flex items-center gap-3">
                 <Button 
                   variant="outline" 
                   size="icon"
                   onClick={handleRefresh}
                   disabled={postsLoading || commentsLoading || operationLoading}
                   className="hover:bg-muted"
                 >
                   <RefreshCw className={`w-4 h-4 ${(postsLoading || commentsLoading || operationLoading) ? 'animate-spin' : ''}`} />
                 </Button>
                 <Button 
                   onClick={() => openEditor()} 
                   disabled={operationLoading}
                   className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                 >
                   <Plus className="w-4 h-4 mr-2" /> Create Post
                 </Button>
               </div>
             </div>

             {/* Error Alerts */}
             {(postsError || commentsError) && (
               <Alert className="border-red-200 bg-red-50 text-red-800">
                 <AlertCircle className="h-4 w-4" />
                 <AlertDescription>
                   {postsError ? `Failed to load posts: ${postsError.message}` : `Failed to load comments: ${commentsError?.message}`}
                   <Button variant="link" className="p-0 h-auto ml-2 text-red-800" onClick={handleRefresh}>
                     Try again
                   </Button>
                 </AlertDescription>
               </Alert>
             )}

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
                   {postsLoading ? (
                     <div className="flex items-center justify-center py-12">
                       <Loader2 className="w-8 h-8 animate-spin text-primary" />
                       <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
                     </div>
                   ) : (
                     <>
                       <DashboardStats 
                         stats={{
                           totalPosts: posts.length,
                           totalViews: posts.reduce((acc, p) => acc + p.views_count, 0),
                           totalComments: comments.length,
                           activeNow: 12 // Mock value - could be enhanced with real analytics
                         }}
                       />
                       
                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <div className="lg:col-span-2 space-y-4">
                           <h2 className="text-lg font-semibold">Recent Posts</h2>
                           <PostsTable 
                             posts={posts.slice(0, 5)} 
                             onEdit={openEditor}
                             onDelete={handleDelete}
                             onView={handleViewPost}
                           />
                         </div>
                         <div className="space-y-4">
                           <h2 className="text-lg font-semibold">Recent Activity</h2>
                           <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 h-[400px] overflow-y-auto">
                             {comments.length > 0 ? (
                               <div className="space-y-3">
                                 {comments.slice(0, 10).map((comment) => (
                                   <div key={comment.id} className="text-sm border-b border-border/30 pb-2">
                                     <p className="font-medium text-foreground">{comment.author}</p>
                                     <p className="text-muted-foreground text-xs truncate">{comment.content}</p>
                                     <p className="text-xs text-muted-foreground mt-1">
                                       on {comment.post_title || 'Unknown Post'}
                                     </p>
                                   </div>
                                 ))}
                               </div>
                             ) : (
                               <p className="text-muted-foreground text-sm">No recent activity to display.</p>
                             )}
                           </div>
                         </div>
                       </div>
                     </>
                   )}
                 </motion.div>
               )}

               {activeView === 'posts' && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   transition={{ duration: 0.3 }}
                 >
                   {postsLoading ? (
                     <div className="flex items-center justify-center py-12">
                       <Loader2 className="w-8 h-8 animate-spin text-primary" />
                       <span className="ml-2 text-muted-foreground">Loading posts...</span>
                     </div>
                   ) : (
                     <PostsTable 
                       posts={posts} 
                       onEdit={openEditor}
                       onDelete={handleDelete}
                       onView={handleViewPost}
                     />
                   )}
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
