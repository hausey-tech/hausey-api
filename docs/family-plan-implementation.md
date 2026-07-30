# Plano de Implementação — Plano Familiar

> **Baseado em:** `docs/subscription-flow-map.md`
> **Stack:** Express + TypeORM + tsyringe · Gateways: Pagarme (BR) + Stripe (US/PT)
> **Data:** Jun 11, 2026

---

## Sumário

1. [Definições de negócio](#1-definições-de-negócio)
2. [Modelagem do banco de dados](#2-modelagem-do-banco-de-dados)
3. [Módulo de dependentes](#3-módulo-de-dependentes)
4. [Configuração de planos nos gateways](#4-configuração-de-planos-nos-gateways)
5. [Lógica de upgrade, downgrade e cancelamento](#5-lógica-de-upgrade-downgrade-e-cancelamento)
6. [Adaptações nos webhooks](#6-adaptações-nos-webhooks)
7. [Fluxo de convite de dependentes](#7-fluxo-de-convite-de-dependentes)
8. [Middleware de assinante ativo](#8-middleware-de-assinante-ativo)
9. [Alterações nas validações de plano existentes](#9-alterações-nas-validações-de-plano-existentes)
10. [Frontend Web](#10-frontend-web)
11. [Checklist de implementação](#11-checklist-de-implementação)

---

## 1. Definições de Negócio

### Tipos de plano

| Tipo | Identificador | Dependentes | Descrição |
|---|---|---|---|
| Individual | `individual` | 0 | Plano atual, sem dependentes |
| Familiar 1 | `family_1` | até 3 | Novo |
| Familiar 2 | `family_2` | até 5 | Novo |

> O plano familiar será disponível tanto para BR (Pagarme) quanto para US/PT (Stripe).

### Tipos de dependente

| Tipo | Tem email? | Fluxo | Acesso ao app |
|---|---|---|---|
| **Com acesso** | Sim | Envia e-mail de convite → dependente aceita e vincula conta própria | Sim, conta própria |
| **Sem acesso** | Não | Cria conta sem email → retorna `accessToken` para o titular | Sim, mas gerenciado pelo titular |

### Regra de negócio principal

- Qualquer paciente pode assinar o plano familiar.
- O **titular** é o `Patient` que possui o `planId` e o `planExpiresAt`.
- O **dependente** herda a validade do plano do titular — não paga separadamente.
- Ao cancelar/expirar o plano do titular, todos os dependentes perdem acesso.

---

## 2. Modelagem do Banco de Dados

### 2.1 Alteração na tabela `plans`

Adicionar dois campos:

| Campo TS | Coluna DB | Tipo | Descrição |
|---|---|---|---|
| `planType` | `plan_type` | enum(`individual`, `family_1`, `family_2`), default `individual` | Tipo do plano |
| `maxDependents` | `max_dependents` | int, default `0` | Máximo de dependentes permitidos |

**Migration:** `AddPlanTypeAndMaxDependentsOnPlans`

```typescript
// Exemplo da migration
await queryRunner.addColumn('plans', new TableColumn({
  name: 'plan_type',
  type: 'varchar',
  default: "'individual'",
}));
await queryRunner.addColumn('plans', new TableColumn({
  name: 'max_dependents',
  type: 'int',
  default: 0,
}));
```

> **Preencher nos planos existentes:** todos os planos atuais recebem `plan_type = 'individual'` e `max_dependents = 0`.

---

### 2.2 Nova tabela `patient_dependents`

Arquivo: `src/modules/patients/entities/patient-dependent.ts`

| Campo TS | Coluna DB | Tipo | Descrição |
|---|---|---|---|
| `id` | `id` | uuid, PK | BaseEntity |
| `holderId` | `holder_id` | uuid, FK → patients.id | Titular do plano |
| `holder` | — | ManyToOne → Patient | Relação ORM |
| `dependentPatientId` | `dependent_patient_id` | uuid, FK → patients.id, nullable | Preenchido após aceite (com acesso) ou na criação (sem acesso) |
| `dependentPatient` | — | ManyToOne → Patient, nullable | Relação ORM |
| `name` | `name` | varchar | Nome do dependente |
| `email` | `email` | varchar, nullable | Email para convite (nulo se sem acesso) |
| `hasAppAccess` | `has_app_access` | boolean, default `true` | Se o dependente tem acesso ao app com conta própria |
| `status` | `status` | enum(`pending`, `active`, `removed`) | Estado do vínculo |
| `inviteToken` | `invite_token` | varchar, nullable | Token UUID para aceite do convite |
| `inviteExpiresAt` | `invite_expires_at` | timestamp, nullable | Expiração do token (ex: 7 dias) |
| `createdAt` | `created_at` | timestamp | BaseEntity |
| `updatedAt` | `updated_at` | timestamp | BaseEntity |
| `deletedAt` | `deleted_at` | timestamp, nullable | BaseEntity (soft delete) |

```typescript
// src/modules/patients/entities/patient-dependent.ts
@Entity('patient_dependents')
export class PatientDependent extends BaseEntity {
  @Column('uuid', { name: 'holder_id' })
  holderId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'holder_id' })
  holder: Patient;

  @Column('uuid', { name: 'dependent_patient_id', nullable: true })
  dependentPatientId: string | null;

  @ManyToOne(() => Patient, { nullable: true })
  @JoinColumn({ name: 'dependent_patient_id' })
  dependentPatient: Patient | null;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  email: string | null;

  @Column('boolean', { name: 'has_app_access', default: true })
  hasAppAccess: boolean;

  @Column('varchar', { default: 'pending' })
  status: 'pending' | 'active' | 'removed';

  @Column('varchar', { name: 'invite_token', nullable: true })
  inviteToken: string | null;

  @Column('timestamp', { name: 'invite_expires_at', nullable: true })
  inviteExpiresAt: Date | null;
}
```

**Migration:** `CreatePatientDependents`

---

### 2.3 Relacionamento final

```
Patient (titular)
  ├── planId           → Plan (plan_type: family_1 | family_2)
  │     └── maxDependents = 3 ou 5
  ├── planExpiresAt    → validade (herdada pelos dependentes)
  └── dependents[]     → PatientDependent[]
        ├── holderId   → Patient (titular)
        ├── dependentPatientId → Patient (conta do dependente, se houver)
        ├── hasAppAccess → boolean
        └── status     → pending | active | removed

Patient (dependente, com acesso)
  ├── planId = null         (não possui plano próprio)
  ├── planExpiresAt = null  (validade vem do titular via PatientDependent)
  └── (PatientDependent.dependentPatientId aponta para este Patient)
```

---

## 3. Módulo de Dependentes

### 3.1 Arquivos novos

```
src/modules/patients/
  ├── entities/
  │   └── patient-dependent.ts          ← nova entidade
  ├── repositories/
  │   └── patient-dependents-repository.ts  ← repositório
  ├── services/
  │   ├── add-dependent-service.ts          ← adiciona dependente
  │   ├── remove-dependent-service.ts       ← remove dependente
  │   ├── accept-dependent-invite-service.ts ← dependente aceita convite
  │   ├── list-dependents-service.ts        ← lista dependentes de um titular
  │   └── deactivate-all-dependents-service.ts ← desativa todos (cancelamento/expiração)
```

### 3.2 Endpoints novos

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/v1/patients/:patientId/dependents` | Sim | Lista dependentes do titular |
| `POST` | `/v1/patients/:patientId/dependents` | Sim | Adiciona dependente |
| `DELETE` | `/v1/patients/:patientId/dependents/:dependentId` | Sim | Remove dependente |
| `GET` | `/v1/patients/dependents/invite/:token` | Não | Valida token de convite |
| `POST` | `/v1/patients/dependents/invite/:token/accept` | Não | Aceita convite (vincula conta existente ou cria nova) |

### 3.3 Lógica de `POST /dependents` — AddDependentService

```typescript
async execute({ holderId, name, email, hasAppAccess }) {
  // 1. Busca titular
  const holder = await patientsRepository.findById(holderId);

  // 2. Valida que titular tem plano familiar ativo
  const plan = await plansRepository.findById(holder.planId);
  if (!plan || plan.planType === 'individual') {
    throw new Error('Titular não possui plano familiar.');
  }
  if (!holder.planExpiresAt || isBefore(holder.planExpiresAt, new Date())) {
    throw new Error('Plano do titular está expirado.');
  }

  // 3. Valida limite de dependentes
  const currentDependents = await dependentsRepository.countActiveByHolder(holderId);
  if (currentDependents >= plan.maxDependents) {
    throw new Error(`Limite de ${plan.maxDependents} dependentes atingido.`);
  }

  if (hasAppAccess) {
    // 5a. COM acesso: cria registro pending + envia convite por email
    const inviteToken = uuid();
    const inviteExpiresAt = addDays(new Date(), 7);
    const dependent = await dependentsRepository.create({
      holderId, name, email, hasAppAccess: true,
      status: 'pending', inviteToken, inviteExpiresAt,
    });
    await sendDependentInviteEmail({ to: email, holderName: holder.name, inviteToken });
    return dependent;

  } else {
    // 5b. SEM acesso: cria conta Patient sem email + vincula direto como active
    const tempDocument = generateTempDocument(); // ou receber documento no body
    const newPatient = await patientsRepository.create({
      name, region: holder.region, sellerId: holder.sellerId,
      // sem email, sem senha
    });
    const dependent = await dependentsRepository.create({
      holderId, name, email: null, hasAppAccess: false,
      dependentPatientId: newPatient.id, status: 'active',
    });
    const accessToken = generateJwt(newPatient.id);
    return { dependent, accessToken };
  }
}
```

---

## 4. Configuração de Planos nos Gateways

### 4.1 Stripe (US e PT)

Criar novos **Products** e **Prices** no Stripe Dashboard (ou via API) para cada novo tipo de plano familiar:

| Plano | Produto Stripe | Price ID esperado |
|---|---|---|
| Familiar 1 — US | `Hausey Family Plan 1 (US)` | `price_XXXXXXXXXXXXXXXX` |
| Familiar 2 — US | `Hausey Family Plan 2 (US)` | `price_XXXXXXXXXXXXXXXX` |
| Familiar 1 — PT | `Hausey Family Plan 1 (PT)` | `price_XXXXXXXXXXXXXXXX` |
| Familiar 2 — PT | `Hausey Family Plan 2 (PT)` | `price_XXXXXXXXXXXXXXXX` |

Após criar, inserir na tabela `plans` com `plan_type = 'family_1'` ou `'family_2'` e o `stripe_price_id` correspondente.

### 4.2 Pagarme (BR)

Criar novos **planos recorrentes** no Pagarme via `CreatePagarmePlanService` (já existente):

| Plano | plan_id esperado |
|---|---|
| Familiar 1 — BR | `plan_XXXXXXXXXXXXXXXX` |
| Familiar 2 — BR | `plan_XXXXXXXXXXXXXXXX` |

Após criar, inserir na tabela `plans` com `plan_type` e `stripe_price_id` contendo o `plan_id` do Pagarme.

### 4.3 Endpoint de criação de plano

O `POST /v1/plans` existente precisará aceitar os novos campos:

```typescript
// Body do POST /v1/plans — adicionar:
{
  "name": "Plano Familiar 1",
  "price": 9900,
  "planType": "family_1",       // novo
  "maxDependents": 3,            // novo
  "stripePriceId": "price_...",
  "sellerPart": 10,
  "regions": ["us", "pt", "br"]
}
```

---

## 5. Lógica de Upgrade, Downgrade e Cancelamento

### 5.1 Novos endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/v1/patients/:patientId/plan/upgrade` | Sim | Muda para plano mais caro |
| `POST` | `/v1/patients/:patientId/plan/downgrade` | Sim | Muda para plano mais barato |
| `DELETE` | `/v1/patients/:patientId/plan` | Sim | Cancela assinatura e remove dependentes |

### 5.2 Upgrade — `UpgradePlanService`

```
Fluxo:
1. Valida que novo plano é "maior" (mais dependentes) que o atual
2. Gateway Stripe:
   - Busca subscription ativa do customer (via stripe.subscriptions.list)
   - Atualiza o price via stripe.subscriptions.update({ items: [{ price: newPriceId }] })
   - Stripe aplica prorate automaticamente
3. Gateway Pagarme:
   - Cancela assinatura atual (CancelPagarmeCustomerSubscriptionsService)
   - Cria nova assinatura com novo plan_id
4. Atualiza patient.planId = newPlanId no banco
5. (planExpiresAt será atualizado no próximo webhook invoice.paid)
```

### 5.3 Downgrade — `DowngradePlanService`

```
Fluxo:
1. Valida que novo plano permite menos dependentes
2. Conta dependentes ativos atuais:
   - Se dependentes_ativos > novo_maxDependents → erro:
     "Remova X dependente(s) antes de fazer downgrade."
3. Mesma lógica do Upgrade para trocar o plano no gateway
4. Atualiza patient.planId = newPlanId no banco
```

### 5.4 Cancelamento — `CancelFamilyPlanService`

```
Fluxo:
1. Gateway Stripe:
   - stripe.subscriptions.cancel(subscriptionId)
   - OU redirecionar para Billing Portal (já existe)
2. Gateway Pagarme:
   - CancelPagarmeCustomerSubscriptionsService (já existe)
3. Atualiza patient:
   - planId = null
   - planExpiresAt = null
4. Desativa todos os dependentes:
   - DeactivateAllDependentsService: status = 'removed' para todos
5. Envia e-mail para cada dependente ativo notificando o encerramento
```

---

## 6. Adaptações nos Webhooks

### 6.1 Stripe — adicionar `customer.subscription.deleted`

**Arquivo:** `src/modules/integrations/services/stripe/handle-webhook.ts` (e `handle-pt-webhook.ts`)

```typescript
// Adicionar ao switch/if de eventos:
if (event.type === 'customer.subscription.deleted') {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;

  // 1. Busca paciente pelo stripeCustomerId
  // 2. Zera planId e planExpiresAt
  // 3. Desativa dependentes (DeactivateAllDependentsService)
  // 4. Envia e-mail de notificação para dependentes
}
```

**Tabela atualizada de eventos por webhook:**

| Evento | Tratado antes | Tratar agora | Ação |
|---|---|---|---|
| `invoice.paid` | Sim | Manter | Atualiza `planExpiresAt` + split |
| `customer.subscription.deleted` | Não | **Sim** | Zera plano + desativa dependentes |
| `invoice.payment_failed` | Não | Opcional (fase 2) | Notificar titular |

### 6.2 Pagarme — já cobre cancelamento?

O Pagarme não envia webhook de cancelamento automático hoje. O cancelamento via `CancelPagarmeCustomerSubscriptionsService` já é chamado programaticamente antes de uma nova assinatura. Para o plano familiar, o `CancelFamilyPlanService` (seção 5.4) chama esse serviço diretamente e desativa dependentes em seguida — sem necessidade de webhook adicional.

---

## 7. Fluxo de Convite de Dependentes

### 7.1 Dependente COM acesso (com email)

```
Titular adiciona dependente com email
  └─► Backend cria PatientDependent (status=pending, inviteToken, inviteExpiresAt)
  └─► Envia e-mail com link: https://app.hausey.com/convite/{inviteToken}

Dependente clica no link
  └─► Frontend chama GET /v1/patients/dependents/invite/{token}
      (valida token, retorna nome do titular e plano)
  └─► Dependente faz login OU cria conta
  └─► Frontend chama POST /v1/patients/dependents/invite/{token}/accept
      com { dependentPatientId: "uuid da conta logada" }

Backend (AcceptDependentInviteService):
  1. Valida token e expiração
  2. Valida que dependentPatientId é um Patient válido
  3. Valida que esse Patient não é titular de outro plano familiar
  4. Seta PatientDependent.dependentPatientId = dependentPatientId
  5. Seta status = 'active'
  6. Invalida o token
```

### 7.2 Dependente SEM acesso (sem email)

```
Titular adiciona dependente sem email (hasAppAccess = false, sem email)
  └─► Backend cria Patient (sem email/senha)
  └─► Cria PatientDependent (status=active, dependentPatientId=Patient.id)
  └─► Retorna { dependent, accessToken }

Titular usa o accessToken para logar como dependente
  (ex: botão "Acessar como [nome]" na tela de dependentes)
```

### 7.3 Template de e-mail de convite

Novo template em `src/shared/utils/html-texts.ts`:

```typescript
export const DependentInviteHtmlText = (holderName: string, inviteUrl: string) => `
  <h2>Você foi convidado para o Plano Familiar Hausey</h2>
  <p>${holderName} adicionou você como dependente no Plano Familiar Hausey.</p>
  <p>Clique no botão abaixo para aceitar o convite e criar sua conta:</p>
  <a href="${inviteUrl}">Aceitar Convite</a>
  <p>Este link expira em 7 dias.</p>
`;
```

---

## 8. Middleware de Assinante Ativo

### 8.1 Helper centralizado — `isActiveSubscriber`

Criar utilitário em `src/shared/utils/is-active-subscriber.ts`:

```typescript
import { isBefore } from 'date-fns';
import { Patient } from '@modules/patients/entities/patient';
import { PatientDependent } from '@modules/patients/entities/patient-dependent';

export interface ActiveSubscriberResult {
  isActive: boolean;
  role: 'holder' | 'dependent' | 'none';
  holder?: Patient;
}

export async function isActiveSubscriber(
  patientId: string,
  dependentsRepository: IPatientDependentsRepository,
): Promise<ActiveSubscriberResult> {
  const now = new Date();

  // Caso 1: é titular com plano ativo
  const patient = await patientsRepository.findById(patientId);
  if (patient?.planId && patient?.planExpiresAt && isBefore(now, patient.planExpiresAt)) {
    return { isActive: true, role: 'holder', holder: patient };
  }

  // Caso 2: é dependente vinculado a titular ativo
  const dependent = await dependentsRepository.findActiveByDependentPatientId(patientId);
  if (dependent) {
    const holder = dependent.holder;
    if (holder?.planExpiresAt && isBefore(now, holder.planExpiresAt)) {
      return { isActive: true, role: 'dependent', holder };
    }
  }

  return { isActive: false, role: 'none' };
}
```

### 8.2 Middleware Express — `ensureActiveSubscription`

Criar em `src/shared/middlewares/ensure-active-subscription.ts`:

```typescript
export async function ensureActiveSubscription(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const patientId = req.patient?.id; // assumindo que ensureAuthentication já setou

  const result = await isActiveSubscriber(patientId, dependentsRepository);

  if (!result.isActive) {
    return res.status(403).json({ error: 'Assinatura inativa ou inexistente.' });
  }

  req.subscriptionRole = result.role;   // 'holder' | 'dependent'
  req.subscriptionHolder = result.holder;
  next();
}
```

Uso nas rotas que exigem assinatura ativa:
```typescript
router.get(
  '/appointments',
  ensureAuthentication,
  ensureActiveSubscription,  // ← adicionar
  appointmentsController.index,
);
```

---

## 9. Alterações nas Validações de Plano Existentes

### 9.1 `check-appointment-price.ts`

**Problema atual:** valida apenas `planId`, sem checar `planExpiresAt` e sem considerar dependentes.

**Alteração:**
```typescript
// ANTES:
if (patient.planId) { /* busca desconto */ }

// DEPOIS:
const { isActive, holder } = await isActiveSubscriber(patient.id, dependentsRepository);
const effectivePlanId = isActive
  ? (holder?.planId ?? patient.planId) // usa planId do titular se for dependente
  : null;

if (effectivePlanId) { /* busca desconto */ }
```

### 9.2 `create-patient-card-subscription-service.ts`

**Problema atual:** bloqueia nova assinatura se `planExpiresAt` está no futuro, mas não sabe se é plano individual ou familiar.

**Alteração:** ao verificar assinatura vigente, ignorar o bloqueio se o `patient` for um **dependente** (dependentes não devem fazer assinatura própria):

```typescript
// Adicionar validação:
const isDependent = await dependentsRepository.findActiveByDependentPatientId(patientId);
if (isDependent) {
  throw new AppError('Dependentes não podem assinar planos individuais.');
}
```

### 9.3 Integração Nipomed

**Arquivo:** `CreateAddressService.ts`

A lógica atual usa `patient.planId && planExpiresAt`. Para dependentes, o `planId` é nulo mas o titular pode ter Nipomed. Ajustar para verificar o `effectivePlanId` via `isActiveSubscriber`, se Nipomed for relevante para dependentes.

### 9.4 `update-subscription-by-webhook-service.ts` (Pagarme)

Ao atualizar `planExpiresAt` do titular via webhook, verificar se o novo plano é familiar e logar quantidade de dependentes ativos (útil para auditoria).

---

## 10. Frontend Web

### 10.1 Tela de gerenciar dependentes

**Rota sugerida:** `/minha-conta/dependentes`

**Componentes:**
- Lista de dependentes com status (Pendente / Ativo / Removido)
- Botão "Adicionar dependente":
  - Toggle: "Tem acesso ao app?" (sim/não)
  - Se sim: campos Nome + Email
  - Se não: campo Nome (retorna QR Code / código de acesso com o `accessToken`)
- Botão "Remover" por dependente
- Contador: "X de Y dependentes utilizados"
- Se plano individual: banner "Faça upgrade para o Plano Familiar"

### 10.2 Fluxo de assinatura de plano familiar

**Etapas do fluxo:**
1. Tela de planos exibe 3 opções: Individual · Familiar 1 · Familiar 2
2. Ao selecionar plano familiar → mesmo fluxo de checkout atual (Stripe ou Pagarme por região)
3. Após pagamento → exibe tela de gerenciar dependentes automaticamente
4. Titular pode adicionar dependentes imediatamente

### 10.3 Validações de plano no frontend

**Locais a alterar:**

| Local | Validação atual | Nova validação |
|---|---|---|
| Guard de rota `/app/*` | `patient.planId && planExpiresAt > now` | `isActiveSubscriber(patient.id)` → holder ativo OU dependente de titular ativo |
| Exibição de preço de consulta | desconto se `planId` existe | desconto se `isActive` (independente de ser titular ou dependente) |
| Banner "Assine agora" | aparece se `!planId` | aparece se `role === 'none'` e não é dependente ativo |

### 10.4 Visualização de plano familiar em tabelas

Nas listagens admin de pacientes, adicionar coluna/badge:

| Badge | Condição |
|---|---|
| `Titular — Familiar 1` | `plan.planType === 'family_1'` e `role === 'holder'` |
| `Titular — Familiar 2` | `plan.planType === 'family_2'` e `role === 'holder'` |
| `Dependente` | `role === 'dependent'` |
| `Individual` | `plan.planType === 'individual'` |

### 10.5 Visualização de dependentes por titular (admin)

**Na tela de detalhes do paciente (admin):**
- Se o paciente é titular de plano familiar: exibir lista de dependentes com nome, status, e-mail e data de vínculo
- Se o paciente é dependente: exibir card "Dependente de [Nome do Titular]" com link para o titular

---

## 11. Checklist de Implementação

### Banco de dados

- [ ] Migration: `AddPlanTypeAndMaxDependentsOnPlans` — adicionar `plan_type` e `max_dependents` na tabela `plans`
- [ ] Migration: `CreatePatientDependents` — criar tabela `patient_dependents`
- [ ] Atualizar seed/dados existentes: todos os planos atuais com `plan_type = 'individual'`, `max_dependents = 0`
- [ ] Criar planos familiares no banco (após criar nos gateways)

### Gateways

- [ ] Criar Products e Prices no Stripe US para Familiar 1 e Familiar 2
- [ ] Criar Products e Prices no Stripe PT para Familiar 1 e Familiar 2
- [ ] Criar planos recorrentes no Pagarme para Familiar 1 e Familiar 2
- [ ] Inserir novos planos na tabela `plans` com `stripePriceId` correto

### Entidades e repositórios

- [ ] Criar `patient-dependent.ts` (entidade TypeORM)
- [ ] Criar `patient-dependents-repository.ts`
- [ ] Atualizar `plan.ts` com campos `planType` e `maxDependents`
- [ ] Registrar repositório no container DI (`src/shared/container/index.ts`)

### Serviços — Dependentes

- [ ] `AddDependentService` — com lógica de convite vs sem acesso
- [ ] `RemoveDependentService`
- [ ] `AcceptDependentInviteService`
- [ ] `ListDependentsService`
- [ ] `DeactivateAllDependentsService`

### Serviços — Plano

- [ ] `UpgradePlanService`
- [ ] `DowngradePlanService`
- [ ] `CancelFamilyPlanService`

### Shared / Middleware

- [ ] Utilitário `isActiveSubscriber` em `src/shared/utils/`
- [ ] Middleware `ensureActiveSubscription` em `src/shared/middlewares/`
- [ ] Template de e-mail `DependentInviteHtmlText` em `html-texts.ts`

### Controllers e rotas

- [ ] Criar `patient-dependents-controller.ts`
- [ ] Adicionar rotas de dependentes em `patients/routes/patients.ts`
- [ ] Adicionar rotas de upgrade/downgrade/cancelamento
- [ ] Endpoint de validação e aceite de convite (público, sem JWT)

### Webhooks

- [ ] Adicionar handler `customer.subscription.deleted` em `handle-webhook.ts` (Stripe US)
- [ ] Adicionar handler `customer.subscription.deleted` em `handle-pt-webhook.ts` (Stripe PT)
- [ ] Chamar `DeactivateAllDependentsService` nos handlers de cancelamento

### Validações existentes (ajustes)

- [ ] `check-appointment-price.ts` — usar `isActiveSubscriber` + `effectivePlanId`
- [ ] `create-patient-card-subscription-service.ts` — bloquear dependentes de assinar individualmente
- [ ] Nipomed — ajustar se aplicável a dependentes

### Frontend Web

- [ ] Tela `/minha-conta/dependentes`
- [ ] Fluxo de checkout com seleção de plano familiar
- [ ] Guard de rota usando nova lógica de `isActiveSubscriber`
- [ ] Badge de tipo de plano nas tabelas
- [ ] Visualização de dependentes no painel admin
- [ ] Tela de aceite de convite (`/convite/:token`)

---

## Diagrama de Fluxo Resumido

```
ASSINATURA DE PLANO FAMILIAR
─────────────────────────────────────────────────────

Titular (Patient com sellerId)
  │
  ├─► Seleciona Plano Familiar 1 ou 2
  ├─► Checkout Stripe / Pagarme (fluxo existente)
  ├─► Webhook invoice.paid → planId + planExpiresAt atualizados
  │
  └─► Acessa /dependentes → adiciona até maxDependents dependentes

DEPENDENTE COM ACESSO (email)          DEPENDENTE SEM ACESSO
─────────────────────────              ────────────────────────
status=pending                          status=active (imediato)
E-mail de convite enviado               Patient criado sem email
Dependente clica no link                accessToken retornado ao titular
POST /invite/:token/accept              Titular usa token para logar
status=active                           como dependente

VALIDAÇÃO DE ACESSO (middleware)
──────────────────────────────────────────────────────────────
isActiveSubscriber(patientId)
  ├─► Patient tem planId + planExpiresAt > now()  → holder ativo ✓
  └─► PatientDependent.dependentPatientId = patientId
        + holder.planExpiresAt > now()            → dependente ativo ✓

CANCELAMENTO DO TITULAR
──────────────────────────────────────────────────────────────
CancelFamilyPlanService
  ├─► Cancela no gateway (Stripe/Pagarme)
  ├─► patient.planId = null, planExpiresAt = null
  └─► DeactivateAllDependentsService
        └─► status = 'removed' para todos
        └─► E-mail de notificação para dependentes com acesso
```
