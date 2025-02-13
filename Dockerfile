FROM node:20-alpine3.20 AS base

FROM base AS builder

WORKDIR /app

COPY . .

#RUN yarn --frozen-lockfile
RUN npm ci

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

ENV NODE_ENV=production

EXPOSE 8080

USER www:www

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]
