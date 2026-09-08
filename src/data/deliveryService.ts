// Delivery Service Source Code
export const deliveryServicePom = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.fooddelivery</groupId>
    <artifactId>delivery-service</artifactId>
    <version>1.0.0-SNAPSHOT</version>

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
            <artifactId>quarkus-resteasy-reactive-jackson</artifactId>
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
</project>`;

export const deliveryServiceProperties = `# Delivery Service Configuration
quarkus.http.port=8083
quarkus.application.name=delivery-service

# Database Configuration
quarkus.datasource.db-kind=mysql
quarkus.datasource.username=root
quarkus.datasource.password=root123
quarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/food_delivery_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

# Hibernate Configuration
quarkus.hibernate-orm.database.generation=none
quarkus.hibernate-orm.log.sql=true
quarkus.hibernate-orm.dialect=org.hibernate.dialect.MySQLDialect

# OpenAPI / Swagger
quarkus.smallrye-openapi.info-title=Delivery Service API
quarkus.smallrye-openapi.info-version=1.0.0
quarkus.smallrye-openapi.info-description=Food Delivery - Delivery Microservice API
quarkus.swagger-ui.always-include=true

# Health
quarkus.smallrye-health.root-path=/q/health

# CORS
quarkus.http.cors=true
quarkus.http.cors.origins=*`;

export const deliveryEntity = `package com.fooddelivery.delivery.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Delivery Entity - Represents a food delivery record
 * Links to an order via orderId (logical reference, not FK across databases)
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
    private LocalDateTime estimatedDeliveryTime;

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

    // Constructors
    public Delivery() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getDeliveryPersonName() { return deliveryPersonName; }
    public void setDeliveryPersonName(String deliveryPersonName) { this.deliveryPersonName = deliveryPersonName; }

    public String getDeliveryPersonPhone() { return deliveryPersonPhone; }
    public void setDeliveryPersonPhone(String deliveryPersonPhone) { this.deliveryPersonPhone = deliveryPersonPhone; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }

    public LocalDateTime getEstimatedDeliveryTime() { return estimatedDeliveryTime; }
    public void setEstimatedDeliveryTime(LocalDateTime estimatedDeliveryTime) { this.estimatedDeliveryTime = estimatedDeliveryTime; }

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
}`;

export const deliveryStatusEnum = `package com.fooddelivery.delivery.entity;

/**
 * Delivery Status Enum - Defines all possible delivery states
 */
public enum DeliveryStatus {
    UNASSIGNED,
    ASSIGNED,
    PICKED_UP,
    OUT_FOR_DELIVERY,
    DELIVERED,
    FAILED,
    CANCELLED
}`;

export const deliveryRepository = `package com.fooddelivery.delivery.repository;

import com.fooddelivery.delivery.entity.Delivery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

/**
 * Delivery Repository - Database operations for Delivery entity
 */
@ApplicationScoped
public class DeliveryRepository implements PanacheRepository<Delivery> {

    public Optional<Delivery> findByOrderId(Long orderId) {
        return find("orderId", orderId).firstResultOptional();
    }

    public Optional<Delivery> findByIdOptional(Long id) {
        return find("id", id).firstResultOptional();
    }
}`;

export const deliveryDto = `package com.fooddelivery.delivery.dto;

import jakarta.validation.constraints.*;

/**
 * Delivery Request DTO - Input for creating/updating deliveries
 */
public class DeliveryRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotBlank(message = "Delivery address is required")
    @Size(min = 5, max = 500)
    private String deliveryAddress;

    private String deliveryPersonName;
    private String deliveryPersonPhone;

    // Getters and Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getDeliveryPersonName() { return deliveryPersonName; }
    public void setDeliveryPersonName(String deliveryPersonName) { this.deliveryPersonName = deliveryPersonName; }

    public String getDeliveryPersonPhone() { return deliveryPersonPhone; }
    public void setDeliveryPersonPhone(String deliveryPersonPhone) { this.deliveryPersonPhone = deliveryPersonPhone; }
}`;

export const deliveryResponseDto = `package com.fooddelivery.delivery.dto;

import java.time.LocalDateTime;

/**
 * Delivery Response DTO - Complete delivery information
 */
