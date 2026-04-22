'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { Check, Eye, User } from 'lucide-react'
import { getTechnicians, getPendingTechnicians, getTechnicianById, approveTechnician } from '@/services/api/admin'

export default function TechniciansPage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'all'
  
  const [technicians, setTechnicians] = useState([])
  const [pendingTechnicians, setPendingTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTechnician, setSelectedTechnician] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [approving, setApproving] = useState(null)

  useEffect(() => {
    fetchTechnicians()
  }, [])

  async function fetchTechnicians() {
    setLoading(true)
    try {
      const [allRes, pendingRes] = await Promise.allSettled([
        getTechnicians(),
        getPendingTechnicians(),
      ])

      if (allRes.status === 'fulfilled') {
        setTechnicians(allRes.value?.data || allRes.value || [])
      }
      if (pendingRes.status === 'fulfilled') {
        setPendingTechnicians(pendingRes.value?.data || pendingRes.value || [])
      }
    } catch (error) {
      console.error('Failed to fetch technicians:', error)
      toast.error('Failed to load technicians')
    } finally {
      setLoading(false)
    }
  }

  async function handleViewDetails(id) {
    setDetailsLoading(true)
    setDetailsOpen(true)
    try {
      const response = await getTechnicianById(id)
      // Handle different API response structures
      const techData = response?.data?.technician || response?.technician || response?.data || response
      setSelectedTechnician(techData)
    } catch (error) {
      toast.error('Failed to load technician details')
      setDetailsOpen(false)
    } finally {
      setDetailsLoading(false)
    }
  }

  async function handleApprove(id) {
    setApproving(id)
    try {
      await approveTechnician(id)
      toast.success('Technician approved successfully')
      fetchTechnicians()
    } catch (error) {
      toast.error(error.message || 'Failed to approve technician')
    } finally {
      setApproving(null)
    }
  }

  function TechnicianTable({ data, showApprove = false }) {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No technicians found
        </div>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tech) => (
            <TableRow key={tech._id || tech.id}>
              <TableCell className="font-medium">{tech.name}</TableCell>
              <TableCell>{tech.email}</TableCell>
              <TableCell>{tech.companyName || '-'}</TableCell>
              <TableCell>{tech.field || '-'}</TableCell>
              <TableCell>
                <Badge variant={tech.isApproved ? 'default' : 'secondary'}>
                  {tech.isApproved ? 'Approved' : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(tech._id || tech.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {showApprove && !tech.isApproved && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleApprove(tech._id || tech.id)}
                      disabled={approving === (tech._id || tech.id)}
                    >
                      {approving === (tech._id || tech.id) ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Technicians</h2>
        <p className="text-muted-foreground">
          Manage and approve technicians in your organization.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue={defaultTab}>
            <TabsList>
              <TabsTrigger value="all">
                All Technicians ({technicians.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending Approval ({pendingTechnicians.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <TechnicianTable data={technicians} />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <TechnicianTable data={pendingTechnicians} showApprove />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Technician Details</DialogTitle>
            <DialogDescription>
              View complete information about this technician.
            </DialogDescription>
          </DialogHeader>
          {detailsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : selectedTechnician ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedTechnician.name || 'N/A'}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTechnician.email || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{selectedTechnician.role || 'Technician'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Field / Specialty</p>
                  <p className="font-medium">{selectedTechnician.field || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant={selectedTechnician.isApproved ? 'default' : 'secondary'}>
                    {selectedTechnician.isApproved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="font-medium">{selectedTechnician.companyName || 'Not specified'}</p>
                </div>
              </div>
              {selectedTechnician.createdAt && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium">{new Date(selectedTechnician.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
