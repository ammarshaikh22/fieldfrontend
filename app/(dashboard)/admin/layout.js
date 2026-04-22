'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { LayoutDashboard, Users, Briefcase, Bell } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/technicians', label: 'Technicians', icon: Users },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
]

export default function AdminLayout({ children }) {
  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      {children}
    </DashboardLayout>
  )
}
