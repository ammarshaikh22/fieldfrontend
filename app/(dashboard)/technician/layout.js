'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { LayoutDashboard, Briefcase, Bell } from 'lucide-react'

const navItems = [
  { href: '/technician', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/technician/jobs', label: 'My Jobs', icon: Briefcase },
  { href: '/technician/notifications', label: 'Notifications', icon: Bell },
]

export default function TechnicianLayout({ children }) {
  return (
    <DashboardLayout navItems={navItems} title="Technician Dashboard">
      {children}
    </DashboardLayout>
  )
}
