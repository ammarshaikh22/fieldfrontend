import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wrench, Users, Briefcase } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">FieldOps</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          A comprehensive field service management system for admins, technicians, and clients.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Manage technicians, assign jobs, and oversee all field operations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Wrench className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Technician</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                View assigned jobs, update status, and manage your field work.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Client</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Create service requests and track the status of your jobs.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
