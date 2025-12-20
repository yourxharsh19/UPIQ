🚀 UPIQ Backend Microservices

Welcome to the UPIQ Backend! This repository contains all the backend microservices, including API Gateway, Eureka Service Discovery, and individual microservices with their own databases. Everything is Dockerized, so you can run the entire backend with just a few commands.

This README will guide you step by step, whether you’re running locally or globally via Docker Hub.

📂 Project Structure

Here’s what your backend folder looks like:

Backend/
├── APIGateway/                 # API Gateway service
├── UserAuthService/            # User Authentication microservice
├── TransactionService/         # Transaction microservice
├── CategoryService/            # Category microservice
├── PDFParserService/           # PDF Parser microservice
└── EurekaServer/               # Eureka Service Discovery


Each folder contains its own Dockerfile and Spring Boot application.

🔌 Microservices & Ports
Service	Port	Notes
API Gateway	8080	Entry point for all requests
User Authentication Service	8081	Handles login/register/jwt
PDF Parser Service	8082	Handles PDF extraction
Transaction Service	8083	Manages transactions
Category Service	8084	Manages categories
Eureka Server	8761	Service discovery dashboard
Databases
Service Database	Port	Version
User Authentication DB	5434	16
Transaction DB	5435	16
Category DB	5436	16

Tip: Make sure these ports are free before starting Docker Compose.

🛠 Prerequisites

Before starting, ensure you have the following installed:

Docker

Docker Compose v2

Java 21 JDK

Maven 3.x

💻 Local Setup (Developers)

Follow these steps to run your backend locally using your machine’s Docker:

1️⃣ Build Docker Images

For each service:

cd <service-folder>
docker build -t upiq-<service-name>:latest .


Example:

cd APIGateway
docker build -t upiq-api-gateway:latest .


Repeat for all services.

2️⃣ Start Services with Docker Compose
docker-compose -f docker-compose.local.yml up -d


This will spin up all microservices, their databases, and Eureka server.

3️⃣ Verify Running Containers
docker ps


You should see something like:

CONTAINER ID   NAME                     PORTS
xxxxxx         api-gateway              0.0.0.0:8080->8080
xxxxxx         user-auth-service        0.0.0.0:8081->8081
...

4️⃣ Check Logs (Optional)
docker logs -f <container_name>


Example:

docker logs -f api-gateway

🌍 Global Setup (Docker Hub)

If you want to run the backend globally using pre-built Docker Hub images:

1️⃣ Tag your images
docker tag upiq-api-gateway:latest yourxharsh19/upiq-api-gateway:latest
docker tag upiq-user-auth-service:latest yourxharsh19/upiq-user-auth-service:latest
docker tag upiq-user-auth-db:16 yourxharsh19/upiq-user-auth-db:16
# Repeat for all services

2️⃣ Push to Docker Hub
docker push yourxharsh19/<image-name>:<tag>


Example:

docker push yourxharsh19/upiq-api-gateway:latest

3️⃣ Run Services Globally
docker-compose -f docker-compose.global.yml up -d


All services will now be pulled directly from Docker Hub.

📦 Docker Images
Local Image	Docker Hub Tag
upiq-api-gateway:latest	yourxharsh19/upiq-api-gateway:latest
upiq-user-auth-service:latest	yourxharsh19/upiq-user-auth-service:latest
upiq-user-auth-db:16	yourxharsh19/upiq-user-auth-db:16
upiq-transaction-service:latest	yourxharsh19/upiq-transaction-service:latest
upiq-transaction-db:16	yourxharsh19/upiq-transaction-db:16
upiq-category-service:latest	yourxharsh19/upiq-category-service:latest
upiq-category-db:16	yourxharsh19/upiq-category-db:16
upiq-pdf-parser-service:latest	yourxharsh19/upiq-pdf-parser-service:latest
upiq-eureka-server:latest	yourxharsh19/upiq-eureka-server:latest
⚡ Useful Commands

Start all services:

docker-compose -f docker-compose.local.yml up -d


Stop all services:

docker-compose down


Check service logs:

docker logs -f <container_name>


Remove all containers/images (if needed):

docker system prune -a

🔔 Important Notes

Use docker-compose.local.yml for development and testing.

Use docker-compose.global.yml to run backend globally via Docker Hub.

Eureka service discovery requires all services on the same network (upiq-network).

For Spring Boot commons logging issues, remove commons-logging.jar from classpath.

All configuration files are in application.properties per service.

🎯 Tip: Always check that your databases are running before starting microservices, otherwise services won’t register with Eureka.

🎉 Congratulations!

You now have a fully containerized backend for UPIQ. 🎊
Follow this README step-by-step, and you’ll be up and running in minutes.

---
**Created by Harshdeep Singh | 2025**