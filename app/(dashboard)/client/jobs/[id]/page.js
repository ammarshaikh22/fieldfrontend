'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, MapPin, Calendar, User, FileText } from 'lucide-react'
import { getClientJobById } from '@/services/api/client'

export default function ClientJobDetailPage({ params }) {
  const router = useRouter()
  const { id } = use(params)
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJob()
  }, [id])

  async function fetchJob() {
    try {
      const response = await getClientJobById(id)
      setJob(response?.data || response)
    } catch (error) {
      console.error('Failed to fetch job:', error)
      toast.error('Failed to load job details')
      router.push('/client/jobs')
    } finally {
      setLoading(false)
    }
  }

  function getStatusBadge(status) {
    const variants = {
      pending: 'secondary',
      assigned: 'default',
      'in-progress': 'default',
      completed: 'default',
      cancelled: 'destructive',
    }
    return <Badge variant={variants[status?.toLowerCase()] || 'secondary'}>{status || 'Pending'}</Badge>
  }

  function formatDate(date) {
    if (!date) return 'Not scheduled'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Job not found</p>
        <Button asChild className="mt-4">
          <Link href="/client/jobs">Back to Jobs</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{job.title}</h2>
          <p className="text-muted-foreground">Job Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              {getStatusBadge(job.status)}
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{job.description || 'No description'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{job.location || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Scheduled Date</p>
                <p className="text-sm text-muted-foreground">{formatDate(job.scheduledDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Technician</CardTitle>
          </CardHeader>
          <CardContent>
            {job.technician || job.technicianName ? (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{job.technician?.name || job.technicianName}</p>
                  {job.technician?.email && (
                    <p className="text-sm text-muted-foreground">{job.technician.email}</p>
                  )}
                  {job.technician?.field && (
                    <p className="text-sm text-muted-foreground">{job.technician.field}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No technician assigned yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/client/jobs">Back to Jobs</Link>
        </Button>
      </div>
    </div>
  )
}
