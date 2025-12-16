FROM postgres:16-alpine

# Set environment variables (can be overridden at runtime)
ENV POSTGRES_DB=Categorydb
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password

# Copy initialization script
COPY init.sql /docker-entrypoint-initdb.d/init.sql
EXPOSE 5432
