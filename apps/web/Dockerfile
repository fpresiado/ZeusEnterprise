FROM node:20-bookworm-slim
WORKDIR /app
RUN corepack enable
COPY package.json /app/apps/web/package.json
COPY vite.config.ts tsconfig.json index.html /app/apps/web/
COPY src /app/apps/web/src
WORKDIR /app/apps/web
RUN pnpm i --frozen-lockfile=false
EXPOSE 5173
CMD ["pnpm","dev","--host","0.0.0.0"]
