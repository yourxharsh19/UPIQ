FROM postgres:16-alpine

ENV POSTGRES_DB=Transactiondb
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password

# Adds SQL schema + default entries
COPY init.sql /docker-entrypoint-initdb.d/init.sql
