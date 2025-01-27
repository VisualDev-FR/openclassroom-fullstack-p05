# Yoga App !

# Requirements

* Java 11+
* maven 3+
* MySQL

# Configure MySQL

* create a database nammed `oc_p05_yoga` in MYSQL
* update [username](./src/main/resources/application.properties#L2) and [password](./src/main/resources/application.properties#L3) in `application.properties` with the credentials of a user in MySql which have access to the database created previously

# Install maven packages

```
mvn clean install
```

# Run dev server

```
mvn spring-boot:run
```

# Run test

```
mvn clean test
```
