'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

interface Status {
  id: string;
  name: string;
  color: string;
  position: number;
}

interface ScheduledTask {
  id: string;
  type: string;
  scheduledAt: string;
  notes?: string;
  lead: {
    id: string;
    title: string;
    pipelineId: string;
    contact?: { name: string; phone?: string };
    company?: { name: string };
    status?: { id: string; name: string; color: string };
    pipeline?: { id: string; name: string };
  };
}

interface CompleteTaskDialogProps {
  task: ScheduledTask | null;
  onClose: () => void;
  onCompleted: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  CALL: 'Ligação',
  MEETING: 'Reunião',
  CALLBACK: 'Retorno',
  EMAIL: 'Email/Mensagem',
};

export function CompleteTaskDialog({ task, onClose, onCompleted }: CompleteTaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState('');
  const [moveToStatusId, setMoveToStatusId] = useState('__keep__');
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    if (!task) return;
    setOutcome('');
    setMoveToStatusId('__keep__');

    const pipelineId = task.lead.pipeline?.id;
    if (!pipelineId) return;

    api.get('/pipelines').then((res) => {
      const pipelines = res.data.data as { id: string; statuses: Status[] }[];
      const found = pipelines.find((p) => p.id === pipelineId);
      if (found) {
        setStatuses(found.statuses.slice().sort((a, b) => a.position - b.position));
      }
    }).catch(() => {});
  }, [task]);

  async function handleComplete() {
    if (!task) return;
    setLoading(true);
    try {
      await api.patch(`/scheduled-tasks/${task.id}/complete`, {
        outcome: outcome.trim() || undefined,
        movedToStatusId: moveToStatusId !== '__keep__' ? moveToStatusId : undefined,
      });
      onCompleted();
      onClose();
      toast.success('Tarefa concluída');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao concluir tarefa');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!task) return;
    setLoading(true);
    try {
      await api.patch(`/scheduled-tasks/${task.id}/cancel`);
      onCompleted();
      onClose();
      toast.success('Tarefa cancelada');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao cancelar tarefa');
    } finally {
      setLoading(false);
    }
  }

  if (!task) return null;

  const scheduledTime = new Date(task.scheduledAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Dialog open={!!task} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Concluir Tarefa</DialogTitle>
          <DialogDescription>
            {TYPE_LABELS[task.type] ?? task.type} · {scheduledTime}
          </DialogDescription>
        </DialogHeader>

        {/* Lead info card */}
        <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
          <p className="font-medium text-sm">
            {task.lead.company?.name || task.lead.title}
          </p>
          {task.lead.contact && (
            <p className="text-xs text-muted-foreground">
              {task.lead.contact.name}
              {task.lead.contact.phone && ` · ${task.lead.contact.phone}`}
            </p>
          )}
          {task.lead.status && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: task.lead.status.color }}
              />
              {task.lead.status.name}
            </p>
          )}
          {task.notes && (
            <p className="text-xs text-muted-foreground border-t pt-1 mt-1">{task.notes}</p>
          )}
        </div>

        <div className="space-y-4">
          {/* Outcome */}
          <div className="space-y-2">
            <Label htmlFor="outcome">O que aconteceu?</Label>
            <Textarea
              id="outcome"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="Ex: Cliente atendeu, agendou reunião para sexta-feira..."
              rows={3}
            />
          </div>

          {/* Move to status */}
          <div className="space-y-2">
            <Label>Mover lead para etapa</Label>
            <Select value={moveToStatusId} onValueChange={setMoveToStatusId}>
              <SelectTrigger>
                <span className="text-sm">
                  {moveToStatusId === '__keep__'
                    ? 'Manter etapa atual'
                    : statuses.find((s) => s.id === moveToStatusId)?.name ?? 'Manter etapa atual'}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__keep__">Manter etapa atual</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    <span
                      className="mr-1.5 inline-block size-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={loading}
            className="mr-auto text-muted-foreground"
          >
            Cancelar tarefa
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Fechar
          </Button>
          <Button type="button" onClick={handleComplete} disabled={loading}>
            {loading ? 'Salvando...' : 'Concluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
