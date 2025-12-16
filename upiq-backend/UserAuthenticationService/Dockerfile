# ============================
# Stage 1: Build
# ============================
FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests


# ============================
# Stage 2: Runtime
# ============================
FROM eclipse-temurin:21-jdk-alpine AS run
WORKDIR /app

# Copy built JAR from builder stage
COPY --from=build /app/target/*.jar app.jar

# Expose default port (change if needed)
EXPOSE 8081

# Run the application
ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=docker"]

