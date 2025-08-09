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

const mcpSchema = z.object({
  name: z.string().min(1, 'MCP name is required'),
  endpoint: z.string().url('Valid endpoint URL is required'),
  project_id: z.string().min(1, 'Project is required'),
})

type McpFormData = z.infer<typeof mcpSchema>

interface McpFormProps {
  onSuccess: () => void
}

export default function McpForm({ onSuccess }: McpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<(Tables<'projects'> & { user_name: string })[]>([])

  const form = useForm<McpFormData>({
    resolver: zodResolver(mcpSchema),
    defaultValues: {
      name: '',
      endpoint: '',
      project_id: '',
    },
  })

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          users!inner(name)
        `)
        .order('name')

      if (error) {
        console.error('Error fetching projects:', error)
      } else {
        const projectsWithUserNames = data?.map(project => ({
          ...project,
          user_name: (project.users as any).name
        })) || []
        setProjects(projectsWithUserNames)
      }
    }

    fetchProjects()
  }, [])

  const onSubmit = async (data: McpFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const newMcp: TablesInsert<'mcp'> = {
        name: data.name,
        endpoint: data.endpoint,
        project_id: data.project_id,
      }

      const { data: insertedMcp, error: insertError } = await supabase
        .from('mcp')
        .insert(newMcp)
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      console.log('MCP created:', insertedMcp)
      form.reset()
      onSuccess()
    } catch (err) {
      console.error('Error creating MCP:', err)
      setError(err instanceof Error ? err.message : 'Failed to create MCP')
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
              <FormLabel>MCP Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter MCP name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endpoint URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/mcp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name} ({project.user_name})
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
          {isLoading ? 'Creating...' : 'Create MCP'}
        </Button>
      </form>
    </Form>
  )
}