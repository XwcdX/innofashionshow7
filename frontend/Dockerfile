# ---- Base ----
FROM node:18-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package*.json ./
RUN npm ci --include=dev

# ---- Build ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/server.js ./server.js

# --- Install ONLY Production Dependencies ---
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "server.js"]