# =========================
# Stage 1: Build React app
# =========================
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY .env ./.env
RUN npm install
COPY . .
RUN npm run build

# =========================
# Stage 2: Serve with Nginx (proxy backend)
# =========================
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build output
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
