FROM node:20-bookworm-slim
WORKDIR /app
RUN corepack enable
COPY ../../pnpm-workspace.yaml ../../package.json ../../tsconfig.base.json /app/
COPY package.json /app/apps/api/package.json
COPY ../../packages /app/packages
COPY src /app/apps/api/src
RUN pnpm i --frozen-lockfile=false
WORKDIR /app/apps/api
RUN pnpm build
EXPOSE 8787
CMD ["pnpm","dev"]
