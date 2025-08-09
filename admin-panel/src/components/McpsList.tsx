"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Tables } from '@/types/database.types'

type McpWithProject = Tables<'mcp'> & {
  projects: Tables<'projects'> & {
    users: Tables<'users'>
  }
}

export default function McpsList() {
  const [mcps, setMcps] = useState<McpWithProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMcps()
  }, [])

  const fetchMcps = async () => {
    try {
      const { data, error } = await supabase
        .from('mcp')
        .select(`
          *,
          projects!inner(
            *,
            users!inner(*)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setMcps(data || [])
    } catch (err) {
      console.error('Error fetching MCPs:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch MCPs')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMcp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this MCP?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('mcp')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setMcps(mcps.filter(mcp => mcp.id !== id))
    } catch (err) {
      console.error('Error deleting MCP:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete MCP')
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading MCPs...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  if (mcps.length === 0) {
    return <div className="text-gray-500 text-center py-4">No MCPs found</div>
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MCP Name</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mcps.map((mcp) => (
            <TableRow key={mcp.id}>
              <TableCell className="font-medium">{mcp.name}</TableCell>
              <TableCell className="text-sm font-mono">
                <div className="flex items-center space-x-2">
                  <span className="truncate max-w-[200px]">{mcp.endpoint}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(mcp.endpoint, '_blank')}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{mcp.projects.name}</TableCell>
              <TableCell>{mcp.projects.users.name}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMcp(mcp.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}