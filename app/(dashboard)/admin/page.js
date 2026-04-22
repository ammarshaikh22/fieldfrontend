'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Briefcase, Clock, Bell, ArrowRight } from 'lucide-react'
import { getTechnicians, getPendingTechnicians, getAllJobs, getNotifications } from '@/services/api/admin'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalTechnicians: 0,
    pendingTechnicians: 0,
    totalJobs: 0,
    notifications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
        const userId = (JSON.parse(localStorage.getItem('user')) || {}).id
      const [technicians, pending, jobs, notifications] = await Promise.allSettled([
        getTechnicians(),
        getPendingTechnicians(),
        getAllJobs(),
        getNotifications(userId),
      ])

      setStats({
        totalTechnicians: technicians.status === 'fulfilled' ? (technicians.value?.data?.length || technicians.value?.length || 0) : 0,
        pendingTechnicians: pending.status === 'fulfilled' ? (pending.value?.data?.length || pending.value?.length || 0) : 0,
        totalJobs: jobs.status === 'fulfilled' ? (jobs.value?.data?.length || jobs.value?.length || 0) : 0,
        notifications: notifications.status === 'fulfilled' ? (notifications.value?.data?.length || notifications.value?.length || 0) : 0,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Technicians',
      value: stats.totalTechnicians,
      icon: Users,
      href: '/admin/technicians',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingTechnicians,
      icon: Clock,
      href: '/admin/technicians?tab=pending',
    },
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      href: '/admin/jobs',
    },
    {
      title: 'Notifications',
      value: stats.notifications,
      icon: Bell,
      href: '/admin/notifications',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your field operations.
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
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/technicians?tab=pending">
                <Clock className="mr-2 h-4 w-4" />
                Review Pending Technicians
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                Manage Jobs
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/technicians">
                <Users className="mr-2 h-4 w-4" />
                View All Technicians
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage your field service operations from this dashboard. You can approve technicians,
              assign jobs, and monitor all activities across the platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
