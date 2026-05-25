'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Search, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { LeadsTable, type Lead } from '@/components/list-view/leads-table';
import { LeadDrawer } from '@/components/kanban/lead-drawer';
import api from '@/lib/api';

interface Status {
  id: string;
  name: string;
  color: string;
  position: number;
}

interface Pipeline {
  id: string;
  name: string;
  statuses: Status[];
}

interface Assignee {
  id: string;
  name: string;
}

export default function ListPage() {
  const params = useParams<{ pipelineId: string }>();
  const pipelineId = params.pipelineId;

  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  // Stable list of assignees derived from the initial (unfiltered) load
  const [allAssignees, setAllAssignees] = useState<Assignee[]>([]);
  const assigneesLoaded = useRef(false);
  const [loading, setLoading] = useState(true);
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('__all__');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('__all__');

  const fetchData = useCallback(async () => {
    if (!pipelineId) return;
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (statusFilter && statusFilter !== '__all__') queryParams.set('statusId', statusFilter);
      if (assigneeFilter && assigneeFilter !== '__all__') queryParams.set('assigneeId', assigneeFilter);

      const qs = queryParams.toString();
      const [pipelineRes, leadsRes] = await Promise.all([
        api.get('/pipelines'),
        api.get(`/pipelines/${pipelineId}/leads${qs ? `?${qs}` : ''}`),
      ]);

      const found = (pipelineRes.data.data as Pipeline[]).find(
        (p) => p.id === pipelineId,
      );
      if (found) setPipeline(found);

      const fetchedLeads: Lead[] = leadsRes.data.data;
      setLeads(fetchedLeads);

      // Build assignee list from the first unfiltered load only
      if (!assigneesLoaded.current && !search && statusFilter === '__all__' && assigneeFilter === '__all__') {
        const map = new Map<string, Assignee>();
        fetchedLeads.forEach((lead) => {
          if (lead.assignee) {
            map.set(lead.assignee.id, { id: lead.assignee.id, name: lead.assignee.name });
          }
        });
        setAllAssignees(Array.from(map.values()));
        assigneesLoaded.current = true;
      }
    } catch (err) {
      console.error('Failed to fetch list data:', err);
    } finally {
      setLoading(false);
    }
  }, [pipelineId, search, statusFilter, assigneeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statuses = pipeline?.statuses.slice().sort((a, b) => a.position - b.position) ?? [];

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!pipeline) {
    return (
      <div className="text-center text-muted-foreground">
        Pipeline nao encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{pipeline.name}</h1>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Link
            href={`/pipelines/${pipelineId}/board`}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
          >
            <LayoutGrid className="mr-1.5 size-4" />
            Board
          </Link>
          <Button variant="secondary" size="sm" disabled>
            <List className="mr-1.5 size-4" />
            Lista
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? '__all__')}>
          <SelectTrigger className="w-45">
            <span className={statusFilter === '__all__' ? 'text-muted-foreground text-sm' : 'text-sm'}>
              {statusFilter === '__all__'
                ? 'Todos os status'
                : statuses.find((s) => s.id === statusFilter)?.name ?? 'Todos os status'}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos os status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                <span
                  className="mr-1.5 inline-block size-2.5 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={assigneeFilter} onValueChange={(v) => setAssigneeFilter(v ?? '__all__')}>
          <SelectTrigger className="w-45">
            <span className={assigneeFilter === '__all__' ? 'text-muted-foreground text-sm' : 'text-sm'}>
              {assigneeFilter === '__all__'
                ? 'Todos os responsaveis'
                : allAssignees.find((a) => a.id === assigneeFilter)?.name ?? 'Todos os responsaveis'}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos os responsaveis</SelectItem>
            {allAssignees.map((assignee) => (
              <SelectItem key={assignee.id} value={assignee.id}>
                {assignee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <LeadsTable
        leads={leads}
        statuses={statuses}
        members={allAssignees}
        onRefresh={fetchData}
        onOpenLead={setOpenLeadId}
      />

      {/* Lead drawer */}
      <LeadDrawer
        leadId={openLeadId}
        onClose={() => setOpenLeadId(null)}
        onLeadUpdated={fetchData}
      />
    </div>
  );
}
