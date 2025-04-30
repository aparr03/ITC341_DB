FROM node:18-slim

WORKDIR /app

# Install Oracle Instant Client dependencies
RUN apt-get update && apt-get install -y \
    libaio1 \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Oracle Instant Client
WORKDIR /opt/oracle
RUN wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip \
    && unzip instantclient-basiclite-linuxx64.zip \
    && rm instantclient-basiclite-linuxx64.zip \
    && cd /opt/oracle/instantclient* \
    && if [ ! -e libclntsh.so ]; then ln -s libclntsh.so.21.1 libclntsh.so; fi \
    && if [ ! -e libocci.so ]; then ln -s libocci.so.21.1 libocci.so; fi

ENV LD_LIBRARY_PATH="/opt/oracle/instantclient_21_11:${LD_LIBRARY_PATH}"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "api/index.js"] 