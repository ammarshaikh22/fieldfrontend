'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Bell, ArrowRight, Clock, CheckCircle, PlayCircle } from 'lucide-react'
import { getTechnicianJobs, getNotifications } from '@/services/api/technician'

export default function TechnicianDashboardPage() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    pendingJobs: 0,
    inProgressJobs: 0,
    completedJobs: 0,
    notifications: 0,
  })
  const [activeJobs, setActiveJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
        const userId = (JSON.parse(localStorage.getItem('user')) || {}).id
      const [jobsRes, notifRes] = await Promise.allSettled([
        getTechnicianJobs(),
        getNotifications(userId),
      ])

      const jobs = jobsRes.status === 'fulfilled' ? (jobsRes.value?.data || jobsRes.value || []) : []
      const notifications = notifRes.status === 'fulfilled' ? (notifRes.value?.data || notifRes.value || []) : []

      setStats({
        totalJobs: jobs.length,
        pendingJobs: jobs.filter(j => j.status?.toLowerCase() === 'assigned' || j.status?.toLowerCase() === 'pending').length,
        inProgressJobs: jobs.filter(j => j.status?.toLowerCase() === 'in-progress').length,
        completedJobs: jobs.filter(j => j.status?.toLowerCase() === 'completed').length,
        notifications: notifications.length,
      })
      setActiveJobs(jobs.filter(j => j.status?.toLowerCase() !== 'completed').slice(0, 5))
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Assigned',
      value: stats.totalJobs,
      icon: Briefcase,
      href: '/technician/jobs',
    },
    {
      title: 'Pending',
      value: stats.pendingJobs,
      icon: Clock,
      href: '/technician/jobs?status=pending',
    },
    {
      title: 'In Progress',
      value: stats.inProgressJobs,
      icon: PlayCircle,
      href: '/technician/jobs?status=in-progress',
    },
    {
      title: 'Completed',
      value: stats.completedJobs,
      icon: CheckCircle,
      href: '/technician/jobs?status=completed',
    },
  ]

  function getStatusBadge(status) {
    const variants = {
      pending: 'secondary',
      assigned: 'secondary',
      'in-progress': 'default',
      completed: 'default',
    }
    return <Badge variant={variants[status?.toLowerCase()] || 'secondary'}>{status || 'Assigned'}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground">
          Manage your assigned jobs and update their status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stat.value}
                </div>
                <Button variant="link" asChild className="px-0 mt-2">
                  <Link href={stat.href} className="text-sm">
                    View details <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : activeJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active jobs</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeJobs.map((job) => (
                  <div
                    key={job._id || job.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(job.status)}
                        {job.location && (
                          <span className="text-xs text-muted-foreground">{job.location}</span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/technician/jobs/${job._id || job.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/technician/jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                View All Jobs
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/technician/notifications">
                <Bell className="mr-2 h-4 w-4" />
                Check Notifications ({stats.notifications})
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
