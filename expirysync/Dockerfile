# Build stage
FROM maven:3.8.4-openjdk-11-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package

# Run stage
FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=build /app/target/expirysync-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
