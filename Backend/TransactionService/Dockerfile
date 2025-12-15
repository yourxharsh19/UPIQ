# Stage 1: Build
FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jdk-alpine AS run
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java","-jar","app.jar","--spring.config.location=classpath:/application-docker.properties"]