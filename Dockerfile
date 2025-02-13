FROM node:20-alpine3.20 AS base

# Install dependencies only when needed
FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json client/package-lock.json ./client/

#RUN yarn --frozen-lockfile
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY . .

RUN npm run postinstall
RUN npm run build

# Production image; runtime
FROM base AS runner

RUN addgroup --system --gid 1001 www
RUN adduser --no-create-home --system --uid 1001 --ingroup www www

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/build ./client/build
COPY package.json package-lock.json .npmrc ./
COPY prisma/ ./prisma/
RUN chown -R www:www ./

ENV NODE_ENV production

EXPOSE 8080

USER www:www

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]
