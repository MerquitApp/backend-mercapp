FROM node:20-alpine3.19 as base
RUN apk add --no-cache libc6-compat

FROM base AS builder
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

CMD npm start
