FROM node:20-alpine
RUN echo "inside admin"
RUN npm i pnpm -g
WORKDIR '/app'
COPY ./package.json ./
RUN pnpm install
COPY . .
RUN npm run build
CMD ["npm","run","start"]

