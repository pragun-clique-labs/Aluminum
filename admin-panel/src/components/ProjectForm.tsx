"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { supabase } from '@/lib/supabase'
import { Tables, TablesInsert } from '@/types/database.types'

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  user_id: z.string().min(1, 'User is required'),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  onSuccess: () => void
}

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<Tables<'users'>[]>([])

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      user_id: '',
    },
  })

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching users:', error)
      } else {
        setUsers(data || [])
      }
    }

    fetchUsers()
  }, [])

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const newProject: TablesInsert<'projects'> = {
        name: data.name,
        user_id: data.user_id,
      }

      const { data: insertedProject, error: insertError } = await supabase
        .from('projects')
        .insert(newProject)
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      console.log('Project created:', insertedProject)
      form.reset()
      onSuccess()
    } catch (err) {
      console.error('Error creating project:', err)
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </Form>
  )
}