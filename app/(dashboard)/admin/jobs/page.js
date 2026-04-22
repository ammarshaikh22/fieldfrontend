'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Eye, UserPlus } from 'lucide-react'
import { getAllJobs, getJobById, assignJob, getTechnicians } from '@/services/api/admin'

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [assignLoading, setAssignLoading] = useState(false)
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [jobsRes, techRes] = await Promise.allSettled([
        getAllJobs(),
        getTechnicians(),
      ])

      if (jobsRes.status === 'fulfilled') {
        setJobs(jobsRes.value?.data || jobsRes.value || [])
      }
      if (techRes.status === 'fulfilled') {
        const techData = techRes.value?.data || techRes.value || []
        setTechnicians(techData.filter(t => t.isApproved))
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  async function handleViewDetails(id) {
    setDetailsLoading(true)
    setDetailsOpen(true)
    try {
      const response = await getJobById(id)
      // Handle different API response structures
      const jobData = response?.data?.job || response?.job || response?.data || response
      setSelectedJob(jobData)
    } catch (error) {
      toast.error('Failed to load job details')
      setDetailsOpen(false)
    } finally {
      setDetailsLoading(false)
    }
  }

  function handleOpenAssign(job) {
    setSelectedJob(job)
    setSelectedTechnicianId('')
    setScheduledDate('')
    setAssignOpen(true)
  }

  async function handleAssign() {
    if (!selectedTechnicianId) {
      toast.error('Please select a technician')
      return
    }

    if (!scheduledDate) {
      toast.error('Please select a scheduled date')
      return
    }

    setAssignLoading(true)
    try {
      await assignJob(selectedJob._id || selectedJob.id, { 
        technicianId: selectedTechnicianId,
        scheduledDate: scheduledDate 
      })
      toast.success('Job assigned successfully')
      setAssignOpen(false)
      fetchData()
    } catch (error) {
      toast.error(error.message || 'Failed to assign job')
    } finally {
      setAssignLoading(false)
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
        <h2 className="text-2xl font-bold tracking-tight">Jobs</h2>
        <p className="text-muted-foreground">
          View and manage all jobs in the system.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No jobs found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id || job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.client?.name || job.clientName || '-'}</TableCell>
                    <TableCell>{job.location || '-'}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>{job.technician?.name || job.technicianName || 'Unassigned'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(job._id || job.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(!job.technician && !job.technicianId) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenAssign(job)}
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Job Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>
              View complete information about this job.
            </DialogDescription>
          </DialogHeader>
          {detailsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : selectedJob ? (
            <div className="space-y-6">
              {/* Job Info */}
              <div>
                <h3 className="font-semibold text-lg">{selectedJob.title || 'Untitled Job'}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedJob.description || 'No description provided'}</p>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedJob.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  {getStatusBadge(selectedJob.status)}
                </div>
                {selectedJob.scheduledDate && (
                  <div>
                    <p className="text-muted-foreground">Scheduled Date</p>
                    <p className="font-medium">{new Date(selectedJob.scheduledDate).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedJob.createdAt && (
                  <div>
                    <p className="text-muted-foreground">Created At</p>
                    <p className="font-medium">{new Date(selectedJob.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Client Details */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Client Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedJob.client?.name || selectedJob.clientName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedJob.client?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Technician Details */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Assigned Technician</h4>
                {selectedJob.technician ? (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedJob.technician.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedJob.technician.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Field</p>
                      <p className="font-medium">{selectedJob.technician.field || 'General'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No technician assigned yet</p>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Assign Job Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Job</DialogTitle>
            <DialogDescription>
              Select a technician to assign this job to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Job</Label>
              <Input value={selectedJob?.title || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Technician *</Label>
              <Select onValueChange={setSelectedTechnicianId} value={selectedTechnicianId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech._id || tech.id} value={tech._id || tech.id}>
                      {tech.name} - {tech.field || 'General'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date *</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={assignLoading}>
              {assignLoading && <Spinner className="mr-2" />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