public class DeliveryResponse {

    private Long id;
    private Long orderId;
    private String deliveryPersonName;
    private String deliveryPersonPhone;
    private String deliveryAddress;
    private String status;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime assignedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getDeliveryPersonName() { return deliveryPersonName; }
    public void setDeliveryPersonName(String deliveryPersonName) { this.deliveryPersonName = deliveryPersonName; }

    public String getDeliveryPersonPhone() { return deliveryPersonPhone; }
    public void setDeliveryPersonPhone(String deliveryPersonPhone) { this.deliveryPersonPhone = deliveryPersonPhone; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getEstimatedDeliveryTime() { return estimatedDeliveryTime; }
    public void setEstimatedDeliveryTime(LocalDateTime estimatedDeliveryTime) { this.estimatedDeliveryTime = estimatedDeliveryTime; }

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
}`;

export const deliveryServiceClass = `package com.fooddelivery.delivery.service;

import com.fooddelivery.delivery.dto.*;
import com.fooddelivery.delivery.entity.*;
import com.fooddelivery.delivery.exception.*;
import com.fooddelivery.delivery.repository.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Delivery Service - Business logic for delivery management
 */
@ApplicationScoped
public class DeliveryService {

    private static final Logger LOG = Logger.getLogger(DeliveryService.class);

    @Inject
    DeliveryRepository deliveryRepository;

    public List<DeliveryResponse> getAllDeliveries() {
        return deliveryRepository.listAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DeliveryResponse getDeliveryById(Long id) {
        Delivery delivery = deliveryRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + id));
        return toResponse(delivery);
    }

