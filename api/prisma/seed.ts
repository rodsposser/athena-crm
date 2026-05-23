import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Athena Assessoria...');

  const passwordHash = await bcrypt.hash('athena123', 12);

  // ─── Organização ─────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: 'athena-assessoria' },
    update: {},
    create: {
      name: 'Athena Assessoria',
      slug: 'athena-assessoria',
    },
  });

  // ─── Usuários ─────────────────────────────────────────────────
  const rodrigo = await prisma.user.upsert({
    where: { email: 'rodrigopossercarvalho@gmail.com' },
    update: {},
    create: {
      name: 'Rodrigo Posser',
      email: 'rodrigopossercarvalho@gmail.com',
      passwordHash,
    },
  });

  const rafael = await prisma.user.upsert({
    where: { email: 'rafael@athena.com.br' },
    update: {},
    create: {
      name: 'Rafael',
      email: 'rafael@athena.com.br',
      passwordHash,
    },
  });

  const nathan = await prisma.user.upsert({
    where: { email: 'nathan@athena.com.br' },
    update: {},
    create: {
      name: 'Nathan',
      email: 'nathan@athena.com.br',
      passwordHash,
    },
  });

  const mari = await prisma.user.upsert({
    where: { email: 'mari@athena.com.br' },
    update: {},
    create: {
      name: 'Mari',
      email: 'mari@athena.com.br',
      passwordHash,
    },
  });

  // ─── Memberships ──────────────────────────────────────────────
  const memberships = [
    { userId: rodrigo.id, organizationId: org.id, role: 'OWNER' as const },
    { userId: rafael.id, organizationId: org.id, role: 'MANAGER' as const },
    { userId: nathan.id, organizationId: org.id, role: 'MEMBER' as const },
    { userId: mari.id, organizationId: org.id, role: 'MEMBER' as const },
  ];

  for (const m of memberships) {
    await prisma.membership.upsert({
      where: { userId_organizationId: { userId: m.userId, organizationId: m.organizationId } },
      update: {},
      create: m,
    });
  }

  // ─── Fontes de Lead ───────────────────────────────────────────
  const existingSource = await prisma.leadSource.findFirst({ where: { organizationId: org.id } });

  let metaAds: any, indicacao: any, googleAds: any, gmb: any;

  if (!existingSource) {
    metaAds    = await prisma.leadSource.create({ data: { organizationId: org.id, name: 'Meta Ads', color: '#1877F2' } });
    indicacao  = await prisma.leadSource.create({ data: { organizationId: org.id, name: 'Indicação', color: '#10B981' } });
    googleAds  = await prisma.leadSource.create({ data: { organizationId: org.id, name: 'Google Ads', color: '#EA4335' } });
    gmb        = await prisma.leadSource.create({ data: { organizationId: org.id, name: 'Google Meu Negócio', color: '#FBBC05' } });
    console.log('  Fontes: Meta Ads, Indicação, Google Ads, GMB');
  } else {
    metaAds   = await prisma.leadSource.findFirst({ where: { organizationId: org.id, name: 'Meta Ads' } });
    indicacao = await prisma.leadSource.findFirst({ where: { organizationId: org.id, name: 'Indicação' } });
    googleAds = await prisma.leadSource.findFirst({ where: { organizationId: org.id, name: 'Google Ads' } });
    gmb       = await prisma.leadSource.findFirst({ where: { organizationId: org.id, name: 'Google Meu Negócio' } });
  }

  // ─── Pipeline Advocacia ───────────────────────────────────────
  const existingPipeline = await prisma.pipeline.findFirst({
    where: { organizationId: org.id, name: 'Advocacia' },
  });

  if (!existingPipeline) {
    await prisma.pipeline.create({
      data: {
        organizationId: org.id,
        name: 'Advocacia',
        description: 'Pipeline principal para escritórios de advocacia',
        position: 0,
        currency: 'BRL',
        statuses: {
          create: [
            { name: 'Lead Recebido',     color: '#6B7280', isDefault: true,  position: 0 },
            { name: 'Qualificação',      color: '#3B82F6',                   position: 1 },
            { name: 'Reunião Agendada',  color: '#8B5CF6', isMeeting: true,  position: 2 },
            { name: 'Proposta Enviada',  color: '#F59E0B',                   position: 3 },
            { name: 'Negociação',        color: '#F97316',                   position: 4 },
            { name: 'Cliente Fechado',   color: '#10B981', isFinal: true, isWon: true,  position: 5 },
            { name: 'Perdido',           color: '#EF4444', isFinal: true, isWon: false, position: 6 },
          ],
        },
      },
    });
    console.log('  Pipeline: Advocacia (7 etapas)');
  }

  // ─── Campos Customizados ──────────────────────────────────────
  const pipeline = await prisma.pipeline.findFirst({
    where: { organizationId: org.id, name: 'Advocacia' },
  });

  if (pipeline) {
    const existingField = await prisma.customFieldDefinition.findFirst({
      where: { pipelineId: pipeline.id },
    });

    if (!existingField) {
      await prisma.customFieldDefinition.createMany({
        data: [
          { pipelineId: pipeline.id, name: 'Área do Direito',       slug: 'area-do-direito',      type: 'TEXT',   position: 0, isRequired: false },
          { pipelineId: pipeline.id, name: 'Número de Advogados',   slug: 'numero-de-advogados',  type: 'NUMBER', position: 1, isRequired: false },
          { pipelineId: pipeline.id, name: 'Cidade',                slug: 'cidade',               type: 'TEXT',   position: 2, isRequired: false },
          { pipelineId: pipeline.id, name: 'Orçamento Disponível',  slug: 'orcamento-disponivel', type: 'NUMBER', position: 3, isRequired: false },
        ],
      });
      console.log('  Campos customizados: Área do Direito, Nº de Advogados, Cidade, Orçamento');
    }
  }

  // ─── Leads Demo ───────────────────────────────────────────────
  const existingLeads = await prisma.lead.count({ where: { organizationId: org.id } });

  if (existingLeads === 0 && pipeline) {
    const statuses = await prisma.pipelineStatus.findMany({
      where: { pipelineId: pipeline.id },
      orderBy: { position: 'asc' },
    });

    const sources = [metaAds, indicacao, googleAds, gmb].filter(Boolean);
    const assignees = [rodrigo.id, rafael.id, nathan.id];
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
    const temperatures = ['COLD', 'WARM', 'HOT'] as const;

    const leadsData = [
      { title: 'Escritório Trabalhista SP',      company: 'Oliveira & Associados',    contact: 'Dr. Carlos Oliveira',   email: 'carlos@oliveiradv.com.br',   phone: '11991234567', value: 280000, statusIdx: 0 },
      { title: 'Advocacia Criminal Porto Alegre', company: 'Mendes Advogados',         contact: 'Dra. Ana Mendes',        email: 'ana@mendesadv.com.br',        phone: '51988765432', value: 180000, statusIdx: 1 },
      { title: 'Escritório Família Curitiba',    company: 'Silva & Lima Advocacia',    contact: 'Dr. Paulo Silva',        email: 'paulo@silvalima.adv.br',      phone: '41997654321', value: 150000, statusIdx: 1 },
      { title: 'Previdenciária BH',              company: 'Costa Advogados Associados',contact: 'Dra. Maria Costa',       email: 'maria@costaadv.com.br',       phone: '31986543210', value: 220000, statusIdx: 2 },
      { title: 'Imobiliário Rio de Janeiro',     company: 'Ferreira Direito Imobiliário',contact: 'Dr. João Ferreira',   email: 'joao@ferreiradv.com.br',      phone: '21995432109', value: 320000, statusIdx: 2 },
      { title: 'Trabalhista Salvador',           company: 'Rocha & Souza Advocacia',   contact: 'Dra. Carla Rocha',       email: 'carla@rochasouza.adv.br',     phone: '71984321098', value: 195000, statusIdx: 3 },
      { title: 'Cível Florianópolis',            company: 'Alves Advocacia SC',         contact: 'Dr. Roberto Alves',     email: 'roberto@alvesadv.com.br',     phone: '48993210987', value: 165000, statusIdx: 3 },
      { title: 'Tributário São Paulo',           company: 'Pinto Tributaristas',        contact: 'Dra. Juliana Pinto',    email: 'juliana@pintotrib.com.br',    phone: '11982109876', value: 450000, statusIdx: 4 },
      { title: 'Empresarial Campinas',           company: 'Lopes & Martins Advogados', contact: 'Dr. Thiago Lopes',      email: 'thiago@lopesmartins.adv.br', phone: '19971098765', value: 380000, statusIdx: 5, isWon: true },
      { title: 'Família Goiânia',                company: 'Santos Advogados GO',        contact: 'Dra. Fernanda Santos',  email: 'fernanda@santosadv.com.br',  phone: '62960987654', isWon: true, statusIdx: 5, value: 140000 },
      { title: 'Previdenciária Fortaleza',       company: 'Lima Previdenciária',        contact: 'Dr. André Lima',        email: 'andre@limaadv.com.br',        phone: '85959876543', value: 175000, statusIdx: 6, isWon: false },
      { title: 'Criminal Manaus',                company: 'Barbosa Advocacia AM',       contact: 'Dra. Priscila Barbosa', email: 'priscila@barbosaadv.com.br', phone: '92948765432', value: 120000, statusIdx: 6, isWon: false },
    ];

    for (let i = 0; i < leadsData.length; i++) {
      const lead = leadsData[i];
      const status = statuses[Math.min(lead.statusIdx, statuses.length - 1)];
      const source = sources[i % sources.length];

      const company = await prisma.company.create({
        data: { organizationId: org.id, name: lead.company },
      });

      const contact = await prisma.contact.create({
        data: {
          organizationId: org.id,
          name: lead.contact,
          email: lead.email,
          phone: lead.phone,
          companyId: company.id,
        },
      });

      await prisma.lead.create({
        data: {
          organizationId: org.id,
          pipelineId: pipeline.id,
          statusId: status.id,
          title: lead.title,
          estimatedValue: lead.value,
          priority: priorities[i % 4],
          temperature: temperatures[i % 3],
          assigneeId: assignees[i % assignees.length],
          contactId: contact.id,
          companyId: company.id,
          sourceId: source?.id,
          position: i,
          ...(lead.isWon ? { wonAt: new Date() } : {}),
        },
      });
    }

    console.log(`  Leads demo: ${leadsData.length} escritórios de advocacia`);
  }

  console.log('\nSeed concluído:');
  console.log(`  Organização: ${org.name}`);
  console.log('  Usuários: rodrigopossercarvalho@gmail.com (OWNER), rafael, nathan, mari');
  console.log('  Senha de todos: athena123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
