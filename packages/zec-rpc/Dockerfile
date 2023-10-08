FROM node:18-bullseye-slim

# COPY --from=builder /usr/src/native.node /usr/bin/
RUN apt-get update
RUN apt-get install -y ca-certificates

WORKDIR /usr/src/app



COPY package*.json ./

# RUN apt install -y libssl-dev pkg-config
# RUN apt install -y cmake

RUN npm install
# RUN node-gyp rebuild -C ./node_modules/argon2
# RUN npm install argon2 --build-from-source

# Bundle app source
COPY . .

# RUN cp /usr/src/native.node /usr/src/app/src/native.node

# RUN npm run build:rust
RUN npm run build

EXPOSE 8081


# Copy the entrypoint script
COPY entrypoint.sh .

# Grant execute permissions
RUN chmod +x entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["./entrypoint.sh"]