    public DeliveryResponse getDeliveryByOrderId(Long orderId) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("No delivery found for order: " + orderId));
        return toResponse(delivery);
    }

    @Transactional
    public DeliveryResponse createDelivery(DeliveryRequest request) {
        // Check if delivery already exists for this order
        deliveryRepository.findByOrderId(request.getOrderId()).ifPresent(d -> {
            throw new ConflictException("Delivery already exists for order: " + request.getOrderId());
        });

        Delivery delivery = new Delivery();
        delivery.setOrderId(request.getOrderId());
        delivery.setDeliveryAddress(request.getDeliveryAddress());
        delivery.setDeliveryPersonName(request.getDeliveryPersonName());
        delivery.setDeliveryPersonPhone(request.getDeliveryPersonPhone());
        delivery.setStatus(DeliveryStatus.UNASSIGNED);

        // Set estimated delivery time (30 minutes from now)
        delivery.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(30));

        deliveryRepository.persist(delivery);
        LOG.infof("Delivery created for order: %d", request.getOrderId());

        return toResponse(delivery);
    }

    @Transactional
    public DeliveryResponse updateDelivery(Long id, DeliveryRequest request) {
        Delivery delivery = deliveryRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + id));

        if (delivery.getStatus() == DeliveryStatus.DELIVERED) {
            throw new BadRequestException("Cannot modify a delivered delivery");
        }

        delivery.setDeliveryAddress(request.getDeliveryAddress());
        if (request.getDeliveryPersonName() != null) {
            delivery.setDeliveryPersonName(request.getDeliveryPersonName());
        }
        if (request.getDeliveryPersonPhone() != null) {
            delivery.setDeliveryPersonPhone(request.getDeliveryPersonPhone());
        }

        deliveryRepository.persist(delivery);
        return toResponse(delivery);
    }

    @Transactional
    public DeliveryResponse updateStatus(Long id, String newStatus) {
        Delivery delivery = deliveryRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + id));

        DeliveryStatus status;
        try {
            status = DeliveryStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid delivery status: " + newStatus);
        }

        validateStatusTransition(delivery.getStatus(), status);

        delivery.setStatus(status);

        // Update timestamps based on status
        if (status == DeliveryStatus.PICKED_UP) {
            delivery.setPickedUpAt(LocalDateTime.now());
        } else if (status == DeliveryStatus.DELIVERED) {
            delivery.setDeliveredAt(LocalDateTime.now());
        }

        deliveryRepository.persist(delivery);
        LOG.infof("Delivery %d status updated to: %s", id, status);

        return toResponse(delivery);
    }

    @Transactional
    public DeliveryResponse assignDeliveryPerson(Long id, String name, String phone) {
        Delivery delivery = deliveryRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + id));

        if (delivery.getStatus() == DeliveryStatus.DELIVERED || delivery.getStatus() == DeliveryStatus.CANCELLED) {
            throw new BadRequestException("Cannot assign to a " + delivery.getStatus() + " delivery");
        }

        delivery.setDeliveryPersonName(name);
        delivery.setDeliveryPersonPhone(phone);
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        delivery.setAssignedAt(LocalDateTime.now());

        deliveryRepository.persist(delivery);
        LOG.infof("Delivery %d assigned to: %s", id, name);

        return toResponse(delivery);
    }

    @Transactional
    public void cancelDelivery(Long id) {
        Delivery delivery = deliveryRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + id));

        if (delivery.getStatus() == DeliveryStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel a delivered delivery");
        }

        delivery.setStatus(DeliveryStatus.CANCELLED);
        deliveryRepository.persist(delivery);
    }

    private void validateStatusTransition(DeliveryStatus current, DeliveryStatus next) {
        if (current == DeliveryStatus.DELIVERED) {
            throw new BadRequestException("Cannot change status of a delivered delivery");
        }
        if (current == DeliveryStatus.CANCELLED) {
            throw new BadRequestException("Cannot change status of a cancelled delivery");
        }
        // Delivered delivery cannot go back to any other state
        if (next == DeliveryStatus.UNASSIGNED && current != DeliveryStatus.ASSIGNED) {
            throw new BadRequestException("Invalid status transition from " + current + " to " + next);
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
}`;

export const deliveryController = `package com.fooddelivery.delivery.controller;

import com.fooddelivery.delivery.dto.*;
import com.fooddelivery.delivery.service.*;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;
import java.util.Map;

/**
 * Delivery Controller - REST endpoints for delivery operations
 */
@Path("/api/deliveries")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Delivery", description = "Delivery management operations")
public class DeliveryController {

    @Inject
    DeliveryService deliveryService;

    @GET
    @Operation(summary = "Get all deliveries")
    public List<DeliveryResponse> getAllDeliveries() {
        return deliveryService.getAllDeliveries();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get delivery by ID")
    public DeliveryResponse getDeliveryById(@PathParam("id") Long id) {
        return deliveryService.getDeliveryById(id);
    }

    @GET
    @Path("/order/{orderId}")
    @Operation(summary = "Get delivery for an order")
    public DeliveryResponse getDeliveryByOrderId(@PathParam("orderId") Long orderId) {
        return deliveryService.getDeliveryByOrderId(orderId);
    }

    @POST
    @Operation(summary = "Create a new delivery")
    public Response createDelivery(@Valid DeliveryRequest request) {
        DeliveryResponse created = deliveryService.createDelivery(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update a delivery")
    public DeliveryResponse updateDelivery(@PathParam("id") Long id, @Valid DeliveryRequest request) {
        return deliveryService.updateDelivery(id, request);
    }

    @PATCH
    @Path("/{id}/status")
    @Operation(summary = "Update delivery status")
    public DeliveryResponse updateStatus(@PathParam("id") Long id, Map<String, String> body) {
        String status = body.get("status");
        return deliveryService.updateStatus(id, status);
    }

    @PATCH
    @Path("/{id}/assign")
    @Operation(summary = "Assign delivery person")
    public DeliveryResponse assignDeliveryPerson(@PathParam("id") Long id, Map<String, String> body) {
        String name = body.get("deliveryPersonName");
        String phone = body.get("deliveryPersonPhone");
        return deliveryService.assignDeliveryPerson(id, name, phone);
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Cancel a delivery")
    public Response cancelDelivery(@PathParam("id") Long id) {
        deliveryService.cancelDelivery(id);
        return Response.noContent().build();
    }
}`;

export const deliveryExceptionClasses = `package com.fooddelivery.delivery.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

---

package com.fooddelivery.delivery.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}

---

package com.fooddelivery.delivery.exception;

public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}

---

package com.fooddelivery.delivery.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import jakarta.validation.ConstraintViolationException;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception exception) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now().toString());

        if (exception instanceof ResourceNotFoundException) {
            errorResponse.put("status", 404);
            errorResponse.put("error", "Not Found");
            errorResponse.put("message", exception.getMessage());
            return Response.status(404).entity(errorResponse).build();
        }

        if (exception instanceof BadRequestException) {
            errorResponse.put("status", 400);
            errorResponse.put("error", "Bad Request");
            errorResponse.put("message", exception.getMessage());
            return Response.status(400).entity(errorResponse).build();
        }

        if (exception instanceof ConflictException) {
            errorResponse.put("status", 409);
            errorResponse.put("error", "Conflict");
            errorResponse.put("message", exception.getMessage());
            return Response.status(409).entity(errorResponse).build();
        }

        if (exception instanceof ConstraintViolationException) {
            ConstraintViolationException cve = (ConstraintViolationException) exception;
            String messages = cve.getConstraintViolations().stream()
                    .map(v -> v.getMessage())
                    .collect(Collectors.joining(", "));
            errorResponse.put("status", 400);
            errorResponse.put("error", "Bad Request");
            errorResponse.put("message", messages);
            return Response.status(400).entity(errorResponse).build();
        }

        errorResponse.put("status", 500);
        errorResponse.put("error", "Internal Server Error");
        errorResponse.put("message", "An unexpected error occurred");
        return Response.status(500).entity(errorResponse).build();
    }
}`;

export const deliveryHealthCheck = `package com.fooddelivery.delivery.health;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;
import org.eclipse.microprofile.health.Readiness;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class DeliveryHealthChecks {

    @Liveness
    @ApplicationScoped
    public static class DeliveryLivenessCheck implements HealthCheck {
        @Override
        public HealthCheckResponse call() {
            return HealthCheckResponse.up("Delivery Service is running");
        }
    }

    @Readiness
    @ApplicationScoped
    public static class DeliveryReadinessCheck implements HealthCheck {
        @Inject
        EntityManager entityManager;

        @Override
        public HealthCheckResponse call() {
            try {
                entityManager.createNativeQuery("SELECT 1").getSingleResult();
                return HealthCheckResponse.named("Database connection")
                        .up()
                        .withData("database", "food_delivery_db")
                        .build();
            } catch (Exception e) {
                return HealthCheckResponse.named("Database connection")
                        .down()
                        .withData("error", e.getMessage())
                        .build();
            }
        }
    }
}`;

export const deliveryServiceTest = `package com.fooddelivery.delivery;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class DeliveryServiceTest {

    @Test
    @Order(1)
    public void testGetAllDeliveries() {
        given()
            .when().get("/api/deliveries")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON);
    }

    @Test
    @Order(2)
    public void testCreateDelivery() {
        String body = "{\\"orderId\\": 1, \\"deliveryAddress\\": \\"Kathmandu, Nepal\\"}";

        given()
            .contentType(ContentType.JSON)
            .body(body)
            .when().post("/api/deliveries")
            .then()
            .statusCode(201)
            .body("orderId", is(1))
            .body("status", is("UNASSIGNED"));
    }

    @Test
    @Order(3)
    public void testCreateDeliveryValidation() {
        // Missing required fields
        String body = "{\\"orderId\\": null}";

        given()
            .contentType(ContentType.JSON)
            .body(body)
            .when().post("/api/deliveries")
            .then()
            .statusCode(400);
    }

    @Test
    @Order(4)
    public void testGetDeliveryNotFound() {
        given()
            .when().get("/api/deliveries/99999")
            .then()
            .statusCode(404);
    }

    @Test
    @Order(5)
    public void testAssignDeliveryPerson() {
        String body = "{\\"deliveryPersonName\\": \\"Ram Bahadur\\", \\"deliveryPersonPhone\\": \\"9841000000\\"}";

        given()
            .contentType(ContentType.JSON)
            .body(body)
            .when().patch("/api/deliveries/1/assign")
            .then()
            .statusCode(anyOf(is(200), is(404)));
    }

    @Test
    @Order(6)
    public void testHealthEndpoint() {
        given()
            .when().get("/q/health")
            .then()
            .statusCode(200)
            .body("status", is("UP"));
    }
}`;
