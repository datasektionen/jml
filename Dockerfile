FROM node:18-alpine AS base

FROM base AS builder

RUN apk add --no-cache git # for npm fetching Methone from GitHub

WORKDIR /app

COPY . .

#RUN yarn --frozen-lockfile
RUN npm ci

ARG REACT_APP_RECAPTCHA_PUBLIC_KEY
ENV REACT_APP_RECAPTCHA_PUBLIC_KEY=$REACT_APP_RECAPTCHA_PUBLIC_KEY
ENV NODE_OPTIONS="--openssl-legacy-provider"

RUN npm run build

FROM builder AS dev

RUN apk add --no-cache socat

CMD ["npm", "start"]

# Production image; runtime
FROM node:18-alpine

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

CMD ["npm", "start"]
