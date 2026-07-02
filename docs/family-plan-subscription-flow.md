# Fluxo de Assinatura de Plano Familiar

> **Repos:** `hausey-api` (backend) + `hausey-web` (frontend)
> **Branch:** `feat-family-plan-subscription-flow` (em ambos)
> **Data:** Jul 2, 2026

Este documento descreve o fluxo de assinatura de plano familiar ponta-a-ponta,
o que já existia antes deste trabalho, o que foi adicionado, e como testar.

---

## 1. Visão geral do fluxo

```
1. Seleção do plano  ──►  2. Pagamento (por região)  ──►  3. Confirmação  ──►  Gestão de dependentes
   (Individual /            BR  → Pagar.me (cartão/PIX)      webhook do          (menu lateral
    Familiar 1 /            !BR → Stripe Checkout hospedado   gateway atualiza     "Dependentes",
    Familiar 2)                                               isPro/planExpiresAt   já existente)
```

- **Seleção**: `PatientPlanModal` lista os planos da região do paciente
  (`GET /v1/plans?regions={region}`), destacando planos familiares e seus
  limites de dependentes.
- **Pagamento por região** (gateway escolhido no front pela `region` do paciente):
  - `region === 'br'` (ou nula) → **Pagar.me**: página `/checkout` com cartão
    tokenizado direto na Pagar.me ou PIX (`POST /v1/patients/subscriptions`).
  - `region !== 'br'` (`pt`, `us`, internacional) → **Stripe Checkout hospedado**:
    o front chama `POST /v1/integrations/stripe/checkout-session` e redireciona o
    navegador para a `url` da sessão retornada. O backend seleciona a instância
    Stripe PT vs US internamente pela `region`.
- **Confirmação**: o webhook do gateway (`invoice.paid` Stripe / `order.paid`
  Pagar.me) atualiza `planId`, `isPro` e `planExpiresAt` do paciente e
  propaga aos dependentes via `SyncDependentsPlanService`.
- **Gestão de dependentes**: após ativo, o menu do paciente exibe "Dependentes"
  (`/patient/dependents`) para planos familiares — tela já existente.

---

## 2. Tipos de plano

Não existem tipos `family_1`/`family_2` no schema. `Plan.type` é apenas
`'individual' | 'family'`. Os planos "Familiar 1" e "Familiar 2" são **dois
registros `Plan` com `type='family'`** que diferem em `maxDependents` e `price`:

| Plano | `type` | `maxDependents` | `isPro` | Observação |
|---|---|---|---|---|
| Individual | `individual` | 0 | conforme plano | planos atuais |
| Familiar 1 | `family` | 3 | `true` | novo (seed) |
| Familiar 2 | `family` | 5 | `true` | novo (seed) |

> **Pré-requisito de negócio:** para **adicionar dependentes**, o titular precisa
> ter `sellerId` (conta vinculada a uma empresa), plano `family` ativo e estar
> abaixo do `maxDependents`. Sem `sellerId`, `AddDependentService` recusa. O front
> comunica isso nos cards de plano familiar.

---

## 3. O que já existia vs. o que foi adicionado

### Já existia (não reimplementado)
- **Backend:** módulo `src/modules/dependents/` completo; `Plan.type`,
  `maxDependents`, `isPro`; `SyncDependentsPlanService` nos webhooks;
  `POST /v1/integrations/stripe/checkout-session` (Checkout hospedado,
  seleção PT/US por região); `POST /v1/patients/subscriptions` (Pagar.me).
- **Frontend:** `PatientPlanModal` (seleção + badges familiares +
  `familyDependentsLabel`), `/checkout` (Pagar.me), `/patient/dependents`
  (gestão), `src/API/dependents.ts`, `src/utils/plan.ts`.

### Adicionado neste trabalho
- **Backend (`hausey-api`):**
  - `scripts/seed-family-plans.ts` + npm script `seed:family-plans` — cria os dois
    planos familiares para teste local (sem `stripePriceId`).
  - `successUrl`/`cancelUrl` **opcionais** no `checkout-session` do Stripe
    (schema + controller + service), com fallback aos valores atuais
    (`https://hausey.com.br/app`). Retrocompatível.
