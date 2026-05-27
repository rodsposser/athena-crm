'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';

interface LeadResult {
  id: string;
  title: string;
  contact?: { name: string; phone?: string };
  company?: { name: string };
  status?: { name: string; color: string };
  pipeline?: { name: string };
}

const TASK_TYPES = [
  { value: 'CALL', label: 'Ligação' },
  { value: 'MEETING', label: 'Reunião' },
  { value: 'CALLBACK', label: 'Retorno' },
  { value: 'EMAIL', label: 'Email/Mensagem' },
];

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: string;
  defaultTime?: string;
  onCreated: () => void;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  defaultDate,
  defaultTime,
  onCreated,
}: CreateTaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('CALL');
  const [date, setDate] = useState(defaultDate || new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(defaultTime || '09:00');
  const [notes, setNotes] = useState('');

  const [search, setSearch] = useState('');
  const [allLeads, setAllLeads] = useState<LeadResult[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Pre-load leads from all pipelines when dialog opens
  useEffect(() => {
    if (!open) return;
    setSearching(true);
    api.get('/pipelines').then(async (res) => {
      const pipelines: { id: string }[] = res.data.data ?? res.data ?? [];
      const perPipeline = await Promise.all(
        pipelines.map((p) =>
          api.get(`/pipelines/${p.id}/leads`, { params: { limit: 200 } })
            .then((r) => (r.data.data ?? r.data ?? []) as LeadResult[])
            .catch(() => [] as LeadResult[])
        )
      );
      const seen = new Set<string>();
      const merged: LeadResult[] = [];
      for (const list of perPipeline) {
        for (const lead of list) {
          if (!seen.has(lead.id)) { seen.add(lead.id); merged.push(lead); }
        }
      }
      setAllLeads(merged);
    }).catch(() => {}).finally(() => setSearching(false));
  }, [open]);

  // Filter client-side as user types, fallback to server search for longer queries
  const filtered = search.length === 0
    ? allLeads.slice(0, 8)
    : allLeads.filter((l) => {
        const q = search.toLowerCase();
        return (
          l.title?.toLowerCase().includes(q) ||
          l.company?.name?.toLowerCase().includes(q) ||
          l.contact?.name?.toLowerCase().includes(q) ||
          l.contact?.phone?.includes(q)
        );
      }).slice(0, 10);

  useEffect(() => {
    if (defaultDate) setDate(defaultDate);
    if (defaultTime) setTime(defaultTime);
  }, [defaultDate, defaultTime]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Server search fallback for longer queries not matched locally
  useEffect(() => {
    if (!search || selectedLead || allLeads.length > 0) return;
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const pRes = await api.get('/pipelines');
        const pipelines: { id: string }[] = pRes.data.data ?? pRes.data ?? [];
        const perPipeline = await Promise.all(
          pipelines.map((p) =>
            api.get(`/pipelines/${p.id}/leads`, { params: { search, limit: 10 } })
              .then((r) => (r.data.data ?? r.data ?? []) as LeadResult[])
              .catch(() => [] as LeadResult[])
          )
        );
        const seen = new Set<string>();
        const merged: LeadResult[] = [];
        for (const list of perPipeline) {
          for (const lead of list) {
            if (!seen.has(lead.id)) { seen.add(lead.id); merged.push(lead); }
          }
        }
        setAllLeads(merged);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, [search, selectedLead, allLeads.length]);

  function reset() {
    setType('CALL');
    setDate(new Date().toISOString().slice(0, 10));
    setTime('09:00');
    setNotes('');
    setSearch('');
    setSelectedLead(null);
    setAllLeads([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedLead) {
      toast.error('Selecione um lead');
      return;
    }

    setLoading(true);
    try {
      await api.post('/scheduled-tasks', {
        leadId: selectedLead.id,
        type,
        scheduledAt: `${date}T${time}:00`,
        notes: notes.trim() || undefined,
      });
      reset();
      onOpenChange(false);
      onCreated();
      toast.success('Tarefa criada');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task type */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v ?? 'CALL')}>
              <SelectTrigger>
                <span className="text-sm">
                  {TASK_TYPES.find((t) => t.value === type)?.label}
                </span>
              </SelectTrigger>
              <SelectContent>
                {TASK_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="task-date">Data</Label>
              <Input
                id="task-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-time">Horário</Label>
              <Input
                id="task-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Lead search */}
          <div className="space-y-2">
            <Label>Lead *</Label>
            {selectedLead ? (
              <div className="rounded-lg border border-input bg-muted/30 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {selectedLead.company?.name || selectedLead.title}
                    </p>
                    {selectedLead.contact && (
                      <p className="text-xs text-muted-foreground">
                        {selectedLead.contact.name}
                        {selectedLead.contact.phone && ` · ${selectedLead.contact.phone}`}
                      </p>
                    )}
                    {selectedLead.status && (
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <span
                          className="inline-block size-2 rounded-full"
                          style={{ backgroundColor: selectedLead.status.color }}
                        />
                        {selectedLead.status.name}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 h-6 px-2 text-xs"
                    onClick={() => { setSelectedLead(null); setSearch(''); }}
                  >
                    Trocar
                  </Button>
                </div>
              </div>
            ) : (
              <div ref={searchRef} className="relative">
                <Input
                  placeholder="Digite para buscar..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  autoComplete="off"
                />
                {searching && (
                  <p className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    carregando...
                  </p>
                )}
                {showDropdown && !searching && (
                  <div className="absolute z-50 w-full mt-1 rounded-lg border bg-popover shadow-md max-h-56 overflow-y-auto">
                    {filtered.length > 0 ? (
                      filtered.map((lead) => (
                        <button
                          key={lead.id}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-accent text-sm border-b last:border-0"
                          onClick={() => {
                            setSelectedLead(lead);
                            setSearch('');
                            setShowDropdown(false);
                          }}
                        >
                          <p className="font-medium">{lead.company?.name || lead.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {lead.contact?.name && `${lead.contact.name}`}
                            {lead.contact?.phone && ` · ${lead.contact.phone}`}
                            {lead.status?.name && (
                              <span className="ml-1">
                                · <span
                                  className="inline-block size-1.5 rounded-full align-middle"
                                  style={{ backgroundColor: lead.status.color }}
                                /> {lead.status.name}
                              </span>
                            )}
                          </p>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-muted-foreground">
                        {search.length > 0 ? `Nenhum resultado para "${search}"` : 'Nenhum lead encontrado'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="task-notes">Observações</Label>
            <Textarea
              id="task-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contexto, objetivo da tarefa..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onOpenChange(false); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedLead || loading}>
              {loading ? 'Criando...' : 'Criar Tarefa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
