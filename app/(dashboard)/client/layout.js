'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { LayoutDashboard, Briefcase, PlusCircle, Bell } from 'lucide-react'

const navItems = [
  { href: '/client', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/client/jobs', label: 'My Jobs', icon: Briefcase },
  { href: '/client/create-job', label: 'Create Job', icon: PlusCircle },
  { href: '/client/notifications', label: 'Notifications', icon: Bell },
]

export default function ClientLayout({ children }) {
  return (
    <DashboardLayout navItems={navItems} title="Client Dashboard">
      {children}
    </DashboardLayout>
  )
}
