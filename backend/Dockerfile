FROM node:16

# Install Oracle Instant Client
RUN apt-get update && apt-get install -y libaio1 wget unzip \
    && mkdir -p /opt/oracle \
    && cd /opt/oracle \
    && wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip \
    && unzip instantclient-basiclite-linuxx64.zip \
    && rm -f instantclient-basiclite-linuxx64.zip \
    && cd /opt/oracle/instantclient* \
    && rm -f *jdbc* *occi* *mysql* *README *jar uidrvci genezi adrci \
    && echo /opt/oracle/instantclient* > /etc/ld.so.conf.d/oracle-instantclient.conf \
    && ldconfig

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Set environment variables for Oracle Instant Client
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_21_10

# Expose API port
EXPOSE 4000

# Start the app
CMD ["npm", "start"] 