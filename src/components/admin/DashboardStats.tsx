import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Users, Eye, FileText, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardStatsProps {
  stats: {
    totalPosts: number
    totalViews: number
    totalComments: number
    activeNow: number
  }
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statItems = [
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Eye,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Total Posts",
      value: stats.totalPosts.toLocaleString(),
      change: "+4",
      trend: "up",
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Active Users",
      value: stats.activeNow.toLocaleString(),
      change: "+24%",
      trend: "up",
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      title: "Engagement",
      value: "8.2%",
      change: "-1.2%",
      trend: "down",
      icon: Activity,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {statItems.map((stat, index) => (
        <motion.div key={index} variants={item}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
