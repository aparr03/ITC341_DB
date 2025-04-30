FROM node:18-slim

WORKDIR /app

# Install Oracle Instant Client dependencies
RUN apt-get update && apt-get install -y \
    libaio1 \
    wget \
    unzip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Oracle Instant Client 21.11 (as referenced in your error logs)
WORKDIR /opt/oracle
RUN wget https://download.oracle.com/otn_software/linux/instantclient/2111000/instantclient-basiclite-linux.x64-21.11.0.0.0dbru.zip \
    && unzip instantclient-basiclite-linux.x64-21.11.0.0.0dbru.zip \
    && rm instantclient-basiclite-linux.x64-21.11.0.0.0dbru.zip \
    && cd /opt/oracle/instantclient_21_11 \
    && if [ ! -e libclntsh.so ]; then ln -s libclntsh.so.21.1 libclntsh.so; fi \
    && if [ ! -e libocci.so ]; then ln -s libocci.so.21.1 libocci.so; fi

# Configure Oracle Instant Client with ldconfig
RUN echo "/opt/oracle/instantclient_21_11" > /etc/ld.so.conf.d/oracle-instantclient.conf \
    && ldconfig

# Set environment variables
ENV LD_LIBRARY_PATH="/opt/oracle/instantclient_21_11:${LD_LIBRARY_PATH}"
ENV ORACLE_HOME="/opt/oracle/instantclient_21_11"
ENV PATH="${ORACLE_HOME}:${PATH}"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "api/index.js"] 