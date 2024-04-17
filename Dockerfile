FROM node:21.7-alpine 

# Add Maintainer Info
LABEL maintainer="Syamil Maulod <syamil@bearylogical.net>"

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@8.15.5

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["node",  "./build/index.js"]

