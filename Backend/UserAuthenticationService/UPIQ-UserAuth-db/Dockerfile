FROM postgres:16-alpine

ENV POSTGRES_DB=userauthdb
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password

COPY init.sql /docker-entrypoint-initdb.d/
