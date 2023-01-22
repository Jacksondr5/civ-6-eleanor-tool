# Install dependences separately to aid in local development
FROM node:18-alpine3.17 AS installer
WORKDIR /app
COPY .yarn ./.yarn
COPY yarn.lock .yarnrc.yml ./
COPY package.json yarn.lock ./
RUN yarn install --immutable

# Build the code separately from the deployed image to exclude yarn cache
# and other unnecessary things
FROM node:18-alpine3.17 AS builder
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY . .
RUN yarn build 
# # Remove dev dependencies
# RUN yarn install --production --mode=skip-build --immutable --immutable-cache
# # Since running install scripts in CI is a bad idea, we need to run
# # sharp's scripts on their own or else sharp won't load
# WORKDIR /app/node_modules/sharp
# RUN yarn run install

# Production image, copy only the necessary files
FROM node:18-alpine3.17 AS runner
# Set up user for next
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN mkdir /app && chown nextjs:nodejs /app
WORKDIR /app

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]
