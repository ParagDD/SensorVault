FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for the build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_JWT_EXPIRES_IN

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}
ENV NEXT_PUBLIC_JWT_EXPIRES_IN=${NEXT_PUBLIC_JWT_EXPIRES_IN}

# Uncomment the following line to enable standalone output
# RUN sed -i 's/\/\/ output: .*/output: "standalone",/' next.config.js

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files for running the application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# For standalone output mode (uncomment if using standalone output)
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Start the application
CMD ["npm", "start"]

# For standalone output mode (uncomment if using standalone output)
# CMD ["node", "server.js"] 