FROM node:12-alpine AS base

FROM base AS builder

RUN apk add --no-cache git # for npm fetching Methone from GitHub

WORKDIR /app

COPY . .

#RUN yarn --frozen-lockfile
RUN npm ci

ARG REACT_APP_RECAPTCHA_PUBLIC_KEY
ENV REACT_APP_RECAPTCHA_PUBLIC_KEY=$REACT_APP_RECAPTCHA_PUBLIC_KEY
ARG REACT_APP_LOGIN_API_URL=https://sso.datasektionen.se/legacyapi
ENV REACT_APP_LOGIN_API_URL=$REACT_APP_LOGIN_API_URL

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

EXPOSE 8080

USER www:www

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]
