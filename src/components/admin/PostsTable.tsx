import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Globe, 
  Clock, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react'
import { BlogPost } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PostsTableProps {
  posts: BlogPost[]
  onEdit: (post: BlogPost) => void
  onDelete: (id: string) => void
  onView: (post: BlogPost) => void
}

export const PostsTable = ({ posts, onEdit, onDelete, onView }: PostsTableProps) => {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[400px]">Post Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Stats</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No posts found. Create your first post to get started.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id} className="group hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-foreground line-clamp-1">{post.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1 font-mono">{post.slug}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {post.published ? (
                    post.publish_at && new Date(post.publish_at) > new Date() ? (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        <Clock className="w-3 h-3 mr-1" /> Scheduled
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle className="w-3 h-3 mr-1" /> Published
                      </Badge>
                    )
                  ) : (
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                      <AlertCircle className="w-3 h-3 mr-1" /> Draft
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(post.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {post.views_count}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(post)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onView(post)}>
                        <Globe className="mr-2 h-4 w-4" /> View Live
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete(post.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
