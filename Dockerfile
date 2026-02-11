# Use Node.js as the base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and package-lock.json
COPY package.json pnpm-lock.yaml ./
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate --schema="./prisma/schema/"

# Build the Next.js app
RUN pnpm run build

# Remove development dependencies for a smaller image
RUN pnpm prune --prod

# Use a minimal image for the final container
FROM node:18-alpine AS runner

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy the built application from the builder stage
COPY --from=builder /app ./
ENV NEXT_TELEMETRY_DISABLED=1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

CMD ["pnpm", "start"]