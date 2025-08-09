"use client"

import { useState } from 'react'
import { SignIn, SignOutButton, useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserForm from '@/components/UserForm'
import ProjectForm from '@/components/ProjectForm'
import McpForm from '@/components/McpForm'
import UsersList from '@/components/UsersList'
import ProjectsList from '@/components/ProjectsList'
import McpsList from '@/components/McpsList'

export default function AdminPanel() {
  const { isSignedIn, user } = useUser()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>Sign in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <SignIn />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage users, projects, and MCPs</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}</span>
              <SignOutButton>
                <Button variant="outline">Sign Out</Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="mcps">MCPs</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create New User</CardTitle>
                  <CardDescription>Add a new user and create their Clerk account</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserForm onSuccess={handleRefresh} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Users List</CardTitle>
                  <CardDescription>All registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <UsersList key={refreshTrigger} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Project</CardTitle>
                  <CardDescription>Add a new project for a user</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectForm onSuccess={handleRefresh} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Projects List</CardTitle>
                  <CardDescription>All projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectsList key={refreshTrigger} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mcps" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create New MCP</CardTitle>
                  <CardDescription>Add a new MCP for a project</CardDescription>
                </CardHeader>
                <CardContent>
                  <McpForm onSuccess={handleRefresh} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>MCPs List</CardTitle>
                  <CardDescription>All MCPs</CardDescription>
                </CardHeader>
                <CardContent>
                  <McpsList key={refreshTrigger} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
