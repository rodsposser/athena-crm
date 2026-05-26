'use client';

import { useState } from 'react';
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

interface CreateLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipelineId: string;
  statusId: string;
  onCreated: () => void;
}

const BILLING_MODES = ['Pagamento prévio', 'Porcentagem', 'Misto (prévio + porcentagem)'];

export function CreateLeadDialog({
  open,
  onOpenChange,
  pipelineId,
  statusId,
  onCreated,
}: CreateLeadDialogProps) {
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contractCount, setContractCount] = useState('');
  const [billingMode, setBillingMode] = useState('');
  const [observations, setObservations] = useState('');

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

    const title = companyName.trim() || contactName.trim();

    setLoading(true);
    try {
      const res = await api.post(`/pipelines/${pipelineId}/leads`, {
        title,
        contactName: contactName.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        companyName: companyName.trim() || undefined,
        statusId,
      });

      const newLeadId = res.data?.data?.id;

      if ((billingMode || contractCount || observations.trim()) && newLeadId) {
        const parts = [];
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

  const canSubmit = (companyName.trim() || contactName.trim()) && !loading;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da empresa *</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Escritório Silva Advogados"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName">Nome do contato</Label>
            <Input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Ex: Dr. João Silva"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Telefone</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Ex: (51) 99999-9999"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractCount">Média de contratos/mês</Label>
            <Input
              id="contractCount"
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
            <Select value={billingMode} onValueChange={(v) => setBillingMode(v as string)}>
              <SelectTrigger>
                <span className={!billingMode ? 'text-muted-foreground text-sm' : 'text-sm'}>
                  {billingMode || 'Selecionar...'}
                </span>
              </SelectTrigger>
              <SelectContent>
                {BILLING_MODES.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Informações adicionais sobre o lead..."
              rows={3}
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
