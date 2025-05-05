# ---- Base ----
# Use a specific Node.js version compatible with your Next.js app and server (Node 18)
FROM node:18-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
# Prevent build errors if using pnpm/yarn lockfiles when npm is default
# COPY package-lock.json* yarn.lock* pnpm-lock.yaml* ./
COPY package*.json ./
# Use npm ci for potentially faster and cleaner installs based on lockfile
RUN npm ci

# ---- Build ----
# Rebuild the source code only when needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set NEXT_PUBLIC_API_URL during build (can be overridden at runtime)
# Ensure your .env file or build process defines this if used during build
# ARG NEXT_PUBLIC_API_URL=http://localhost:3001
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Set NODE_ENV to production for the build step
ENV NODE_ENV=production
RUN npm run build

# ---- Production Runner ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# NEXT_PUBLIC_API_URL will be set via docker-compose environment section

# Copy necessary build artifacts
COPY --from=builder /app/public ./public

# Check if your next.config.ts has `output: 'standalone'`
# If YES, use these lines:
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# If NO (or you are not using standalone output), use these lines instead:
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules # Requires including node_modules from 'deps' or 'builder' stage

# Copy your custom server file if you are using one (like server.ts, needs to be compiled to JS)
# You might need to adjust the build step to output server.js if using TS
# Assuming your build process creates a server.js in the root or a specific dir:
# COPY --from=builder /app/server.js ./server.js # Adjust path if needed

# Expose the port Next.js runs on (default is 3000)
EXPOSE 3000

# Command to run the production server
# If using standalone output:
CMD ["node", "server.js"] # Assumes standalone includes or you copied your compiled server.js

# If NOT using standalone output AND using custom server:
# CMD ["node", "server.js"] # Make sure server.js exists

# If NOT using standalone output AND NOT using custom server (standard next start):
# CMD ["npm", "start"]