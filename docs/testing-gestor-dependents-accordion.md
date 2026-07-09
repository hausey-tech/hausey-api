# Como testar: accordion de dependentes no dashboard do gestor

## Contexto

O front-end já tem a feature implementada no commit
[`8901ce0`](../../hausey-web) (`:sparkles: feat: accordeon dependents`), que adiciona um
accordion na tabela `EnhancedTableUsers` (`src/pages/comercial/components/table-dash.tsx`
no repo `hausey-web`): ao clicar na seta ao lado de uma linha de titular, a linha expande
mostrando um painel (`DependentsPanel`) com nome, e-mail e status dos dependentes daquele
titular.

O backend não tinha rota para isso — o arquivo `src/API/dependents-admin.ts` do front já
existia com um `TODO(backend)` explícito apontando um path placeholder
(`/dependents/admin/:holderId`). A rota nova implementada aqui **usa exatamente esse path**,
para não exigir nenhuma mudança no front.

## O que foi implementado no backend

```
GET /v1/dependents/admin/:holderId
Authorization: Bearer <token>
```

- **Autorização**: qualquer usuário autenticado pode chamar — sem checagem de role. Não
  existe hoje nenhum mecanismo de restrição por role no backend (decisão explícita, ver
  "Observações" abaixo).
- **Resposta (200)**: array de dependentes do titular informado. Formato compatível com o
  tipo `IPatientDependent` usado pelo front (`hausey-web/src/types/dependent.ts`):
  ```json
  [
    {
      "id": "uuid",
      "holderId": "uuid",
      "dependentPatientId": "uuid | null",
      "dependentPatient": { "id": "...", "name": "...", "email": "...", ... } | null,
      "hasAppAccess": true,
      "name": "string | null",
      "birthdate": "string | null",
      "cpf": "string | null",
      "email": "string | null",
      "status": "pending | active | removed",
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  ]
  ```
  `inviteToken` e `inviteExpiresAt` **não** são retornados — são segredos do fluxo de
  aceite de convite e foram propositalmente omitidos por segurança.
- **404**: se `holderId` não corresponder a nenhum paciente (`{"message": "Titular não encontrado."}`).
- **400**: se `holderId` não for um UUID válido (validação Joi/celebrate).

Arquivos alterados/criados no backend: `contracts/dtos/list-dependents-by-holder-dto.ts`,
`services/list-dependents-by-holder.ts`, `celebrate-schemas/dependents.ts`,
`controllers/dependents.ts`, `routes/dependents.ts` (todos em `src/modules/dependents/`).

## Como o front-end consome isso (commit 8901ce0)

- `src/API/dependents-admin.ts` (`hausey-web`) — função `listDependentsForHolder(accessToken, holderId)`
  faz `GET /dependents/admin/${holderId}` com `Authorization: Bearer ${accessToken}`.
- `table-dash.tsx` — `EnhancedTableUsers` recebe uma nova prop `accessToken`. Cada linha da
  tabela tem um botão de expandir (ícone chevron da `lucide-react`). Ao clicar:
  - Se a linha já está expandida, apenas recolhe (`toggleExpand`).
  - Senão, expande e, se ainda não tiver dados em cache (`dependentsCache`), dispara
    `listDependentsForHolder`, controlando estados de `loading` e `error` por linha.
  - Renderiza `DependentsPanel`: mostra "Plano Familiar" (se `isFamilyPlan(row.plan)`),
    uma tabela com Nome/E-mail/Status por dependente, filtrando dependentes com
    `status === 'removed'` (não exibidos), com badge verde para `active` e amarelo para
    `pending` (dependentes sem status ativo/pendente, ex. algo inesperado, não mostram badge).
  - Estados tratados na UI: "Carregando dependentes...", "Erro ao carregar dependentes.",
    "Nenhum dependente cadastrado." (lista vazia).
- **Onde a prop `accessToken` é passada**: `dashboard.tsx` (comercial) e
  `admin/representants/[id]/detailsbusiness.tsx`, ambos passam
  `accessToken={loggedUser?.accessToken}` para `EnhancedTableUsers`. Ou seja, o accordion
  só funciona quando `EnhancedTableUsers` é renderizado a partir dessas duas telas.
