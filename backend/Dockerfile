# ---- Base ----
    FROM node:18-alpine AS base
    WORKDIR /usr/src/app
    
    # ---- Dependencies ----
    FROM base AS dependencies
    COPY package*.json ./
    COPY prisma ./prisma/
    RUN npm ci --include=dev
    
    # ---- Build ----
    FROM base AS builder
    COPY --from=dependencies /usr/src/app/node_modules ./node_modules
    COPY --from=dependencies /usr/src/app/prisma ./prisma/
    COPY . .
    RUN npx prisma generate
    RUN npm run build
    
    # ---- Production ----
    FROM node:18-alpine AS production
    WORKDIR /usr/src/app
    
    ENV NODE_ENV=production
    
    COPY --from=builder /usr/src/app/package.json ./package.json
    COPY --from=builder /usr/src/app/package-lock.json ./package-lock.json
    COPY --from=builder /usr/src/app/dist ./dist
    COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
    COPY --from=builder /usr/src/app/prisma ./prisma
    
    # Install ONLY production dependencies
    RUN npm ci --omit=dev
    
    # Expose the port the NestJS app listens on
    EXPOSE 3000
    
    # Command to run the compiled application
    CMD ["node", "dist/main.js"]