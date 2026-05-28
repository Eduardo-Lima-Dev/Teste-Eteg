# Teste ETEG — Sistema de Cadastro de Clientes

Aplicação fullstack para cadastro de clientes com painel administrativo.

## Stack

| Camada   | Tecnologia                            |
| -------- | ------------------------------------- |
| Monorepo | pnpm workspaces + Turborepo           |
| Backend  | NestJS + TypeScript + Prisma          |
| Banco    | PostgreSQL                            |
| Schemas  | Zod (compartilhado entre front/back)  |
| Auth     | JWT em cookie httpOnly                |
| Frontend | Vite + React + TypeScript + shadcn/ui |
| Infra    | Docker + Docker Compose               |

## Estrutura

```text
Teste-Eteg/
├── apps/
│   ├── api/        # Backend NestJS (porta 3333)
│   └── web/        # Frontend React/Vite (porta 5173)
├── packages/
│   └── shared/     # Schemas Zod e tipos compartilhados
├── docker-compose.yml
└── Docs/
    └── Teste ETEG.yaml  # Coleção Insomnia para testar a API
```

## Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [pnpm 11+](https://pnpm.io/installation)
- [Docker + Docker Compose](https://docs.docker.com/get-docker/)

Verificar versões:

```bash
node --version   # >= 20
pnpm --version   # >= 11
docker --version
```

---

## Rodar com Docker (recomendado)

Sobe banco, backend e frontend com um único comando.

### 1. Clone o repositório

```bash
git clone <url-do-repo>
cd Teste-Eteg
```

### 2. Configure as variáveis de ambiente

```bash
cp apps/api/.env.example apps/api/.env
```

Edite `apps/api/.env` e preencha os campos obrigatórios:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eteg?schema=public"
JWT_SECRET="escolha-uma-chave-secreta-longa"
JWT_EXPIRES_IN="8h"
CORS_ORIGIN="http://localhost:8080"
PORT=3333
ADMIN_EMAIL="admin@eteg.com.br"
ADMIN_PASSWORD="suasenha"
```

### 3. Suba os containers

```bash
docker compose up --build
```

### 4. Acesse

| Serviço  | URL                                  |
| -------- | ------------------------------------ |
| Frontend | <http://localhost:8080>              |
| API      | <http://localhost:3333>              |
| Health   | <http://localhost:3333/health>       |

> O seed (cores do arco-íris + admin) roda automaticamente na primeira inicialização.

---

## Rodar localmente (sem Docker)

### 1. Clone e instale dependências

```bash
git clone <url-do-repo>
cd Teste-Eteg
pnpm install
```

### 2. Suba o PostgreSQL

Via Docker (só o banco):

```bash
docker run -d \
  --name eteg-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=eteg \
  -p 5432:5432 \
  postgres:16-alpine
```

Ou use uma instância local do PostgreSQL na porta 5432.

### 3. Configure o backend

```bash
cp apps/api/.env.example apps/api/.env
```

Edite `apps/api/.env`:

```env
DATABASE_URL="postgresql"
JWT_SECRET="escolha-uma-chave-secreta-longa"
JWT_EXPIRES_IN="8h"
CORS_ORIGIN="http://localhost:5173"
PORT=3333
ADMIN_EMAIL=""
ADMIN_PASSWORD=""
```

### 4. Prepare o banco

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev
npx prisma db seed
cd ../..
```

### 5. Build do pacote compartilhado

```bash
pnpm --filter @teste-eteg/shared build
```

### 6. Inicie os servidores

Em terminais separados:

```bash
# Terminal 1 — Backend
cd apps/api
pnpm run dev
```

```bash
# Terminal 2 — Frontend
cd apps/web
pnpm run dev
```

Ou da raiz com Turborepo (inicia tudo junto):

```bash
pnpm dev
```

URLs em desenvolvimento:

| Serviço  | URL                     |
| -------- | ----------------------- |
| Frontend | <http://localhost:5173> |
| API      | <http://localhost:3333> |

---

## Credenciais do admin

| Campo  | Valor                                  |
| ------ | -------------------------------------- |
| E-mail | Definido em `ADMIN_EMAIL` no `.env`    |
| Senha  | Definido em `ADMIN_PASSWORD` no `.env` |

---

## Testando a API

Importe o arquivo `Docs/Teste ETEG.yaml` no [Insomnia](https://insomnia.rest/):

`Application → Import → From File` → selecione `Docs/Teste ETEG.yaml`

O ambiente já vem configurado com `base_url: http://localhost:3333`. O cookie JWT é salvo automaticamente após o login.

Fluxo básico:

1. `POST /auth/login` — autentica e seta o cookie
2. `GET /colors` — lista as cores disponíveis
3. `POST /customers` — cadastra um cliente (público)
4. `GET /customers` — lista cadastros (requer auth)
5. `POST /auth/logout` — encerra a sessão

---

## Decisões de arquitetura

- **Schemas Zod em `packages/shared`** — validação única compartilhada entre backend (NestJS via `nestjs-zod`) e frontend (`react-hook-form` + `zodResolver`). Mudanças nas regras de validação são feitas em um único lugar.

- **Escopo seguido:** implementação baseada no `Docs/Requisitos.md`. A coleção Insomnia contém rotas extras (`PUT /customers`, `DELETE /customers`) que não fazem parte do PRD e não foram implementadas.

- **Cookie httpOnly para JWT** — o token não é acessível via JavaScript, protegendo contra XSS. Requer `credentials: true` no CORS e `withCredentials: true` nas requisições do frontend.

- **Prisma 7 com adapter** — o Prisma 7 exige um adapter explícito (`@prisma/adapter-pg`) para conexão com o banco, diferente de versões anteriores que liam a `DATABASE_URL` diretamente.
