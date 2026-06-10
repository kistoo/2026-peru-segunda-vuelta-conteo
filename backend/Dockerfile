FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Python + curl_cffi para el adaptador de TLS fingerprinting
RUN apk add --no-cache python3 py3-pip curl && \
    pip3 install curl_cffi --break-system-packages

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# El script Python se busca en process.cwd()/src/resultados/
COPY src/resultados/onpe-fetcher.py ./src/resultados/onpe-fetcher.py

ENV PYTHON_BIN=python3
EXPOSE 3000
CMD ["node", "dist/main"]
