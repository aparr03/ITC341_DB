FROM node:18-slim

WORKDIR /app

# Install Oracle Instant Client dependencies
RUN apt-get update && apt-get install -y \
    libaio1 \
    wget \
    unzip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Oracle Instant Client 21.11 (simplified approach)
WORKDIR /opt/oracle
RUN wget https://download.oracle.com/otn_software/linux/instantclient/2111000/instantclient-basiclite-linux.x64-21.11.0.0.0dbru.zip && \
    unzip instantclient-basiclite-linux.x64-21.11.0.0.0dbru.zip && \
    rm instantclient-basiclite-linux.x64-21.11.0.0.0dbru.zip

# Configure Oracle Instant Client with ldconfig
RUN echo "/opt/oracle/instantclient_21_11" > /etc/ld.so.conf.d/oracle-instantclient.conf && \
    ldconfig

# Set environment variables
ENV LD_LIBRARY_PATH="/opt/oracle/instantclient_21_11:${LD_LIBRARY_PATH}"
ENV ORACLE_HOME="/opt/oracle/instantclient_21_11"
ENV PATH="${ORACLE_HOME}:${PATH}"

# Return to app directory and set up Node.js application
WORKDIR /app

# Copy package files and install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

EXPOSE 3000

CMD ["node", "api/index.js"] 