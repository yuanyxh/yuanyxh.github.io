FROM node:20-alpine AS builder

COPY . /work

WORKDIR /work

RUN npm install -g pnpm && \
    pnpm install && \
    pnpm run build

FROM nginx:1.27.5-alpine

COPY --from=builder /work/build /webapp
COPY --from=builder /work/build/nginx.conf /etc/nginx/conf.d

EXPOSE 80
