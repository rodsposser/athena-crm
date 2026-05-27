'use client';

import { useState, useEffect } from 'react';
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

interface Pipeline {
  id: string;
  name: string;
  statuses: { id: string; name: string; color: string; position: number; isDefault: boolean }[];
}

const BILLING_MODES = ['Pagamento prévio', 'Porcentagem', 'Misto (prévio + porcentagem)'];

interface QuickCreateLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function QuickCreateLeadDialog({ open, onOpenChange, onCreated }: QuickCreateLeadDialogProps) {
  const [loading, setLoading] = useState(false);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState('');
  const [selectedStatusId, setSelectedStatusId] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contractCount, setContractCount] = useState('');
  const [billingMode, setBillingMode] = useState('');
  const [observations, setObservations] = useState('');

  useEffect(() => {
    if (!open) return;
    api.get('/pipelines').then((res) => {
      const list: Pipeline[] = res.data.data ?? res.data;
      setPipelines(list);
      if (list.length > 0) {
        const first = list[0];
        setSelectedPipelineId(first.id);
        const sorted = [...first.statuses].sort((a, b) => a.position - b.position);
        const def = sorted.find((s) => s.isDefault) ?? sorted[0];
        if (def) setSelectedStatusId(def.id);
      }
    }).catch(() => {});
  }, [open]);

  function handlePipelineChange(id: string) {
    setSelectedPipelineId(id);
    const pipeline = pipelines.find((p) => p.id === id);
    if (pipeline) {
      const sorted = [...pipeline.statuses].sort((a, b) => a.position - b.position);
      const def = sorted.find((s) => s.isDefault) ?? sorted[0];
      if (def) setSelectedStatusId(def.id);
    }
  }

  const selectedPipeline = pipelines.find((p) => p.id === selectedPipelineId);
  const sortedStatuses = selectedPipeline
    ? [...selectedPipeline.statuses].sort((a, b) => a.position - b.position)
    : [];

  function reset() {
    setCompanyName('');
    setContactName('');
    setContactPhone('');
    setContractCount('');
    setBillingMode('');
    setObservations('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim() && !contactName.trim()) {
      toast.error('Informe ao menos o nome da empresa ou do contato');
      return;
    }
    if (!selectedPipelineId || !selectedStatusId) {
      toast.error('Selecione um pipeline');
      return;
    }

    const title = companyName.trim() || contactName.trim();

    setLoading(true);
    try {
      const res = await api.post(`/pipelines/${selectedPipelineId}/leads`, {
        title,
        contactName: contactName.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        companyName: companyName.trim() || undefined,
        statusId: selectedStatusId,
      });

      const newLeadId = res.data?.data?.id;

      if ((billingMode || contractCount || observations.trim()) && newLeadId) {
        const parts: string[] = [];
        if (contractCount) parts.push(`Média de contratos/mês: ${contractCount}`);
        if (billingMode) parts.push(`Modo de cobrança: ${billingMode}`);
        if (observations.trim()) parts.push(`Observações: ${observations.trim()}`);
        await api.post(`/leads/${newLeadId}/notes`, {
          content: parts.join('\n'),
          isPinned: true,
        });
      }

      reset();
      onOpenChange(false);
      onCreated();
      toast.success('Lead criado com sucesso');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao criar lead');
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = (companyName.trim() || contactName.trim()) && selectedPipelineId && selectedStatusId && !loading;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pipeline selector */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Pipeline *</Label>
              <Select value={selectedPipelineId} onValueChange={(v) => handlePipelineChange(v ?? '')}>
                <SelectTrigger>
                  <span className="text-sm truncate">
                    {pipelines.find((p) => p.id === selectedPipelineId)?.name ?? 'Selecionar...'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {pipelines.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Etapa</Label>
              <Select value={selectedStatusId} onValueChange={(v) => setSelectedStatusId(v ?? '')}>
                <SelectTrigger>
                  <span className="text-sm truncate">
                    {sortedStatuses.find((s) => s.id === selectedStatusId)?.name ?? 'Selecionar...'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {sortedStatuses.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <span
                        className="mr-1.5 inline-block size-2 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ql-company">Nome da empresa *</Label>
            <Input
              id="ql-company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Escritório Silva Advogados"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ql-contact">Nome do contato</Label>
            <Input
              id="ql-contact"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Ex: Dr. João Silva"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ql-phone">Telefone</Label>
            <Input
              id="ql-phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Ex: (51) 99999-9999"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ql-contracts">Média de contratos/mês</Label>
            <Input
              id="ql-contracts"
              type="number"
              step="1"
              min="0"
              value={contractCount}
              onChange={(e) => setContractCount(e.target.value)}
              placeholder="Ex: 10"
            />
          </div>
          <div className="space-y-2">
            <Label>Modo de cobrança</Label>
            <Select value={billingMode} onValueChange={(v) => setBillingMode(v ?? '')}>
              <SelectTrigger>
                <span className={!billingMode ? 'text-muted-foreground text-sm' : 'text-sm'}>
                  {billingMode || 'Selecionar...'}
                </span>
              </SelectTrigger>
              <SelectContent>
                {BILLING_MODES.map((mode) => (
                  <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ql-obs">Observações</Label>
            <Textarea
              id="ql-obs"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Informações adicionais sobre o lead..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onOpenChange(false); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {loading ? 'Criando...' : 'Criar Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
