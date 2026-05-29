# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --config.package-import-method=copy

FROM node:22-alpine AS build
WORKDIR /app

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm --filter @teste-eteg/shared run build
RUN pnpm --filter @teste-eteg/api exec prisma generate
RUN pnpm --filter @teste-eteg/api run build

FROM node:22-alpine AS runtime
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/node_modules                  ./node_modules
COPY --from=build /app/apps/api/dist                 ./apps/api/dist
COPY --from=build /app/apps/api/node_modules         ./apps/api/node_modules
COPY --from=build /app/apps/api/prisma               ./apps/api/prisma
COPY --from=build /app/apps/api/prisma.config.ts     ./apps/api/prisma.config.ts
COPY --from=build /app/apps/api/package.json         ./apps/api/package.json
COPY --from=build /app/packages/shared/package.json  ./packages/shared/package.json
COPY --from=build /app/packages/shared/dist          ./packages/shared/dist
COPY --from=build /app/packages/shared/node_modules  ./packages/shared/node_modules
COPY --from=build /app/apps/api/src/generated        ./apps/api/src/generated

USER appuser

EXPOSE 3333

WORKDIR /app/apps/api

CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && ./node_modules/.bin/tsx prisma/seed.ts && node dist/main"]