- **Frontend (`hausey-web`):**
  - `src/API/stripe-checkout.ts` — wrapper de `POST /integrations/stripe/checkout-session`.
  - `src/pages/checkout.tsx` — **ramificação por região**: `br` mantém Pagar.me;
    internacional redireciona para o Stripe Checkout hospedado. Resumo em
    R$/6x ocultado para internacionais (moeda/valor aparecem no Stripe). Guard
    por `ref` evita criação duplicada de sessão.
  - `src/components/patient/PatientPlanModal.tsx` — nota de limite de dependentes
    e pré-requisito de empresa nos cards familiares.

---

## 4. Como rodar o seed de planos familiares

Requer Postgres local ativo e migrations aplicadas.

```bash
yarn dev:docker          # sobe o Postgres local (se ainda não estiver)
yarn migration:run       # garante o schema atualizado
yarn seed:family-plans   # cria "Plano Familiar 1" e "Plano Familiar 2"
```

O script é **idempotente**: se um plano com o mesmo `name` já existe, ele é
pulado (log `[skip]`). Regiões criadas: `br` e `pt`.

Verifique:
```bash
curl 'http://localhost:8080/v1/plans?regions=br'
curl 'http://localhost:8080/v1/plans?regions=pt'
# devem incluir os dois planos type=family (maxDependents 3 e 5)
```

---

## 5. Como testar ponta-a-ponta

### 5.1 Brasil (Pagar.me) — regressão + familiar
1. Paciente com `region='br'` e `sellerId` definido.
2. Abrir o modal de planos → ver Individual / Familiar 1 / Familiar 2 com badges
   e limites de dependentes.
3. Selecionar Familiar 1 → `/checkout` renderiza o formulário Pagar.me
   (cartão/PIX) — **inalterado**.
4. Concluir com cartão/PIX de teste → redireciona a `/patient`.
5. Menu "Dependentes" visível → adicionar dependente respeita o limite (3).
6. Paciente **individual** continua sem o item "Dependentes" (regressão OK).

### 5.2 Internacional (Stripe)
1. Paciente com `region='pt'` (ou `us`).
2. Selecionar plano familiar → `/checkout` **não** mostra o formulário Pagar.me;
   mostra o estado de redirecionamento e o botão "Ir para o pagamento seguro".
3. Ao acionar, o front chama `POST /v1/integrations/stripe/checkout-session` com
   `{ patientId, priceId, successUrl: <origin>/patient, cancelUrl: <checkout> }`
   e redireciona para `session.url`.
   - **Limitação em teste local:** os planos do seed não têm `stripePriceId`, então
     o Stripe recusa a criação da sessão de subscription. Para exercitar o
     pagamento real, cadastre um `stripePriceId` válido no plano. Sem isso, valide
     a **ramificação de gateway e a chamada** (a requisição sai e o erro do Stripe
     é exibido) — a lógica do front está correta independentemente do priceId.

### 5.3 Limites / pré-requisitos
- Confirmar a nota de limite nos cards familiares.
- Paciente **sem `sellerId`** recebe a mensagem de recusa do backend ao tentar
  adicionar dependente.

### 5.4 Verificações estáticas
```bash
# backend
yarn build                         # tsc OK
npx eslint 'src/**'                # sem novos erros
# frontend (../hausey-web)
npx tsc --noEmit                   # OK
npx eslint src/pages/checkout.tsx src/API/stripe-checkout.ts \
  src/components/patient/PatientPlanModal.tsx
```

---

## 6. Notas e pendências conhecidas

- **`stripePriceId` obrigatório para pagamento Stripe real.** O seed cria planos
  sem priceId (foco em teste local do fluxo BR e da ramificação). Para produção
  internacional, criar Products/Prices no Stripe (US e PT) e preencher
  `stripePriceId`.
- **Redirect pós-assinatura permanece `/patient`** (decisão de produto). O acesso
  a dependentes vem pelo menu lateral, que já aparece para planos familiares.
- **`isPro` vs `planExpiresAt`:** `create-checkout-session` seta `isPro` mas
  `planExpiresAt` só é definido no webhook `invoice.paid`. Entre o checkout e o
  webhook, `isPatientPlanActive` retorna `false` — comportamento herdado, fora do
  escopo deste trabalho.
