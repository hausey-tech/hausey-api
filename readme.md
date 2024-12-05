# Hausey API

Node.js RESTful API

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
