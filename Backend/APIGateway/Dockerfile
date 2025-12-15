# ============================
# Stage 1: Build
# ============================
FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests -B


# ============================
# Stage 2: Runtime
# ============================
FROM eclipse-temurin:21-jdk-alpine AS run
WORKDIR /app

# Copy the generated JAR
COPY --from=build /app/target/*.jar app.jar

# Expose Gateway port
EXPOSE 8080

# Run the API Gateway
ENTRYPOINT ["java", "-jar", "app.jar"]
