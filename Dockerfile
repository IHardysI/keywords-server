FROM oven/bun:latest

WORKDIR /app

# Copy application code
COPY . .

# Install dependencies
RUN bun install

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/index.ts"]