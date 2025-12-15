# ============================
# Stage 1: Build
# ============================
FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B


# ============================
# Stage 2: Runtime
# ============================
FROM eclipse-temurin:21-jdk-alpine AS run
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the service port (change if needed)
EXPOSE 8082

# Run the service
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=docker"]
