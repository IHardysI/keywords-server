FROM oven/bun:latest

WORKDIR /app

# Copy package.json and lockfile
COPY package.json .
COPY bun.lockb .

# Install dependencies
RUN bun install

# Copy application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/index.ts"]