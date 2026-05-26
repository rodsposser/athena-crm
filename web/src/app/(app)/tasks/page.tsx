'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, Phone, Users, CheckCircle2, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';
import { CompleteTaskDialog } from '@/components/tasks/complete-task-dialog';
import api from '@/lib/api';

/* ---------- types ---------- */

interface ScheduledTask {
  id: string;
  type: string;
  scheduledAt: string;
  status: string;
  notes?: string;
  outcome?: string;
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

interface Metrics {
  callsToday: number;
  meetingsToday: number;
  completedToday: number;
}

/* ---------- helpers ---------- */

const TYPE_COLORS: Record<string, string> = {
  CALL: 'bg-blue-500',
  MEETING: 'bg-green-500',
  CALLBACK: 'bg-orange-500',
  EMAIL: 'bg-purple-500',
};

const TYPE_LABELS: Record<string, string> = {
  CALL: 'Ligação',
  MEETING: 'Reunião',
  CALLBACK: 'Retorno',
  EMAIL: 'Email',
};

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DAY_NAMES_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function getWeekDays(referenceDate: Date): Date[] {
  // Start week on Monday
  const day = referenceDate.getDay(); // 0=Sun
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toDateString(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatWeekLabel(days: Date[]) {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return `${days[0].toLocaleDateString('pt-BR', opts)} – ${days[6].toLocaleDateString('pt-BR', opts)}`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/* ---------- component ---------- */

export default function TasksPage() {
  const [reference, setReference] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const weekDays = getWeekDays(reference);
  const today = toDateString(new Date());

  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [createDefaultDate, setCreateDefaultDate] = useState<string>();
  const [createDefaultTime, setCreateDefaultTime] = useState<string>();
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, metricsRes] = await Promise.all([
        api.get('/scheduled-tasks', {
          params: {
            dateFrom: toDateString(weekDays[0]),
            dateTo: toDateString(weekDays[6]),
          },
        }),
        api.get('/scheduled-tasks/metrics', { params: { date: today } }),
      ]);
      setTasks(tasksRes.data.data ?? tasksRes.data);
      setMetrics(metricsRes.data.data ?? metricsRes.data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function prevWeek() {
    setReference((d) => {
      const n = new Date(d);
      n.setDate(d.getDate() - 7);
      return n;
    });
  }

  function nextWeek() {
    setReference((d) => {
      const n = new Date(d);
      n.setDate(d.getDate() + 7);
      return n;
    });
  }

  function openCreateForDay(dateStr: string) {
    setCreateDefaultDate(dateStr);
    setCreateDefaultTime('09:00');
    setCreateOpen(true);
  }

  function tasksForDay(dateStr: string) {
    return tasks
      .filter((t) => new Date(t.scheduledAt).toISOString().slice(0, 10) === dateStr)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tarefas</h1>
          <p className="text-sm text-muted-foreground">Calendário de atividades de prospecção</p>
        </div>
        <Button onClick={() => { setCreateDefaultDate(today); setCreateDefaultTime('09:00'); setCreateOpen(true); }}>
          <Plus className="mr-1.5 size-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-8 w-12" /></CardContent></Card>
          ))
        ) : (
          <>
            <Card>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Phone className="size-3.5" />
                  Ligações hoje
                </div>
                <p className="text-2xl font-bold">{metrics?.callsToday ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Users className="size-3.5" />
                  Reuniões hoje
                </div>
                <p className="text-2xl font-bold">{metrics?.meetingsToday ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <CheckCircle2 className="size-3.5" />
                  Concluídas hoje
                </div>
                <p className="text-2xl font-bold">{metrics?.completedToday ?? 0}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Week nav */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={prevWeek}>
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-medium min-w-48 text-center">
          {formatWeekLabel(weekDays)}
        </span>
        <Button variant="outline" size="icon" onClick={nextWeek}>
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReference(new Date())}
          className="ml-1"
        >
          Hoje
        </Button>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dateStr = toDateString(day);
          const dayTasks = tasksForDay(dateStr);
          const isToday = dateStr === today;

          return (
            <div key={dateStr} className="min-h-32">
              {/* Day header */}
              <div
                className={cn(
                  'mb-2 rounded-lg px-2 py-1.5 text-center text-xs font-medium',
                  isToday
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <div>{DAY_NAMES[day.getDay()]}</div>
                <div className="text-base font-bold leading-tight">{day.getDate()}</div>
              </div>

              {/* Tasks */}
              <div className="space-y-1.5">
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  dayTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={cn(
                        'w-full rounded-md p-1.5 text-left text-xs transition-opacity hover:opacity-80',
                        task.status === 'COMPLETED'
                          ? 'opacity-50 bg-muted'
                          : task.status === 'CANCELLED'
                          ? 'opacity-30 bg-muted line-through'
                          : 'bg-card border',
                      )}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <span
                          className={cn('inline-block size-1.5 rounded-full shrink-0', TYPE_COLORS[task.type] ?? 'bg-gray-400')}
                        />
                        <span className="text-muted-foreground">{formatTime(task.scheduledAt)}</span>
                      </div>
                      <p className="font-medium truncate text-[11px] leading-tight">
                        {task.lead.company?.name || task.lead.title}
                      </p>
                      <p className="text-muted-foreground truncate text-[10px]">
                        {TYPE_LABELS[task.type]}
                        {task.lead.contact?.name && ` · ${task.lead.contact.name}`}
                      </p>
                    </button>
                  ))
                )}

                {/* Add button */}
                <button
                  onClick={() => openCreateForDay(dateStr)}
                  className="w-full rounded-md border border-dashed py-1 text-center text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="inline size-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {Object.entries(TYPE_LABELS).map(([value, label]) => (
          <span key={value} className="flex items-center gap-1">
            <span className={cn('inline-block size-2 rounded-full', TYPE_COLORS[value])} />
            {label}
          </span>
        ))}
      </div>

      {/* Dialogs */}
      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultDate={createDefaultDate}
        defaultTime={createDefaultTime}
        onCreated={fetchData}
      />

      <CompleteTaskDialog
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onCompleted={fetchData}
      />
    </div>
  );
}
