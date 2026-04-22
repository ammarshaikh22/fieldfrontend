'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { Eye } from 'lucide-react'
import { getTechnicianJobs } from '@/services/api/technician'

export default function TechnicianJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  async function fetchJobs() {
    try {
      const response = await getTechnicianJobs()
      setJobs(response?.data || response || [])
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
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
    if (!date) return '-'
    return new Date(date).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Jobs</h2>
        <p className="text-muted-foreground">
          View and manage your assigned service jobs.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No jobs assigned yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id || job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.client?.name || job.clientName || '-'}</TableCell>
                    <TableCell>{job.location || '-'}</TableCell>
                    <TableCell>{formatDate(job.scheduledDate)}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/technician/jobs/${job._id || job.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
