# Mapeamento do Fluxo de Assinaturas — hausey-api

> **Stack:** Express + TypeORM + tsyringe (não é NestJS, não usa Prisma)
> **Gateways:** Pagarme (BR) · Stripe US · Stripe PT
> **Gerado em:** Jun 3, 2026

---

## Sumário

1. [Entidades e modelos de banco](#1-entidades-e-modelos-de-banco)
2. [Relacionamentos](#2-relacionamentos)
3. [Propriedades de validação de assinante](#3-propriedades-de-validação-de-assinante)
4. [Módulos e serviços](#4-módulos-e-serviços)
5. [Endpoints REST](#5-endpoints-rest)
6. [Webhooks](#6-webhooks)
7. [Emails relacionados a assinaturas](#7-emails-relacionados-a-assinaturas)
8. [Variáveis de ambiente](#8-variáveis-de-ambiente)
9. [Fluxos por região](#9-fluxos-por-região)
10. [Lacunas e pontos de atenção](#10-lacunas-e-pontos-de-atenção)

---

## 1. Entidades e Modelos de Banco

Não existe uma entidade `Subscription` separada. O estado da assinatura vive no `Patient`, com referência a `Plan`.

### `Patient` — `src/modules/patients/entities/patient.ts`

Herda de `UserEntity` (`email`, `password`, `name`, `document`, `birthdate`, `phoneNumber`, `sex`) + `BaseEntity` (`id`, `createdAt`, `updatedAt`, `deletedAt`).

| Campo TS | Coluna DB | Tipo | Descrição |
|---|---|---|---|
| `planId` | `plan_id` | varchar, nullable | FK para `plans.id` |
| `plan` | — | ManyToOne → Plan | Relação ORM |
| `stripeCustomerId` | `stripe_customer_id` | varchar, nullable | ID do customer no **Stripe ou Pagarme** (nome polimórfico) |
| `planExpiresAt` | `plan_expires_at` | timestamp, nullable | Data de expiração da assinatura |
| `firstPayment` | `first_payment` | boolean, default `false` | Controla se é o primeiro pagamento (fluxo 6x vs recorrente) |
| `sellerId` | `seller_id` | varchar, nullable | FK para o vendedor/representante |
| `region` | `region` | varchar, nullable | Região (`br`, `us`, `pt`, etc.) |
| `nipomed` | `nipomed` | boolean | Flag de integração com plano de saúde Nipomed |

---

### `Plan` — `src/modules/plans/entities/plan.ts`

| Campo TS | Coluna DB | Tipo | Descrição |
|---|---|---|---|
| `id` | `id` | uuid | BaseEntity |
| `name` | `name` | varchar | Nome do plano |
| `description` | `description` | varchar, nullable | Descrição |
| `price` | `price` | int | Preço em centavos |
| `stripePriceId` | `stripe_price_id` | varchar, nullable | ID do price/plan no gateway — prefixo `price_` = Stripe (US/PT), prefixo `plan_` = Pagarme (BR) |
| `sellerPart` | `seller_part` | int, nullable | Percentual de split para o vendedor |
| `regions` | — | OneToMany → PlanRegion | Regiões disponíveis |

> **Como identificar o gateway pelo `stripe_price_id`:**
> A tabela `plans` não possui uma coluna `gateway` ou `region`. A distinção é feita pelo **prefixo do valor** armazenado em `stripe_price_id`:
>
> | Prefixo | Gateway | Região |
> |---|---|---|
> | `plan_XXXXXXXXXXXXXXXX` | **Pagarme** | BR |
> | `price_XXXXXXXXXXXXXXXX` | **Stripe** | US / PT |
>
> Para o plano familiar, esse padrão precisa ser levado em conta ao identificar qual gateway gerenciar (criar produto/price, associar ao plano familiar, etc.).

---

### `PlanRegion` — `src/modules/plans/entities/plan-region.ts`

| Campo | Tipo |
|---|---|
| `id`, timestamps | BaseEntity |
| `planId` | varchar |
| `region` | varchar |

---

### `PlanSpecialtyDiscount` — `src/modules/plans/entities/plan-specialty-discount.ts`

| Campo | Tipo |
|---|---|
| `id`, timestamps | BaseEntity |
| `planId` | varchar |
| `specialtyId` | varchar |
| `discount` | int |

---

### `SellerCodeDiscount` — `src/modules/seller-code-discounts/entities/seller-code-discount.ts`

| Campo | Tipo |
|---|---|
| `sellerCodeId` | varchar |
| `planId` | varchar (FK Plan) |
| `discount` | int |
| `stripePromoCodeId` | varchar, nullable |

---

### `User` (vendedores) — `src/modules/users/entities/user.ts`

| Campo billing | Tipo | Descrição |
|---|---|---|
| `recipientId` | varchar, nullable | Conta conectada Stripe Connect ou recipient Pagarme |
| `region` | varchar, nullable | Região do vendedor |

---

### Migrations relevantes

| Migration | Descrição |
|---|---|
| `1667874723693-CreatePatients.ts` | Cria tabela `plans` e `patients` |
| `1676401346510-AddStripeCustomerIdOnPatient.ts` | Adiciona `stripe_customer_id` |
| `1676404238046-AddStripePriceIdOnPlan.ts` | Adiciona `stripe_price_id` |
| `1676406128651-AddPlanExpiresAtOnPatient.ts` | Adiciona `plan_expires_at` |
| `1712870624526-AddSellerPartOnPlans.ts` | Adiciona `seller_part` |
| `1728570143204-AddPlanRegions.ts` | Cria `plan_regions` |
| `1726495963290-AddSellerCodeDiscounts.ts` | Cria `seller_code_discounts` |
| `1729879652758-AddStripePromoCodeIdOnSellerCodeDiscounts.ts` | Adiciona `stripe_promo_code_id` |
| `1733244850276-CreateNewColumn.ts` | Adiciona `first_payment` |

---

## 2. Relacionamentos

```
User (vendedor)
  └── sellerCode → SellerCode
        ├── discounts[] → SellerCodeDiscount → Plan
        └── sellers[]   → SellerCodeSeller   → User.recipientId

Patient
  ├── planId           → Plan
  │     ├── regions[]              → PlanRegion
  │     └── plan_specialty_discounts[] → Specialty discounts
  ├── sellerId         → User (vendedor)
  ├── stripeCustomerId → Stripe Customer ID  OU  Pagarme Customer ID
  ├── planExpiresAt    → timestamp de expiração da assinatura
  └── firstPayment     → boolean de fluxo inicial

Plan.stripePriceId → Stripe Price ID (US/PT)  OU  Pagarme plan_id (BR)
```

---

## 3. Propriedades de Validação de Assinante

Não existem guards, decorators ou middlewares centralizados para validação de assinatura. A verificação é feita pontualmente nos serviços.

| Propriedade | Onde é verificada | Lógica |
|---|---|---|
| `planExpiresAt` | `create-patient-card-subscription-service.ts` | `isBefore(now, planExpiresAt)` → "Paciente já possui assinatura vigente!" |
| `planExpiresAt` + `planId` | `nipomed` (CreateAddressService) | `!nipomed && planId && isBefore(now, planExpiresAt)` |
| `stripeCustomerId` | todos os serviços de assinatura | obrigatoriedade de customer existente |
| `firstPayment` | `create-patient-card-subscription-service.ts` | `true` → pedido 6x; `false` → assinatura recorrente |
| `planId` | `check-appointment-price.ts` | existência do `planId` → busca desconto por especialidade (sem validar expiração) |

> **Atenção:** o campo `planId` em `check-appointment-price.ts` **não valida `planExpiresAt`** — um plano expirado ainda pode gerar desconto.

**Para considerar "assinante ativo" na nova lógica familiar:**
```
planId IS NOT NULL
AND planExpiresAt > NOW()
```

---

## 4. Módulos e Serviços

### Plans

| Arquivo | Papel |
|---|---|
| `src/modules/plans/controllers/plans.ts` | Controller REST |
| `src/modules/plans/routes/plans.ts` | Rotas |
| `src/modules/plans/services/find-plans.ts` | Listagem por região |
| `src/modules/plans/services/create-plan-service.ts` | Cria plano local + Pagarme |
| `src/modules/plans/repositories/plans.ts` | Repositório |
| `src/modules/plans/repositories/plan-specialty-discounts.ts` | Descontos por especialidade |

### Patients / Assinatura

| Arquivo | Papel |
|---|---|
| `src/modules/patients/services/create-patient-card-subscription-service.ts` | Assinatura por cartão Pagarme |
| `src/modules/patients/services/create-patient-pix-subscription-service.ts` | Pedido PIX Pagarme |
| `src/modules/patients/services/update-patient-plan.ts` | Atualiza plano via webhook Stripe |
| `src/modules/patients/services/update-patient-plan-integration.ts` | Atualização manual/parceiro |
| `src/modules/patients/services/update-subscription-by-webhook-service.ts` | Atualiza via webhook Pagarme |
| `src/modules/patients/services/get-customer-infos.ts` | Info de assinatura Pagarme |
| `src/modules/patients/services/update-patient.ts` | `removePlanId`, criação de customer Pagarme |

### Integrations / Stripe

| Arquivo | Papel |
|---|---|
| `src/modules/integrations/controllers/stripe-controller.ts` | Controller |
| `src/modules/integrations/routes/stripe.routes.ts` | Rotas autenticadas |
| `src/modules/integrations/routes/stripe-webhook.routes.ts` | Webhooks (raw body) |
| `src/modules/integrations/services/stripe/handle-webhook.ts` | Webhook Stripe US |
| `src/modules/integrations/services/stripe/handle-pt-webhook.ts` | Webhook Stripe PT |
| `src/modules/integrations/services/stripe/create-subscription.ts` | Cria subscription Stripe |
| `src/modules/integrations/services/stripe/create-checkout-session.ts` | Checkout Stripe |
| `src/modules/integrations/services/stripe/create-billing-portal-session.ts` | Portal de billing |
| `src/modules/integrations/services/stripe/create-transfers.ts` | Split para vendedores (Connect) |
| `src/modules/integrations/services/stripe/create-customer.ts` | Cria customer Stripe US/PT |
| `src/modules/integrations/services/stripe/create-connected-account.ts` | Connect accounts |
| `src/modules/integrations/services/stripe/create-account-link.ts` | Onboarding Connect |
| `src/modules/integrations/services/stripe/create-coupon.ts` | Cupons / promo codes |
| `src/modules/integrations/services/stripe/create-product.ts` | Produtos |
| `src/modules/integrations/services/stripe/create-payment-intent.ts` | Payment intents |
| `src/modules/integrations/services/stripe/create-payment-method.ts` | Payment methods |
| `src/modules/integrations/services/stripe/list-cards.ts` | Lista cartões salvos |
| `src/modules/integrations/utils/stripe-instance.ts` | Instâncias Stripe (US + PT) |

### Integrations / Pagarme

| Arquivo | Papel |
|---|---|
| `src/modules/integrations/controllers/pagarme-controller.ts` | Controller + webhook |
| `src/modules/integrations/services/pagarme/pagarme-webhook-service.ts` | Dispatcher de eventos |
| `src/modules/integrations/services/pagarme/create-pagarme-subscription-service.ts` | Assinatura recorrente |
| `src/modules/integrations/services/pagarme/create-pagarme-pix-order-service.ts` | Pedido PIX |
| `src/modules/integrations/services/pagarme/create-pagarme-card-order-service.ts` | Primeiro pagamento 6x |
| `src/modules/integrations/services/pagarme/cancel-pagarme-customer-subscriptions-service.ts` | Cancela assinaturas ativas |
| `src/modules/integrations/services/pagarme/create-pagarme-plan-service.ts` | Cria plano no Pagarme |
| `src/modules/integrations/services/pagarme/customer-info-pagarme-service.ts` | Consulta subscriptions |

---

## 5. Endpoints REST

> Prefixo global: `/v1` (definido em `src/shared/routes/index.ts`)

### Plans

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/v1/plans` | Não | Lista planos (query param `regions`) |
| `POST` | `/v1/plans` | Sim | Cria plano (local DB + Pagarme) |

### Patients / Assinatura

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/v1/patients/subscriptions` | Não | Cria assinatura Pagarme (cartão ou PIX) |
| `PATCH` | `/v1/patients/:patientId/plan` | Sim | Ativa plano manualmente (admin/parceiro) |
| `PATCH` | `/v1/patients/:patientId/remove-plan` | **Não** | Remove `planId` (seta null, sem cancelar no gateway) |
| `GET` | `/v1/patients/:patientId/info` | Sim | Info da assinatura Pagarme |
| `GET` | `/v1/patients/events` | Sim | SSE — status de pagamento em tempo real |

**Body de `POST /v1/patients/subscriptions`:**
```json
{
  "patientId": "uuid",
  "planId": "uuid",
  "paymentMethod": "credit_card | debit_card | pix",
  // PIX:
  "months": 1,
  "amount": 9900,
  // Cartão:
  "cardToken": "...",
  "address": { ... }
}
```

### Stripe (autenticadas)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/v1/integrations/stripe/cards/:customerId` | Sim | Lista cartões salvos |
| `POST` | `/v1/integrations/stripe/checkout-session` | Sim | Cria sessão de checkout (subscription) |
| `POST` | `/v1/integrations/stripe/subscription` | Sim | Cria subscription direta por cartão |
| `GET` | `/v1/integrations/stripe/billing-portal-session` | Sim | Portal Stripe (cancelar/gerenciar — apenas US) |
| `POST` | `/v1/integrations/stripe/account-link` | Sim | Link de onboarding Connect |

### Webhooks (sem autenticação JWT)

| Método | Rota | Gateway |
|---|---|---|
| `POST` | `/v1/integrations/stripe/webhook/` | Stripe US |
| `POST` | `/v1/integrations/stripe/webhook/pt` | Stripe PT |
| `POST` | `/v1/integrations/pagarme/webhook` | Pagarme |

### Pagarme Auxiliar

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/v1/integrations/pagarme/charges/:customerId` | Cobranças do customer |
| `POST` | `/v1/integrations/pagarme/customers` | Cria customer |
| `POST` | `/v1/integrations/pagarme/boleto` | Gera boleto |
| `GET` | `/v1/integrations/pagarme/events` | SSE |

### Upgrade / Downgrade / Cancelamento

| Operação | Suporte atual |
|---|---|
| **Upgrade** | Não há endpoint dedicado |
| **Downgrade** | Não há endpoint dedicado |
| **Cancelamento Pagarme** | Interno: `CancelPagarmeCustomerSubscriptionsService` (chamado antes de nova assinatura por cartão) |
| **Cancelamento Stripe** | Via Billing Portal (`GET /stripe/billing-portal-session`) — apenas Stripe US |
| **Remoção local** | `PATCH /patients/:patientId/remove-plan` — apenas limpa `planId`, não cancela no gateway |

---

## 6. Webhooks

### Stripe US — `POST /v1/integrations/stripe/webhook/`

**Arquivo:** `src/modules/integrations/services/stripe/handle-webhook.ts`
**Secret:** `STRIPE_ENDPOINT_SECRET`

| Evento | Tratado? | Lógica |
|---|---|---|
| `invoice.paid` | **Sim** | Atualiza `planId` + `planExpiresAt` + envia e-mail admin + split via Connect |
| `customer.subscription.created` | Não | — |
| `customer.subscription.deleted` | Não | — |
| `invoice.payment_failed` | Não | — |
| `checkout.session.completed` | Não | — |

**Fluxo interno ao receber `invoice.paid`:**
1. Valida assinatura com `stripe.webhooks.constructEvent`
2. Extrai `period.end`, `price.id` e `customer` de `invoice.lines.data[0]`
3. Chama `UpdatePatientPlanService` → atualiza `planId` (por `stripePriceId`) e `planExpiresAt`
4. Chama `CreateTransfers` → split para vendedor via Stripe Connect
5. Envia e-mail para `adm.hausey@gmail.com`

---

### Stripe PT — `POST /v1/integrations/stripe/webhook/pt`

**Arquivo:** `src/modules/integrations/services/stripe/handle-pt-webhook.ts`
**Secret:** `STRIPE_PT_ENDPOINT_SECRET`

Mesma lógica do webhook US, usando `stripePTInstance`.

---

### Pagarme — `POST /v1/integrations/pagarme/webhook`

**Arquivo:** `src/modules/integrations/services/pagarme/pagarme-webhook-service.ts`
**Serviço de atualização:** `src/modules/patients/services/update-subscription-by-webhook-service.ts`

| Evento | Tratado? |
|---|---|
| `order.paid` | **Sim** |
| `invoice.paid` | **Sim** |

**Fluxo interno:**
1. Extrai `charge = data.charges[0] || data.charge`
2. Se `charge.status === 'paid'`:
   - Busca `Patient` por `stripeCustomerId` (= Pagarme customer ID)
   - **PIX:** seta `planId = item.code`, `planExpiresAt = paid_at + item.quantity meses`
   - **Cartão/recorrente:** seta `planExpiresAt = data.cycle.end_at`
   - Se plano Nipomed específico → `CreateNipomedUserService`
3. Emite evento SSE `status-payment` para clientes conectados em `/pagarme/events`

---

## 7. Emails Relacionados a Assinaturas

Provedor: **Brevo** (`src/shared/utils/brevo.ts`) — variáveis `BREVO_API_KEY` + `EMAIL_USER`.

| Serviço | Destinatário | Assunto | Gatilho |
|---|---|---|---|
| `update-patient-plan.ts` | `adm.hausey@gmail.com` | "Nova Compra de Assinatura Efetuada!" | Webhook Stripe `invoice.paid` |
| `update-patient-plan-integration.ts` | `adm.hausey@gmail.com` | "Nova Assinatura Ativada por parceiro!" | Ativação manual via parceiro |
| `create-patient.ts` | admin + paciente | Cadastro + boas-vindas | Registro do paciente |

> Não existem e-mails de falha de pagamento, renovação próxima, downgrade ou cancelamento.

---

## 8. Variáveis de Ambiente

Declaradas em `src/@types/global.d.ts`:

```typescript
STRIPE_SECRET_KEY: string;
STRIPE_ENDPOINT_SECRET: string;
PAGARME_URL: string;
PAGARME_SECRET_KEY: string;
PAGARME_RECIPIENT_ID: string;
EMAIL_HOST: string;
EMAIL_PASS: string;
EMAIL_PORT: string;
EMAIL_USER: string;
```

Usadas no código mas **não** declaradas no `global.d.ts`:

| Variável | Onde é usada |
|---|---|
| `STRIPE_PT_SECRET_KEY` | `stripe-instance.ts` |
| `STRIPE_PT_ENDPOINT_SECRET` | `handle-pt-webhook.ts` |
| `BREVO_API_KEY` | `brevo.ts` |
| `NIPOMED_URL` | Integração Nipomed |
| `NIPOMED_TOKEN` | Integração Nipomed |

---

## 9. Fluxos por Região

### Brasil — Pagarme

```
Patient.region = 'br'

1. Frontend chama POST /v1/patients/subscriptions
2. Backend:
   a. Valida customer (stripeCustomerId = Pagarme customer ID)
   b. Verifica se não há assinatura vigente (planExpiresAt)
   c. Calcula split e descontos por sellerId
   d. Cancela assinaturas Pagarme ativas
   e. Se firstPayment = true  → CreatePagarmeCardOrderService (6x)
      Se firstPayment = false → CreatePagarmeSubscriptionService (recorrente)
   f. Atualiza patient: planId, planExpiresAt, firstPayment = false
3. Pagarme dispara webhook POST /v1/integrations/pagarme/webhook
4. Backend atualiza planExpiresAt (e planId para PIX)
5. SSE notifica o frontend
```

### PIX — Pagarme

```
1. Frontend chama POST /v1/patients/subscriptions com paymentMethod=pix
2. Backend cria pedido PIX no Pagarme com item.code = planId, item.quantity = meses
3. Pagarme dispara webhook order.paid após confirmação
4. Backend: planId = item.code, planExpiresAt = paid_at + meses
```

### EUA / Europa — Stripe US

```
Patient.region != 'pt'

1. Frontend chama POST /v1/integrations/stripe/checkout-session
2. Backend:
   a. Cria customer Stripe se necessário (stripeInstance US)
   b. Aplica stripePromoCodeId do seller se houver
   c. Pré-seta patient.planId antes do pagamento
   d. Retorna URL do Checkout Stripe
3. Stripe dispara webhook POST /v1/integrations/stripe/webhook/
4. Backend: UpdatePatientPlanService + CreateTransfers (split)
```

### Portugal — Stripe PT

```
Patient.region = 'pt'

Mesmo fluxo do US, mas usando stripePTInstance + STRIPE_PT_SECRET_KEY
Webhook separado: POST /v1/integrations/stripe/webhook/pt
```

---

## 11. Plano Familiar e Dependentes (Jun 2026)

### Novos campos em `plans`

| Campo TS | Coluna DB | Tipo | Descrição |
|---|---|---|---|
| `type` | `type` | varchar(20), default `'individual'` | `'individual'` ou `'family'` |
| `maxDependents` | `max_dependents` | int, default `0` | Limite de dependentes do plano familiar |

### Tabela `patient_dependents` — `src/modules/dependents/entities/patient-dependent.ts`

| Campo TS | Coluna DB | Tipo | Descrição |
|---|---|---|---|
| `holderId` | `holder_id` | uuid, FK patients CASCADE | Titular do plano |
| `dependentPatientId` | `dependent_patient_id` | uuid, FK patients SET NULL, nullable | Conta Patient do dependente |
| `hasAppAccess` | `has_app_access` | boolean | Tipo de acesso |
| `email` | `email` | varchar, nullable | Email para convite (com acesso ao app) |
| `inviteToken` | `invite_token` | varchar, nullable | Token de convite |
| `inviteExpiresAt` | `invite_expires_at` | timestamp, nullable | Expiração do convite |
| `status` | `status` | varchar(15) | `'pending'` \| `'active'` \| `'removed'` |

### Módulo `dependents` — `src/modules/dependents/`

| Serviço | Arquivo | Papel |
|---|---|---|
| `AddDependentService` | `services/add-dependent.ts` | Valida gating, cria dependente com ou sem app |
| `ListDependentsService` | `services/list-dependents.ts` | Lista dependentes do titular |
| `RemoveDependentService` | `services/remove-dependent.ts` | Remove vínculo e revoga plano do dependente |
| `AcceptInviteService` | `services/accept-invite.ts` | Aceita convite via token |
| `ResendInviteService` | `services/resend-invite.ts` | Reenvia email de convite |
| `GetHolderByDependentService` | `services/get-holder-by-dependent.ts` | Retorna titular e irmãos a partir do dependente |
| `SyncDependentsPlanService` | `services/sync-dependents-plan.ts` | Espelha planId/planExpiresAt do titular em todos os dependentes ativos |

### Endpoints `/v1/dependents`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/dependents` | Sim | Adicionar dependente |
| `GET` | `/dependents` | Sim | Listar dependentes do titular |
| `DELETE` | `/dependents/:id` | Sim | Remover dependente |
| `POST` | `/dependents/accept-invite` | **Não** | Aceitar convite (via token) |
| `POST` | `/dependents/:id/resend-invite` | Sim | Reenviar convite |
| `GET` | `/dependents/holder/:dependentPatientId` | Sim | Titular + irmãos por ID do dependente |

### Sincronização do plano titular → dependentes

`SyncDependentsPlanService` é chamado após cada atualização de plano do titular:

- `UpdatePatientPlanService` (Stripe US/PT — `invoice.paid`)
- `UpdateSubscriptionByWebhookService` (Pagarme — `order.paid` / `invoice.paid`)
- `UpdatePatientPlanPartnerService` (ativação por parceiro)
- `UpdatePatientService.removePlanId` (remoção de plano — revoga dependentes)

### Auth com `dependentsAccess`

O `POST /v1/sessions` para `role=patient` agora retorna:

```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>",
  "patient": { ... },
  "dependentsAccess": [
    {
      "dependentPatientId": "uuid",
      "name": "Nome do Dependente",
      "accessToken": "<jwt-do-dependente>",
      "refreshToken": "<jwt-do-dependente>"
    }
  ]
}
```

`dependentsAccess` só é populado para dependentes **sem acesso ao app** (`hasAppAccess=false`) e está ausente/vazio para titulares sem dependentes.

### Gating para adicionar dependente

Para adicionar dependente, o titular precisa ter:
1. `sellerId` não nulo (vinculado a empresa)
2. Assinatura ativa (`planId != null AND planExpiresAt > now()`)
3. Plano com `type='family'`
4. Número de dependentes ativos `< maxDependents` do plano

### Migrations geradas (não rodadas)

| Migration | Descrição |
|---|---|
| `1750291201000-MakePatientEmailNullable.ts` | `email` nullable em `patients` |
| `1750291202000-AddFamilyPlanFields.ts` | `type` + `max_dependents` em `plans` |
| `1750291203000-CreatePatientDependents.ts` | Cria tabela `patient_dependents` |

---

## 10. Lacunas e Pontos de Atenção

Itens identificados que **precisarão ser considerados** na implementação do plano familiar:

| # | Problema | Impacto no plano familiar |
|---|---|---|
| 1 | **Sem entidade `Subscription`** — estado só em `Patient`, sem histórico de pagamentos no DB | Dependentes não têm onde armazenar vínculo; precisa de tabela nova |
| 2 | **`stripeCustomerId` polimórfico** — usado para Stripe US/PT e Pagarme no mesmo campo | Ao criar dependentes, precisa de campo claro por gateway |
| 2b | **`stripePriceId` sem coluna de gateway** — distinção feita apenas pelo prefixo do valor (`price_` = Stripe, `plan_` = Pagarme) | Ao criar plano familiar, considerar verificação de prefixo ou adicionar coluna `gateway` |
| 3 | **Webhooks Stripe mínimos** — apenas `invoice.paid`; falhas e cancelamentos não atualizam o banco | Titular cancelado não reflete nos dependentes automaticamente |
| 4 | **Sem guard de assinatura ativa** — endpoints de consultas não bloqueiam por `planExpiresAt` | Dependente ativo poderia usar serviços mesmo com titular expirado |
| 5 | **`planId` sem validação de expiração** em `check-appointment-price.ts` | Desconto incorreto após expiração |
| 6 | **`PATCH /remove-plan` sem autenticação** | Qualquer um pode remover o plano de qualquer paciente |
| 7 | **Billing Portal apenas para Stripe US** | Cancelamento PT/Pagarme não tem fluxo self-service |
| 8 | **`create-subscription.ts` (Stripe)** — possível bug: chama `stripePTInstance` fora do bloco `if (country !== 'pt')`, podendo sobrescrever assinatura US | Testar antes de usar para o plano familiar |
| 9 | **Sem e-mails de falha/cancelamento** | Titular com pagamento falhado não avisa dependentes |

---

## Diagrama Resumido (ASCII)

```
┌──────────────────────────────────────────────────────────────────┐
│                          Patient                                  │
│  planId ──────────────────────────────────► Plan                 │
│  planExpiresAt  (validade)                   └── stripePriceId   │
│  stripeCustomerId (Stripe US/PT ou Pagarme)  └── price           │
│  firstPayment   (fluxo Pagarme cartão)        └── regions[]      │
│  sellerId ────────────────────────────────► User (vendedor)      │
│  region   (br | us | pt | ...)               └── recipientId     │
│  nipomed  (flag plano saúde)                                     │
└──────────────────────────────────────────────────────────────────┘

Assinatura ativa = planId != null AND planExpiresAt > now()

Webhooks que atualizam assinatura:
  Stripe US  → invoice.paid → UpdatePatientPlanService + CreateTransfers
  Stripe PT  → invoice.paid → (mesmo fluxo, stripePTInstance)
  Pagarme    → order.paid / invoice.paid → UpdateSubscriptionByWebhookService

Implementado (plano familiar — Jun 2026):
  ✓ Tabela patient_dependents (migration 1750291203000)
  ✓ Plan.type (individual|family) + Plan.maxDependents (migration 1750291202000)
  ✓ email nullable em patients (migration 1750291201000)
  ✓ Módulo src/modules/dependents/ com todos os serviços
  ✓ SyncDependentsPlanService integrado em todos os webhooks e remove-plan
  ✓ dependentsAccess no retorno do login do titular
  ✓ Auto-link de convites pendentes no cadastro (POST /patients)

Ainda pendente (fora do escopo desta implementação):
  ✗ Guard centralizado de assinante ativo (titular OU dependente)
  ✗ Lógica de upgrade/downgrade de plano (endpoint dedicado)
  ✗ Webhooks para cancelamento/falha de pagamento
```
