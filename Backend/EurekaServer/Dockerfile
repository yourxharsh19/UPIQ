# ============================
# Stage 1: Build the JAR file
# ============================
FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy only pom.xml first (better Docker caching for dependencies)
COPY pom.xml .
RUN mvn dependency:go-offline -B
# Copy the rest of the project
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -B


# ============================
# Stage 2: Run the Spring Boot app
# ============================
FROM eclipse-temurin:21-jdk-alpine AS run
WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose Eureka default port
EXPOSE 8761

# Run Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
