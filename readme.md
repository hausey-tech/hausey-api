# Hausey API

Node.js RESTful API

## Lógica atual de assinatura

### Quando usuário escolhe a região BR no app:
- O "customer" é criado na Pagarme e setado no banco
- Na tela de planos, é redirecionado para o página checkout do WEB com as opções de pagamento
- Caso opte por assinatura mensal, é criada uma assinatura na Pagarme
- Caso opte por pagamento com pix, é criado um pedido na Pagarme
- O checkout chama o endpoint que cria pedido, passando o customerId
- Através dele, o usuário é encontrado no banco e é verificado se possui vínculo com vendedores
- Se possuir, a regra de split é feita e enviada no endpoint que envia os dados de pagamento
- Após isso, a api recebe que o pagamento foi realizado pelo webhook e atualiza o "expiresAt" no banco

### Quando usuário escolhe a região US ou EU no app:
- É criado o usuário na Stripe e seu id é salvo no banco
- Na tela de planos, é redirecionado ao checkout da própria Stripe para preencher os dados de pagamento
- Ao realizar o pagamento, a api recebe a informação por webhook, atualiza o "expiresAt" no banco e depois verifica se há vendedores vinculados para criar as tranferências (split)

### Representantes (vendedores)
- São cadastrados através do portal admin
- Ao informar a região BR, o admin informa os dados bancários do vendedor e essas informações são enviadas à Pagarme para criar o "recipient" e o "recipientId" é setado no banco
- Caso a região seja US ou EU, a conta conectada é criada na Stripe com as informações básicas e no segundo passo, um link é gerado para que o admin acesse a própria Stripe para informar os dados faltantes

## Installation

Use o [yarn](https://yarnpkg.com/) para instalar os pacotes:

```bash
yarn
```

## Usage

Caso esteja usando o arquivo .env de desenvolvimento, é necessário rodar um banco Postgres localmente, preferencialmente no Docker. Verificar os dados de acesso ao banco e, se necessário, alterar no .env.

- Para facilitar, os arquivos .env foram upados na aba "Downloads" neste repositório.

Para rodar as migrations no banco local:

```bash
yarn migration:run
```

Para criar a migration:

```bash
yarn name='nome-da-migration' yarn migration:generate
```

Por fim, para iniciar o servidor:

```bash
yarn dev:server
```

## Deploy

O repositório está conectado à AWS, quando ocorre atualização na branch "develop" o deploy é realizado automaticamente e em alguns minutos a nova versão estará online na [api de teste](http://ec2-44-201-98-152.compute-1.amazonaws.com:8080/v1/health-check).

Quando a atualização é na branch "master", é necessário ir ao CodePipeline na AWS para "Lançar alteração" na [api de produção](https://api.hausey.net/v1/health-check/). Isso também pode ser automático, basta editar a etapa "Source" do pipeline e marcar a opção para iniciar na alteração do código-fonte.

## License

[MIT](https://choosealicense.com/licenses/mit/)
