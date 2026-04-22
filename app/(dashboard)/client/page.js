'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, PlusCircle, Bell, ArrowRight, Clock, CheckCircle } from 'lucide-react'
import { getClientJobs, getNotifications } from '@/services/api/client'

export default function ClientDashboardPage() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    pendingJobs: 0,
    completedJobs: 0,
    notifications: 0,
  })
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const userId = (JSON.parse(localStorage.getItem('user')) || {}).id
      const [jobsRes, notifRes] = await Promise.allSettled([
        getClientJobs(),
        getNotifications(userId),
      ])

      const jobs = jobsRes.status === 'fulfilled' ? (jobsRes.value?.data || jobsRes.value || []) : []
      const notifications = notifRes.status === 'fulfilled' ? (notifRes.value?.data || notifRes.value || []) : []

      setStats({
        totalJobs: jobs.length,
        pendingJobs: jobs.filter(j => j.status?.toLowerCase() === 'pending' || !j.status).length,
        completedJobs: jobs.filter(j => j.status?.toLowerCase() === 'completed').length,
        notifications: notifications.length,
      })
      setRecentJobs(jobs.slice(0, 5))
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      href: '/client/jobs',
    },
    {
      title: 'Pending',
      value: stats.pendingJobs,
      icon: Clock,
      href: '/client/jobs?status=pending',
    },
    {
      title: 'Completed',
      value: stats.completedJobs,
      icon: CheckCircle,
      href: '/client/jobs?status=completed',
    },
    {
      title: 'Notifications',
      value: stats.notifications,
      icon: Bell,
      href: '/client/notifications',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground">
            Manage your service requests and track job progress.
          </p>
        </div>
        <Button asChild>
          <Link href="/client/create-job">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Job
          </Link>
        </Button>
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
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : recentJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No jobs yet</p>
                <Button asChild variant="outline">
                  <Link href="/client/create-job">Create your first job</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div
                    key={job._id || job.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {job.status || 'Pending'}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/client/jobs/${job._id || job.id}`}>
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
              <Link href="/client/create-job">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Job Request
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/client/jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                View All Jobs
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/client/notifications">
                <Bell className="mr-2 h-4 w-4" />
                Check Notifications
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
