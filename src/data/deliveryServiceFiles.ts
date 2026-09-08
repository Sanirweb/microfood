export const deliveryServiceFiles: Record<string, string> = {
  "delivery-service/pom.xml": `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.fooddelivery</groupId>
    <artifactId>delivery-service</artifactId>
    <version>1.0.0</version>

    <properties>
        <compiler-plugin.version>3.12.1</compiler-plugin.version>
        <maven.compiler.release>17</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <quarkus.platform.artifact-id>quarkus-bom</quarkus.platform.artifact-id>
        <quarkus.platform.group-id>io.quarkus.platform</quarkus.platform.group-id>
        <quarkus.platform.version>3.8.1</quarkus.platform.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>\${quarkus.platform.group-id}</groupId>
                <artifactId>\${quarkus.platform.artifact-id}</artifactId>
                <version>\${quarkus.platform.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-rest-jackson</artifactId>
        </dependency>
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-hibernate-orm-panache</artifactId>
        </dependency>
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-jdbc-mysql</artifactId>
        </dependency>
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-hibernate-validator</artifactId>
        </dependency>
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-smallrye-health</artifactId>
        </dependency>
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-smallrye-openapi</artifactId>
        </dependency>
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-arc</artifactId>
        </dependency>
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-junit5</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>io.rest-assured</groupId>
            <artifactId>rest-assured</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>\${quarkus.platform.group-id}</groupId>
                <artifactId>quarkus-maven-plugin</artifactId>
                <version>\${quarkus.platform.version}</version>
                <extensions>true</extensions>
                <executions>
                    <execution>
                        <goals>
                            <goal>build</goal>
                            <goal>generate-code</goal>
                            <goal>generate-code-tests</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>\${compiler-plugin.version}</version>
                <configuration>
                    <compilerArgs>
                        <arg>-parameters</arg>
                    </compilerArgs>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`,

  "delivery-service/src/main/resources/application.properties": `# Delivery Service Configuration
quarkus.http.port=8083
quarkus.http.cors=true
quarkus.http.cors.origins=*

# MySQL Database
quarkus.datasource.db-kind=mysql
quarkus.datasource.username=root
quarkus.datasource.password=root
quarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/food_delivery_db?useSSL=false&allowPublicKeyRetrieval=true

# Hibernate
quarkus.hibernate-orm.database.generation=none
quarkus.hibernate-orm.log.sql=true

# OpenAPI
quarkus.smallrye-openapi.info-title=Delivery Service API
quarkus.smallrye-openapi.info-version=1.0.0
quarkus.smallrye-openapi.info-description=Delivery Microservice for Food Delivery System
quarkus.swagger-ui.always-include=true`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/entity/Delivery.java": `package com.fooddelivery.delivery.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Delivery entity - represents a food delivery record.
 * Links to an order via orderId (logical reference, not FK).
 */
@Entity
@Table(name = "deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "delivery_person_name", length = 200)
    private String deliveryPersonName;

    @Column(name = "delivery_person_phone", length = 20)
    private String deliveryPersonPhone;

    @Column(name = "delivery_address", nullable = false, length = 500)
    private String deliveryAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DeliveryStatus status = DeliveryStatus.UNASSIGNED;

    @Column(name = "estimated_delivery_time")
    private Integer estimatedDeliveryTime;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "picked_up_at")
    private LocalDateTime pickedUpAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getDeliveryPersonName() { return deliveryPersonName; }
    public void setDeliveryPersonName(String name) { this.deliveryPersonName = name; }

    public String getDeliveryPersonPhone() { return deliveryPersonPhone; }
    public void setDeliveryPersonPhone(String phone) { this.deliveryPersonPhone = phone; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String address) { this.deliveryAddress = address; }

    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }

    public Integer getEstimatedDeliveryTime() { return estimatedDeliveryTime; }
    public void setEstimatedDeliveryTime(Integer time) { this.estimatedDeliveryTime = time; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getPickedUpAt() { return pickedUpAt; }
    public void setPickedUpAt(LocalDateTime pickedUpAt) { this.pickedUpAt = pickedUpAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/entity/DeliveryStatus.java": `package com.fooddelivery.delivery.entity;

/**
 * Enum representing all possible delivery states.
 */
public enum DeliveryStatus {
    UNASSIGNED,
    ASSIGNED,
    PICKED_UP,
    OUT_FOR_DELIVERY,
    DELIVERED,
    FAILED,
    CANCELLED
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/dto/DeliveryRequest.java": `package com.fooddelivery.delivery.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating/updating a delivery.
 */
public class DeliveryRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @Size(min = 5, max = 500, message = "Delivery address must be between 5 and 500 characters")
    private String deliveryAddress;

    private String deliveryPersonName;
    private String deliveryPersonPhone;
    private Integer estimatedDeliveryTime;

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getDeliveryPersonName() { return deliveryPersonName; }
    public void setDeliveryPersonName(String deliveryPersonName) { this.deliveryPersonName = deliveryPersonName; }

    public String getDeliveryPersonPhone() { return deliveryPersonPhone; }
    public void setDeliveryPersonPhone(String deliveryPersonPhone) { this.deliveryPersonPhone = deliveryPersonPhone; }

    public Integer getEstimatedDeliveryTime() { return estimatedDeliveryTime; }
    public void setEstimatedDeliveryTime(Integer estimatedDeliveryTime) { this.estimatedDeliveryTime = estimatedDeliveryTime; }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/dto/DeliveryResponse.java": `package com.fooddelivery.delivery.dto;

import java.time.LocalDateTime;

/**
 * DTO for returning delivery information.
 */
public class DeliveryResponse {

    private Long id;
    private Long orderId;
    private String deliveryPersonName;
    private String deliveryPersonPhone;
    private String deliveryAddress;
    private String status;
    private Integer estimatedDeliveryTime;
    private LocalDateTime assignedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getDeliveryPersonName() { return deliveryPersonName; }
    public void setDeliveryPersonName(String name) { this.deliveryPersonName = name; }

    public String getDeliveryPersonPhone() { return deliveryPersonPhone; }
    public void setDeliveryPersonPhone(String phone) { this.deliveryPersonPhone = phone; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String address) { this.deliveryAddress = address; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getEstimatedDeliveryTime() { return estimatedDeliveryTime; }
    public void setEstimatedDeliveryTime(Integer time) { this.estimatedDeliveryTime = time; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getPickedUpAt() { return pickedUpAt; }
    public void setPickedUpAt(LocalDateTime pickedUpAt) { this.pickedUpAt = pickedUpAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/dto/AssignRequest.java": `package com.fooddelivery.delivery.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * DTO for assigning a delivery person.
 */
public class AssignRequest {

    @NotBlank(message = "Delivery person name is required")
    private String deliveryPersonName;

    @NotBlank(message = "Delivery person phone is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone must be 10-15 digits")
    private String deliveryPersonPhone;

    public String getDeliveryPersonName() { return deliveryPersonName; }
    public void setDeliveryPersonName(String name) { this.deliveryPersonName = name; }

    public String getDeliveryPersonPhone() { return deliveryPersonPhone; }
    public void setDeliveryPersonPhone(String phone) { this.deliveryPersonPhone = phone; }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/dto/StatusUpdateRequest.java": `package com.fooddelivery.delivery.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for updating delivery status.
 */
public class StatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/repository/DeliveryRepository.java": `package com.fooddelivery.delivery.repository;

import com.fooddelivery.delivery.entity.Delivery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

/**
 * Repository for Delivery entity.
 */
@ApplicationScoped
public class DeliveryRepository implements PanacheRepository<Delivery> {

    public Optional<Delivery> findByOrderId(Long orderId) {
        return find("orderId", orderId).firstResultOptional();
    }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/service/DeliveryService.java": `package com.fooddelivery.delivery.service;

import com.fooddelivery.delivery.dto.*;
import com.fooddelivery.delivery.entity.*;
import com.fooddelivery.delivery.exception.*;
import com.fooddelivery.delivery.repository.DeliveryRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Delivery business logic.
 */
@ApplicationScoped
public class DeliveryService {

    @Inject
    DeliveryRepository deliveryRepository;

    @Inject
    Logger logger;

    public List<DeliveryResponse> getAllDeliveries() {
        return deliveryRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DeliveryResponse getDeliveryById(Long id) {
        Delivery delivery = deliveryRepository.findById(id);
        if (delivery == null) {
            throw new ResourceNotFoundException("Delivery not found with id: " + id);
        }
        return toResponse(delivery);
    }

    public DeliveryResponse getDeliveryByOrderId(Long orderId) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("No delivery found for order: " + orderId));
        return toResponse(delivery);
    }

    @Transactional
    public DeliveryResponse createDelivery(DeliveryRequest request) {
        Delivery delivery = new Delivery();
        delivery.setOrderId(request.getOrderId());
        delivery.setDeliveryAddress(request.getDeliveryAddress() != null ?
                request.getDeliveryAddress() : "Address from order");
        delivery.setStatus(DeliveryStatus.UNASSIGNED);
        delivery.setEstimatedDeliveryTime(request.getEstimatedDeliveryTime());

        deliveryRepository.persist(delivery);
        logger.infof("Created delivery for order: %d", request.getOrderId());
        return toResponse(delivery);
    }

    @Transactional
    public DeliveryResponse assignDeliveryPerson(Long id, AssignRequest request) {
        Delivery delivery = deliveryRepository.findById(id);
        if (delivery == null) {
            throw new ResourceNotFoundException("Delivery not found with id: " + id);
        }
        if (delivery.getStatus() != DeliveryStatus.UNASSIGNED) {
            throw new BadRequestException("Can only assign to unassigned deliveries");
        }

        delivery.setDeliveryPersonName(request.getDeliveryPersonName());
        delivery.setDeliveryPersonPhone(request.getDeliveryPersonPhone());
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        delivery.setAssignedAt(LocalDateTime.now());

        logger.infof("Assigned delivery %d to: %s", id, request.getDeliveryPersonName());
        return toResponse(delivery);
    }

    @Transactional
    public DeliveryResponse updateStatus(Long id, StatusUpdateRequest request) {
        Delivery delivery = deliveryRepository.findById(id);
        if (delivery == null) {
            throw new ResourceNotFoundException("Delivery not found with id: " + id);
        }

        DeliveryStatus newStatus;
        try {
            newStatus = DeliveryStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid delivery status: " + request.getStatus());
        }

        validateStatusTransition(delivery.getStatus(), newStatus);
        delivery.setStatus(newStatus);

        if (newStatus == DeliveryStatus.PICKED_UP) {
            delivery.setPickedUpAt(LocalDateTime.now());
        }
        if (newStatus == DeliveryStatus.DELIVERED) {
            delivery.setDeliveredAt(LocalDateTime.now());
        }

        logger.infof("Delivery %d status updated to: %s", id, newStatus);
        return toResponse(delivery);
    }

    @Transactional
    public void deleteDelivery(Long id) {
        Delivery delivery = deliveryRepository.findById(id);
        if (delivery == null) {
            throw new ResourceNotFoundException("Delivery not found with id: " + id);
        }
        if (delivery.getStatus() == DeliveryStatus.DELIVERED) {
            throw new BadRequestException("Cannot delete a delivered delivery");
        }
        deliveryRepository.delete(delivery);
        logger.infof("Deleted delivery: %d", id);
    }

    private void validateStatusTransition(DeliveryStatus current, DeliveryStatus next) {
        if (current == DeliveryStatus.DELIVERED) {
            throw new BadRequestException("Cannot change status of a delivered delivery");
        }
        if (current == DeliveryStatus.CANCELLED) {
            throw new BadRequestException("Cannot change status of a cancelled delivery");
        }
    }

    private DeliveryResponse toResponse(Delivery delivery) {
        DeliveryResponse response = new DeliveryResponse();
        response.setId(delivery.getId());
        response.setOrderId(delivery.getOrderId());
        response.setDeliveryPersonName(delivery.getDeliveryPersonName());
        response.setDeliveryPersonPhone(delivery.getDeliveryPersonPhone());
        response.setDeliveryAddress(delivery.getDeliveryAddress());
        response.setStatus(delivery.getStatus().name());
        response.setEstimatedDeliveryTime(delivery.getEstimatedDeliveryTime());
        response.setAssignedAt(delivery.getAssignedAt());
        response.setPickedUpAt(delivery.getPickedUpAt());
        response.setDeliveredAt(delivery.getDeliveredAt());
        response.setCreatedAt(delivery.getCreatedAt());
        response.setUpdatedAt(delivery.getUpdatedAt());
        return response;
    }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/controller/DeliveryController.java": `package com.fooddelivery.delivery.controller;

import com.fooddelivery.delivery.dto.*;
import com.fooddelivery.delivery.service.DeliveryService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;

/**
 * REST controller for Delivery operations.
 */
@Path("/api/deliveries")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Deliveries", description = "Delivery management operations")
public class DeliveryController {

    @Inject
    DeliveryService deliveryService;

    @GET
    @Operation(summary = "Get all deliveries")
    public Response getAllDeliveries() {
        List<DeliveryResponse> deliveries = deliveryService.getAllDeliveries();
        return Response.ok(deliveries).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get delivery by ID")
    public Response getDeliveryById(@PathParam("id") Long id) {
        DeliveryResponse delivery = deliveryService.getDeliveryById(id);
        return Response.ok(delivery).build();
    }

    @GET
    @Path("/order/{orderId}")
    @Operation(summary = "Get delivery by order ID")
    public Response getDeliveryByOrderId(@PathParam("orderId") Long orderId) {
        DeliveryResponse delivery = deliveryService.getDeliveryByOrderId(orderId);
        return Response.ok(delivery).build();
    }

    @POST
    @Operation(summary = "Create a new delivery")
    public Response createDelivery(@Valid DeliveryRequest request) {
        DeliveryResponse delivery = deliveryService.createDelivery(request);
        return Response.status(Response.Status.CREATED).entity(delivery).build();
    }

    @PATCH
    @Path("/{id}/assign")
    @Operation(summary = "Assign delivery person")
    public Response assignDeliveryPerson(@PathParam("id") Long id, @Valid AssignRequest request) {
        DeliveryResponse delivery = deliveryService.assignDeliveryPerson(id, request);
        return Response.ok(delivery).build();
    }

    @PATCH
    @Path("/{id}/status")
    @Operation(summary = "Update delivery status")
    public Response updateStatus(@PathParam("id") Long id, @Valid StatusUpdateRequest request) {
        DeliveryResponse delivery = deliveryService.updateStatus(id, request);
        return Response.ok(delivery).build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete/cancel delivery")
    public Response deleteDelivery(@PathParam("id") Long id) {
        deliveryService.deleteDelivery(id);
        return Response.noContent().build();
    }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/exception/ResourceNotFoundException.java": `package com.fooddelivery.delivery.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/exception/BadRequestException.java": `package com.fooddelivery.delivery.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/exception/ErrorResponse.java": `package com.fooddelivery.delivery.exception;

import java.time.LocalDateTime;

public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;

    public ErrorResponse() { this.timestamp = LocalDateTime.now(); }

    public ErrorResponse(int status, String error, String message, String path) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/exception/GlobalExceptionHandler.java": `package com.fooddelivery.delivery.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;
import java.util.stream.Collectors;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

    private static final Logger logger = Logger.getLogger(GlobalExceptionHandler.class);

    @Override
    public Response toResponse(Exception exception) {
        logger.error("Exception caught: " + exception.getMessage());

        if (exception instanceof ResourceNotFoundException) {
            ErrorResponse error = new ErrorResponse(404, "Not Found", exception.getMessage(), "/api/deliveries");
            return Response.status(Response.Status.NOT_FOUND).entity(error).build();
        }

        if (exception instanceof BadRequestException) {
            ErrorResponse error = new ErrorResponse(400, "Bad Request", exception.getMessage(), "/api/deliveries");
            return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
        }

        if (exception instanceof jakarta.validation.ConstraintViolationException) {
            jakarta.validation.ConstraintViolationException cve = (jakarta.validation.ConstraintViolationException) exception;
            String messages = cve.getConstraintViolations().stream()
                .map(v -> v.getMessage())
                .collect(Collectors.joining(", "));
            ErrorResponse error = new ErrorResponse(400, "Bad Request", messages, "/api/deliveries");
            return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
        }

        if (exception instanceof jakarta.ws.rs.WebApplicationException) {
            return ((jakarta.ws.rs.WebApplicationException) exception).getResponse();
        }

        logger.error("Unhandled exception", exception);
        ErrorResponse error = new ErrorResponse(500, "Internal Server Error", "An unexpected error occurred", "/api/deliveries");
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
    }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/health/DeliveryServiceHealthCheck.java": `package com.fooddelivery.delivery.health;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;
import jakarta.enterprise.context.ApplicationScoped;

@Liveness
@ApplicationScoped
public class DeliveryServiceHealthCheck implements HealthCheck {

    @Override
    public HealthCheckResponse call() {
        return HealthCheckResponse.named("Delivery Service Liveness")
                .up()
                .build();
    }
}`,

  "delivery-service/src/main/java/com/fooddelivery/delivery/health/DeliveryServiceReadinessCheck.java": `package com.fooddelivery.delivery.health;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Readiness;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import javax.sql.DataSource;
import java.sql.Connection;

@Readiness
@ApplicationScoped
public class DeliveryServiceReadinessCheck implements HealthCheck {

    @Inject
    DataSource dataSource;

    @Override
    public HealthCheckResponse call() {
        try (Connection connection = dataSource.getConnection()) {
            boolean valid = connection.isValid(2);
            return HealthCheckResponse.named("Delivery Service Database Readiness")
                    .status(valid)
                    .withData("database", "MySQL")
                    .build();
        } catch (Exception e) {
            return HealthCheckResponse.named("Delivery Service Database Readiness")
                    .down()
                    .withData("error", e.getMessage())
                    .build();
        }
    }
}`,

  "delivery-service/src/test/java/com/fooddelivery/delivery/DeliveryControllerTest.java": `package com.fooddelivery.delivery;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
public class DeliveryControllerTest {

    @Test
    public void testGetAllDeliveries() {
        given()
            .when().get("/api/deliveries")
            .then()
            .statusCode(200);
    }

    @Test
    public void testGetDeliveryNotFound() {
        given()
            .when().get("/api/deliveries/99999")
            .then()
            .statusCode(404);
    }

    @Test
    public void testCreateDeliveryValidation() {
        String json = "{\\"orderId\\": null}";
        given()
            .contentType("application/json")
            .body(json)
            .when().post("/api/deliveries")
            .then()
            .statusCode(400);
    }
}`,

  "delivery-service/src/test/java/com/fooddelivery/delivery/HealthCheckTest.java": `package com.fooddelivery.delivery;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
public class HealthCheckTest {

    @Test
    public void testHealthEndpoint() {
        given()
            .when().get("/q/health")
            .then()
            .statusCode(200)
            .body("status", is("UP"));
    }

    @Test
    public void testLivenessEndpoint() {
        given()
            .when().get("/q/health/live")
            .then()
            .statusCode(200)
            .body("status", is("UP"));
    }

    @Test
    public void testReadinessEndpoint() {
        given()
            .when().get("/q/health/ready")
            .then()
            .statusCode(200)
            .body("status", is("UP"));
    }
}`,

  "delivery-service/Dockerfile": `FROM quay.io/quarkus/ubi-quarkus-mandrel-builder-image:23.1-java17 AS build
COPY --chown=quarkus:quarkus . /code/
RUN mvn -f /code/pom.xml package -DskipTests
FROM quay.io/quarkus/quarkus-micro-image:2.0
WORKDIR /work/
COPY --from=build /code/target/quarkus-app/lib/ /work/lib/
COPY --from=build /code/target/quarkus-app/*.jar /work/
COPY --from=build /code/target/quarkus-app/app/ /work/app/
COPY --from=build /code/target/quarkus-app/quarkus/ /work/quarkus/
EXPOSE 8083
CMD ["java", "-jar", "quarkus-run.jar"]`
};
