# Teste Eteg — Sistema de Cadastro de Clientes

Sistema fullstack para cadastro e gestão de clientes, com painel administrativo protegido por autenticação JWT. Desenvolvido como monorepo com NestJS, React e um pacote compartilhado de schemas de validação.

**Ambiente de produção:** [http://13.58.24.149](http://13.58.24.149)

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Pasta Docs](#pasta-docs)
- [Funcionalidades](#funcionalidades)
- [Endpoints da API](#endpoints-da-api)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Rodar](#como-rodar)
  - [Com Docker (recomendado)](#com-docker-recomendado)
  - [Sem Docker](#sem-docker)
- [Decisões Técnicas](#decisões-técnicas)

---

## Sobre o Projeto

O projeto nasceu do seguinte pedido de um cliente:

> *"Gostaria de uma tela onde eu possa cadastrar informações dos meus clientes: nome completo, CPF, e-mail, cor preferida e observações. O cliente precisa preencher o formulário uma única vez e saber se o cadastro foi bem-sucedido. O sistema vai ser hospedado via Docker em um serviço terceirizado."*

A partir desse briefing foi elaborado um PRD completo (disponível em [`Docs/Requisitos.md`](Docs/Requisitos.md)) definindo os requisitos funcionais, não funcionais, fluxos de interação e a stack técnica antes de qualquer linha de código.

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | NestJS 11, TypeScript |
| Banco de Dados | PostgreSQL 16 |
| ORM | Prisma 7 |
| Validação | Zod (compartilhado entre frontend e backend) |
| Autenticação | JWT via cookie `httpOnly` |
| Infra | Docker, Docker Compose, Nginx |
| Monorepo | pnpm workspaces, Turborepo |
| CI/CD | GitHub Actions, Amazon ECR, EC2 |

---

## Estrutura do Repositório

```
Teste-Eteg/
├── apps/
│   ├── api/                    # Backend NestJS (porta 3333)
│   │   ├── src/
│   │   │   ├── auth/           # Módulo de autenticação (JWT + Passport)
│   │   │   ├── customers/      # Módulo de clientes (CRUD)
│   │   │   ├── colors/         # Módulo de cores (CRUD)
│   │   │   ├── health/         # Health check endpoint
│   │   │   └── prisma/         # Módulo de acesso ao banco
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Modelos: Customer, Color, AdminUser
│   │   │   └── seed.ts         # Seed de cores padrão e usuário admin
│   │   └── Dockerfile          # Multi-stage: deps → build → runtime
│   │
│   └── web/                    # Frontend React/Vite (porta 5173 dev / 80 prod)
│       ├── src/
│       │   ├── pages/
│       │   │   ├── public/     # Formulário de cadastro (/)
│       │   │   └── admin/      # Login (/admin/login) e painel (/admin)
│       │   ├── components/
│       │   │   ├── ui/         # Componentes base (shadcn/ui + customizados)
│       │   │   ├── admin/      # CustomerCard, ColorsModal, StatPill
│       │   │   └── layout/     # PanelHeader, CenteredScreen
│       │   └── lib/            # Cliente HTTP (Axios com baseURL e cookies)
│       ├── nginx.conf           # Proxy reverso /api/ → backend
│       └── Dockerfile          # Multi-stage: build (Vite) → runner (Nginx)
│
├── packages/
│   └── shared/                 # Pacote interno compartilhado
│       └── src/
│           ├── schemas/        # Zod: customer, color, auth, common
│           └── lib/cpf.ts      # Validação matemática de CPF (dígitos verificadores)
│
├── Docs/                       # Especificação e referências visuais
├── docker-compose.yml          # Orquestra postgres + api + web
├── .env.example                # Template de variáveis de ambiente
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Pasta Docs

A pasta [`Docs/`](Docs/) contém os artefatos produzidos **antes** da implementação, registrando o pensamento inicial sobre o sistema:

| Arquivo | Descrição |
|---------|-----------|
| [`Requisitos.md`](Docs/Requisitos.md) | PRD completo: requisitos funcionais, não funcionais, endpoints, modelos de dados e fluxos de interação (Mermaid) |
| `Modelo.svg` | Wireframe das telas — referência visual usada para guiar o desenvolvimento do frontend |

Esses documentos vieram do contato inicial do projeto e servem de referência para qualquer equipe que der continuidade ao desenvolvimento.

---

## Funcionalidades

### Formulário Público (`/`)
- Cadastro de clientes com nome, CPF, e-mail, cor preferida e observações
- Validação em tempo real (Zod + React Hook Form) com destaque visual por campo
- Máscara automática de CPF com validação matemática dos dígitos verificadores
- Tela de confirmação após envio bem-sucedido (impede reenvio duplicado)
- Erros da API (CPF ou e-mail já cadastrado) exibidos via toast

### Painel Administrativo (`/admin`)
- Autenticação por e-mail e senha com JWT em cookie `httpOnly`
- Lista paginada de clientes com busca por nome, CPF ou e-mail
- Modal de detalhes com todas as informações do cadastro
- Gerenciamento de cores: color picker interativo, sugestão automática de nome, exclusão com confirmação
- Stats no topo: total de clientes, cores disponíveis e cadastros da semana

---

## Endpoints da API

### Clientes

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/customers` | Não | Cria um novo cadastro (público) |
| `GET` | `/customers` | JWT | Lista clientes (`?search=`, `?page=`, `?limit=`) |
| `GET` | `/customers/:id` | JWT | Detalhes de um cliente |

### Cores

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/colors` | Não | Lista cores disponíveis |
| `POST` | `/colors` | JWT | Cadastra uma nova cor |
| `DELETE` | `/colors/:id` | JWT | Remove cor (retorna `409` se houver clientes vinculados) |

### Autenticação

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/auth/login` | Não | Autentica e retorna JWT em cookie `httpOnly` |
| `POST` | `/auth/logout` | JWT | Encerra sessão e limpa o cookie |

### Sistema

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Liveness check — usado pelo Docker para monitorar os containers |

---

## Variáveis de Ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

| Variável | Descrição |
|----------|-----------|
| `POSTGRES_USER` | Usuário do banco de dados |
| `POSTGRES_PASSWORD` | Senha do banco de dados |
| `POSTGRES_DB` | Nome do banco de dados |
| `JWT_SECRET` | Chave secreta para assinar os tokens JWT (use uma string longa e aleatória) |
| `JWT_EXPIRES_IN` | Tempo de expiração do token (ex.: `8h`) |
| `ADMIN_EMAIL` | E-mail do administrador criado automaticamente pelo seed |
| `ADMIN_PASSWORD` | Senha do administrador criado automaticamente pelo seed |
| `CORS_ORIGIN` | Origem permitida pelo CORS (ex.: `http://localhost`) |

---

## Como Rodar

### Com Docker (recomendado)

Pré-requisitos: [Docker](https://docs.docker.com/get-docker/) e Docker Compose.

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd Teste-Eteg

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seus valores

# 3. Suba todos os serviços
docker compose up --build
```

O Docker Compose sobe três serviços em ordem:

1. **postgres** — banco de dados PostgreSQL
2. **api** — backend NestJS (executa migrations e seed automaticamente na primeira inicialização)
3. **web** — frontend React servido pelo Nginx, que faz proxy de `/api/` para o backend

| Serviço | URL |
|---------|-----|
| Frontend | [http://localhost](http://localhost) |
| API | [http://localhost:3333](http://localhost:3333) |
| Health | [http://localhost:3333/health](http://localhost:3333/health) |

Para reconstruir um serviço específico sem derrubar os outros:

```bash
docker compose up --build web   # só o frontend
docker compose up --build api   # só o backend
```

---

### Sem Docker

Pré-requisitos: [Node.js 22+](https://nodejs.org/), [pnpm 11+](https://pnpm.io/) e PostgreSQL rodando localmente.

```bash
# 1. Clone e instale as dependências
git clone <url-do-repositorio>
cd Teste-Eteg
pnpm install

# 2. Configure as variáveis de ambiente
cp .env.example .env

# 3. Build do pacote compartilhado
pnpm --filter @teste-eteg/shared run build

# 4. Execute as migrations e o seed
pnpm --filter @teste-eteg/api exec prisma migrate deploy
pnpm --filter @teste-eteg/api exec prisma db seed

# 5. Inicie os serviços em modo desenvolvimento
pnpm dev
```

Ou em terminais separados:

```bash
# Terminal 1 — Backend (http://localhost:3333)
pnpm --filter @teste-eteg/api run dev

# Terminal 2 — Frontend (http://localhost:5173)
pnpm --filter @teste-eteg/web run dev
```

> Em desenvolvimento o frontend acessa a API diretamente em `localhost:3333`. Em produção o Nginx faz o proxy internamente.

---

## Decisões Técnicas

### Monorepo com pnpm workspaces + Turborepo

Frontend, backend e o pacote shared coexistem no mesmo repositório. O Turborepo garante a ordem correta dos builds — o `shared` é compilado primeiro, depois `api` e `web` em paralelo — e aproveita cache entre execuções para evitar rebuilds desnecessários.

### Pacote `shared` com schemas Zod

Os schemas de validação vivem em `packages/shared` e são importados tanto pelo backend quanto pelo frontend. Isso cria uma única fonte de verdade: o mesmo schema que valida um campo no formulário React valida o body da requisição no NestJS. Divergências de validação entre as duas camadas se tornam impossíveis.

### JWT em cookie `httpOnly`

O token de autenticação é armazenado em um cookie `httpOnly`, inacessível via `document.cookie` ou `localStorage`. Isso elimina a classe inteira de ataques XSS que roubam tokens de autenticação. O cookie é enviado automaticamente pelo navegador em cada requisição protegida.

### Validação matemática de CPF

A validação em `packages/shared/src/lib/cpf.ts` implementa o algoritmo real de dígitos verificadores. Um CPF como `111.111.111-11` passa na validação de formato mas falha na validação matemática — e é rejeitado corretamente pelo sistema.

### Nginx como reverse proxy

Em produção, o React é uma SPA estática servida pelo Nginx. O mesmo servidor faz proxy de `/api/` para o backend na porta 3333. Com isso, frontend e API respondem na mesma origem, eliminando a necessidade de configuração de CORS em produção.

### Docker multi-stage builds

Os Dockerfiles separam build e runtime em múltiplos estágios:

- **API:** `deps` (instala tudo) → `build` (compila TS, gera cliente Prisma, executa `pnpm deploy --legacy` para isolar dependências de produção) → `runtime` (apenas o necessário para rodar)
- **Web:** `build` (compila com Vite) → `runner` (Nginx com os arquivos estáticos)

O resultado são imagens enxutas sem código-fonte, devDependencies ou ferramentas de build no container final.

### Rate limiting com `@nestjs/throttler`

O ThrottlerModule aplica dois níveis de proteção:

- **Global:** 100 requisições por minuto por IP em todas as rotas
- **Login:** 5 requisições por minuto no `POST /auth/login`, protegendo contra ataques de força bruta

### CI/CD com GitHub Actions + Amazon ECR

O pipeline automatiza o ciclo completo:

1. Push na branch `main` (ou trigger manual) aciona o workflow
2. As imagens Docker são construídas e publicadas no Amazon ECR
3. A instância EC2 faz pull das novas imagens e reinicia os serviços via SSH

Qualquer merge na `main` chega ao ambiente de produção sem intervenção manual.