- **Quando o botão de expandir aparece**: só quando `showPatientColumns` é `true`, isto é
  quando `business` é `'Empresa'`, `'Afiliados'`, `'TotalPatientsPerCode'`, ou quando as
  linhas já parecem ser de pacientes (`isPatientRows`). Em outras views (ex. lista de
  representantes/sellers) a coluna do chevron aparece vazia e não é clicável.

## Pré-requisitos para o teste

1. Backend local rodando: `yarn dev:docker` (Postgres) + `yarn dev:server` (`hausey-api`).
2. Front-end local rodando a partir do commit `8901ce0` (ou branch/commit posterior que o
   inclua) em `hausey-web`, apontando para a API local.
3. Usuário gestor de teste: `gestor.teste@email.com`, role atualizada para **`admin`** no
   banco (antes era `comercial`) — feito especificamente para viabilizar este teste.
   - **Importante**: como a role mudou no banco, é necessário **fazer logout e login
     novamente** no front com esse usuário para obter uma sessão/token atualizados.
4. Um titular de plano familiar com pelo menos um dependente cadastrado, para ver o
   accordion populado de verdade. `teste2@email.com` (patient id
   `4c5c850d-b992-4cdc-9d83-03449a7d3e85`) foi usado nesta sessão apenas para validar a
   rota via curl com um dado de teste temporário (inserido e removido em seguida) — ele
   **não tem dependentes reais cadastrados agora**. Para o teste end-to-end no front, é
   necessário:
   - cadastrar um dependente de verdade pelo fluxo normal do app (o titular loga e usa
     `POST /v1/dependents`), ou
   - pedir para inserir um dado de teste temporário novamente no banco local.

## Passo a passo sugerido

1. **Login como gestor**: acesse o front-end com `gestor.teste@email.com` (login novo,
   para garantir token atualizado).
2. **Ir para uma tela que renderiza `EnhancedTableUsers`**: dashboard comercial
   (`/comercial/dashboard`, com `business` = `"Empresa"` ou `"TotalPatientsPerCode"`) ou
   a tela de detalhes de um representante em `/admin/representants/[id]` (aba com
   `business` em `["Afiliados", "Empresa", "Ativos", "Sem plano", "Expirados", "TotalPatientsPerCode", ...]`).
3. **Localizar a linha de um titular de plano familiar com dependentes**.
4. **Clicar no ícone de seta (chevron)** à esquerda da linha — isso deve:
   - Expandir a linha mostrando o `DependentsPanel`.
   - Disparar `GET /v1/dependents/admin/<holderId>` (confirmar na aba Network do
     DevTools que o `holderId` usado é o `id` do titular clicado, não o id do gestor).
   - Mostrar "Carregando dependentes..." brevemente, depois a tabela populada.
5. **Validar conteúdo**: nome do dependente (via `dependentPatient?.name`), e-mail, e
   badge de status (`Ativo` verde para `active`, `Convite pendente` amarelo para
   `pending`; dependentes com `status: 'removed'` não devem aparecer na lista).
6. **Clicar de novo no chevron** — a linha deve recolher sem nova chamada de API (dado já
   em cache local do componente).
7. **Casos de borda**:
   - Titular sem dependentes → expande mostrando "Nenhum dependente cadastrado."
   - Erro de rede/API (ex. desligar o backend temporariamente e tentar expandir uma linha
     ainda não expandida) → deve mostrar "Erro ao carregar dependentes." sem quebrar a UI.
   - Trocar o texto de busca (`search`) na tabela → todo o estado de expansão/cache é
     resetado (`useEffect` que depende de `search`).

## Teste rápido via curl (sem depender do front)

```bash
curl -s "http://localhost:5000/v1/dependents/admin/<holderId>" \
  -H "Authorization: Bearer <token_do_gestor>"
```

Validado nesta sessão com um dependente de teste temporário para `teste2@email.com`:
200 com o dependente (sem `inviteToken`), 404 para holder inexistente, 400 para UUID
inválido no `holderId`.

## Observações

- A restrição "somente gestor/admin" **não está implementada no backend** — decisão
  explícita de não adicionar agora, já que não existe nenhum mecanismo de checagem de
  role no projeto hoje (nenhuma rota do backend faz isso). Ou seja, tecnicamente qualquer
  usuário autenticado (paciente, profissional, gestor) consegue chamar essa rota e ver
  dependentes de qualquer titular, bastando saber o `holderId`. Se isso for um requisito
  de segurança para produção, precisamos revisitar e implementar um middleware de
  autorização por role antes do release dessa feature.
