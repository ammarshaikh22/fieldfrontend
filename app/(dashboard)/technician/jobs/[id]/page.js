'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, MapPin, Calendar, User, FileText } from 'lucide-react'
import { getTechnicianJobById, updateJobStatus } from '@/services/api/technician'

export default function TechnicianJobDetailPage({ params }) {
  const router = useRouter()
  const { id } = use(params)
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    fetchJob()
  }, [id])

  async function fetchJob() {
    try {
      const response = await getTechnicianJobById(id)
      const jobData = response?.data || response
      setJob(jobData)
      setSelectedStatus(jobData?.status || 'assigned')
    } catch (error) {
      console.error('Failed to fetch job:', error)
      toast.error('Failed to load job details')
      router.push('/technician/jobs')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus() {
    if (!selectedStatus || selectedStatus === job?.status) {
      return
    }

    setUpdating(true)
    try {
      await updateJobStatus(id, { status: selectedStatus })
      toast.success('Job status updated successfully')
      setJob(prev => ({ ...prev, status: selectedStatus }))
    } catch (error) {
      toast.error(error.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  function getStatusBadge(status) {
    const variants = {
      pending: 'secondary',
      assigned: 'secondary',
      'in-progress': 'default',
      completed: 'default',
      cancelled: 'destructive',
    }
    return <Badge variant={variants[status?.toLowerCase()] || 'secondary'}>{status || 'Assigned'}</Badge>
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
          <Link href="/technician/jobs">Back to Jobs</Link>
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
              <span className="text-muted-foreground">Current Status:</span>
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
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            {job.client || job.clientName ? (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{job.client?.name || job.clientName}</p>
                  {job.client?.email && (
                    <p className="text-sm text-muted-foreground">{job.client.email}</p>
                  )}
                  {job.client?.companyName && (
                    <p className="text-sm text-muted-foreground">{job.client.companyName}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No client information available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleUpdateStatus}
              disabled={updating || selectedStatus === job.status}
            >
              {updating && <Spinner className="mr-2" />}
              Update Status
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/technician/jobs">Back to Jobs</Link>
        </Button>
      </div>
    </div>
  )
}
