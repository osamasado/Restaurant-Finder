FROM openjdk:25-ea

EXPOSE 8080
ADD backend/target/app.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

LABEL authors="Mohammad Abdul Aziz, Osama Sado, Stanislav Platov"
