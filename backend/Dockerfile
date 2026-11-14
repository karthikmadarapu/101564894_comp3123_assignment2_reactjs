FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p uploads logs && chown -R node:node /app
USER node
EXPOSE 5000
# ⚠️ change the path if your entry file is not src/server.js
CMD ["node", "src/server.js"]
