FROM node:20-alpine
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN npx prisma generate && pnpm build

EXPOSE 3000
ENV HOST=0.0.0.0
CMD ["pnpm", "start"]
