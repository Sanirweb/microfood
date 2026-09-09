// Order Service Source Code
export const orderServicePom = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.fooddelivery</groupId>
    <artifactId>order-service</artifactId>
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
        <!-- REST Client for calling Menu Service -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-rest-client-reactive-jackson</artifactId>
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

export const orderServiceProperties = `# Order Service Configuration
quarkus.http.port=8082
quarkus.application.name=order-service

# Database Configuration
quarkus.datasource.db-kind=mysql
quarkus.datasource.username=root
quarkus.datasource.password=root123
quarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/food_order_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

# Hibernate Configuration
quarkus.hibernate-orm.database.generation=none
quarkus.hibernate-orm.log.sql=true
quarkus.hibernate-orm.dialect=org.hibernate.dialect.MySQLDialect

# REST Client - Menu Service URL
com.fooddelivery.order.client.MenuServiceClient/mp-rest/url=http://localhost:8081
com.fooddelivery.order.client.MenuServiceClient/mp-rest/scope=jakarta.inject.Singleton

# REST Client - Delivery Service URL
com.fooddelivery.order.client.DeliveryServiceClient/mp-rest/url=http://localhost:8083
com.fooddelivery.order.client.DeliveryServiceClient/mp-rest/scope=jakarta.inject.Singleton

# REST Client Timeout
com.fooddelivery.order.client.MenuServiceClient/mp-rest/connectTimeout=5000
com.fooddelivery.order.client.MenuServiceClient/mp-rest/readTimeout=10000

# OpenAPI / Swagger
quarkus.smallrye-openapi.info-title=Order Service API
quarkus.smallrye-openapi.info-version=1.0.0
quarkus.smallrye-openapi.info-description=Food Delivery - Order Microservice API
quarkus.swagger-ui.always-include=true

# Health
quarkus.smallrye-health.root-path=/q/health

# CORS
quarkus.http.cors=true
quarkus.http.cors.origins=*`;

export const orderEntity = `package com.fooddelivery.order.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Order Entity - Represents a customer order
 * Contains customer info, total amount, and order status
 */
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false, length = 200)
    private String customerName;

    @Column(name = "customer_phone", nullable = false, length = 20)
    private String customerPhone;

    @Column(name = "customer_email", length = 200)
    private String customerEmail;

    @Column(name = "delivery_address", nullable = false, length = 500)
    private String deliveryAddress;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // One Order has many OrderItems
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> items;

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
    public Order() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}`;

export const orderStatusEnum = `package com.fooddelivery.order.entity;

/**
 * Order Status Enum - Defines all possible order states
 * Status transitions must follow logical flow
 */
public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PREPARING,
    READY,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED
}`;

export const orderItemEntity = `package com.fooddelivery.order.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * OrderItem Entity - Represents a single item in an order
 * Stores food details at time of order (price snapshot)
 */
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "food_id", nullable = false)
    private Long foodId;

    @Column(name = "food_name", nullable = false, length = 200)
    private String foodName;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    // Many OrderItems belong to one Order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    // Constructors
    public OrderItem() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFoodId() { return foodId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}`;

export const orderRepository = `package com.fooddelivery.order.repository;

import com.fooddelivery.order.entity.Order;
import com.fooddelivery.order.entity.OrderStatus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

/**
 * Order Repository - Database operations for Order entity
 */
@ApplicationScoped
public class OrderRepository implements PanacheRepository<Order> {

    public List<Order> findByStatus(OrderStatus status) {
        return list("status", status);
    }

    public Optional<Order> findByIdOptional(Long id) {
        return find("id", id).firstResultOptional();
    }

    public List<Order> findByCustomerPhone(String phone) {
        return list("customerPhone", phone);
    }
}`;

export const orderItemRepository = `package com.fooddelivery.order.repository;

import com.fooddelivery.order.entity.OrderItem;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * OrderItem Repository - Database operations for OrderItem entity
 */
@ApplicationScoped
public class OrderItemRepository implements PanacheRepository<OrderItem> {
}`;

export const menuServiceClient = `package com.fooddelivery.order.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

/**
 * MicroProfile REST Client for Menu Service
 * Automatically generates HTTP client from this interface
 * URL is configured in application.properties
 */
@Path("/api/foods")
@RegisterRestClient(configKey = "menu-service")
public interface MenuServiceClient {

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    FoodDTO getFoodById(@PathParam("id") Long id);
}

/**
 * DTO for receiving food data from Menu Service
 */
class FoodDTO {
    public Long id;
    public String name;
    public String description;
    public Double price;
    public boolean available;
}`;

export const deliveryServiceClient = `package com.fooddelivery.order.client;

import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

/**
 * MicroProfile REST Client for Delivery Service
 * Used to create delivery records when orders are confirmed
 */
@Path("/api/deliveries")
@RegisterRestClient(configKey = "delivery-service")
public interface DeliveryServiceClient {

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    DeliveryDTO createDelivery(DeliveryRequest request);
}

class DeliveryRequest {
    public Long orderId;
    public String deliveryAddress;
}

class DeliveryDTO {
    public Long id;
    public Long orderId;
    public String status;
}`;

export const orderDto = `package com.fooddelivery.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

/**
 * Order Request DTO - Input for creating orders
 * Client sends food IDs and quantities; backend calculates prices
 */
public class OrderRequest {

    @NotBlank(message = "Customer name is required")
    @Size(min = 2, max = 200)
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be 10-15 digits")
    private String customerPhone;

    @Email(message = "Invalid email format")
    private String customerEmail;

    @NotBlank(message = "Delivery address is required")
    @Size(min = 5, max = 500)
    private String deliveryAddress;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;

    // Getters and Setters
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}`;

export const orderItemDto = `package com.fooddelivery.order.dto;

import jakarta.validation.constraints.*;

/**
 * OrderItem Request DTO - Each item in an order request
 * Client sends foodId and quantity; price comes from Menu Service
 */
public class OrderItemRequest {

    @NotNull(message = "Food ID is required")
    private Long foodId;

    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 100, message = "Quantity cannot exceed 100")
    private int quantity;

    // Getters and Setters
    public Long getFoodId() { return foodId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}`;

export const orderResponseDto = `package com.fooddelivery.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Order Response DTO - Complete order information returned to client
 */
public class OrderResponse {

    private Long id;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String deliveryAddress;
    private BigDecimal totalAmount;
    private String status;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}`;

export const orderItemResponseDto = `package com.fooddelivery.order.dto;

import java.math.BigDecimal;

/**
 * OrderItem Response DTO - Item details in order response
 */
public class OrderItemResponse {

    private Long foodId;
    private String foodName;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

    // Getters and Setters
    public Long getFoodId() { return foodId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}`;

export const orderServiceClass = `package com.fooddelivery.order.service;

import com.fooddelivery.order.client.*;
import com.fooddelivery.order.dto.*;
import com.fooddelivery.order.entity.*;
import com.fooddelivery.order.exception.*;
import com.fooddelivery.order.repository.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Order Service - Core business logic for order management
 * Communicates with Menu Service to verify food and get prices
 * Communicates with Delivery Service to create deliveries
 */
@ApplicationScoped
public class OrderService {

    private static final Logger LOG = Logger.getLogger(OrderService.class);

    @Inject
    OrderRepository orderRepository;

    @Inject
    @RestClient
    MenuServiceClient menuServiceClient;

    @Inject
    @RestClient
    DeliveryServiceClient deliveryServiceClient;

    public List<OrderResponse> getAllOrders() {
        return orderRepository.listAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return toResponse(order);
    }

    public List<OrderResponse> getOrdersByStatus(String status) {
        OrderStatus orderStatus;
        try {
            orderStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status);
        }
        return orderRepository.findByStatus(orderStatus).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Create Order - Core business logic:
     * 1. Verify each food item exists and is available (via Menu Service)
     * 2. Get current prices from Menu Service (do NOT trust client prices)
     * 3. Calculate subtotals and total
     * 4. Save order and items
     */
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        LOG.infof("Creating order for customer: %s", request.getCustomerName());

        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // Verify each food item and calculate prices
        for (OrderItemRequest itemRequest : request.getItems()) {
            // Call Menu Service to get food details and current price
            FoodDTO food;
            try {
                food = menuServiceClient.getFoodById(itemRequest.getFoodId());
            } catch (Exception e) {
                LOG.errorf("Failed to contact Menu Service for food ID: %d", itemRequest.getFoodId());
                throw new ServiceUnavailableException("Menu Service is currently unavailable");
            }

            if (food == null) {
                throw new BadRequestException("Food item not found with id: " + itemRequest.getFoodId());
            }

            if (!food.available) {
                throw new BadRequestException("Food item '" + food.name + "' is currently unavailable");
            }

            // Create order item with verified price
            OrderItem orderItem = new OrderItem();
            orderItem.setFoodId(food.id);
            orderItem.setFoodName(food.name);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(BigDecimal.valueOf(food.price));
            orderItem.setSubtotal(BigDecimal.valueOf(food.price).multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
            orderItem.setOrder(order);

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(orderItem.getSubtotal());
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);
        orderRepository.persist(order);

        LOG.infof("Order created successfully with ID: %d, Total: %s", order.getId(), totalAmount);

        return toResponse(order);
    }

    /**
     * Update order status with validation of transitions
     */
    @Transactional
    public OrderResponse updateOrderStatus(Long id, String newStatus) {
        Order order = orderRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        OrderStatus status;
        try {
            status = OrderStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + newStatus);
        }

        // Validate status transitions
        validateStatusTransition(order.getStatus(), status);

        order.setStatus(status);
        orderRepository.persist(order);

        // If order becomes CONFIRMED, notify Delivery Service
        if (status == OrderStatus.CONFIRMED) {
            try {
                DeliveryRequest deliveryRequest = new DeliveryRequest();
                deliveryRequest.orderId = order.getId();
                deliveryRequest.deliveryAddress = order.getDeliveryAddress();
                deliveryServiceClient.createDelivery(deliveryRequest);
                LOG.infof("Delivery created for order: %d", id);
            } catch (Exception e) {
                LOG.warnf("Failed to create delivery for order %d: %s", id, e.getMessage());
            }
        }

        return toResponse(order);
    }

    @Transactional
    public OrderResponse updateOrder(Long id, OrderRequest request) {
        Order order = orderRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot modify a " + order.getStatus() + " order");
        }

        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setDeliveryAddress(request.getDeliveryAddress());

        orderRepository.persist(order);
        return toResponse(order);
    }

    @Transactional
    public void cancelOrder(Long id) {
        Order order = orderRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel a delivered order");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.persist(order);
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        // Cannot change delivered or cancelled orders
        if (current == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot change status of a delivered order");
        }
        if (current == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot change status of a cancelled order");
        }
        // Cannot go from OUT_FOR_DELIVERY back to PENDING
        if (current == OrderStatus.OUT_FOR_DELIVERY && next == OrderStatus.PENDING) {
            throw new BadRequestException("Invalid status transition");
        }
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCustomerName(order.getCustomerName());
        response.setCustomerPhone(order.getCustomerPhone());
        response.setCustomerEmail(order.getCustomerEmail());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus().name());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        if (order.getItems() != null) {
            response.setItems(order.getItems().stream()
                    .map(item -> {
                        OrderItemResponse itemResponse = new OrderItemResponse();
                        itemResponse.setFoodId(item.getFoodId());
                        itemResponse.setFoodName(item.getFoodName());
                        itemResponse.setQuantity(item.getQuantity());
                        itemResponse.setUnitPrice(item.getUnitPrice());
                        itemResponse.setSubtotal(item.getSubtotal());
                        return itemResponse;
                    })
                    .collect(Collectors.toList()));
        }

        return response;
    }
}`;

export const orderController = `package com.fooddelivery.order.controller;

import com.fooddelivery.order.dto.*;
import com.fooddelivery.order.service.*;
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
 * Order Controller - REST endpoints for order operations
 */
@Path("/api/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Order", description = "Order management operations")
public class OrderController {

    @Inject
    OrderService orderService;

    @GET
    @Operation(summary = "Get all orders")
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get order by ID")
    public OrderResponse getOrderById(@PathParam("id") Long id) {
        return orderService.getOrderById(id);
    }

    @GET
    @Path("/status/{status}")
    @Operation(summary = "Get orders by status")
    public List<OrderResponse> getOrdersByStatus(@PathParam("status") String status) {
        return orderService.getOrdersByStatus(status);
    }

    @POST
    @Operation(summary = "Create a new order")
    public Response createOrder(@Valid OrderRequest request) {
        OrderResponse created = orderService.createOrder(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update an order")
    public OrderResponse updateOrder(@PathParam("id") Long id, @Valid OrderRequest request) {
        return orderService.updateOrder(id, request);
    }

    @PATCH
    @Path("/{id}/status")
    @Operation(summary = "Update order status")
    public OrderResponse updateOrderStatus(@PathParam("id") Long id, Map<String, String> body) {
        String status = body.get("status");
        return orderService.updateOrderStatus(id, status);
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Cancel an order")
    public Response cancelOrder(@PathParam("id") Long id) {
        orderService.cancelOrder(id);
        return Response.noContent().build();
    }
}`;

export const orderExceptionClasses = `package com.fooddelivery.order.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

---

package com.fooddelivery.order.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}

---

package com.fooddelivery.order.exception;

public class ServiceUnavailableException extends RuntimeException {
    public ServiceUnavailableException(String message) {
        super(message);
    }
}

---

package com.fooddelivery.order.exception;

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

        if (exception instanceof ServiceUnavailableException) {
            errorResponse.put("status", 503);
            errorResponse.put("error", "Service Unavailable");
            errorResponse.put("message", exception.getMessage());
            return Response.status(503).entity(errorResponse).build();
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

export const orderHealthCheck = `package com.fooddelivery.order.health;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;
import org.eclipse.microprofile.health.Readiness;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class OrderHealthChecks {

    @Liveness
    @ApplicationScoped
    public static class OrderLivenessCheck implements HealthCheck {
        @Override
        public HealthCheckResponse call() {
            return HealthCheckResponse.up("Order Service is running");
        }
    }

    @Readiness
    @ApplicationScoped
    public static class OrderReadinessCheck implements HealthCheck {
        @Inject
        EntityManager entityManager;

        @Override
        public HealthCheckResponse call() {
            try {
                entityManager.createNativeQuery("SELECT 1").getSingleResult();
                return HealthCheckResponse.named("Database connection")
                        .up()
                        .withData("database", "food_order_db")
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

export const orderServiceTest = `package com.fooddelivery.order;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class OrderServiceTest {

    @Test
    @Order(1)
    public void testGetAllOrders() {
        given()
            .when().get("/api/orders")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON);
    }

    @Test
    @Order(2)
    public void testCreateOrderValidation() {
        // Empty order should fail validation
        String body = "{\\"customerName\\": \\"\\", \\"items\\": []}";

        given()
            .contentType(ContentType.JSON)
            .body(body)
            .when().post("/api/orders")
            .then()
            .statusCode(400);
    }

    @Test
    @Order(3)
    public void testGetOrderNotFound() {
        given()
            .when().get("/api/orders/99999")
            .then()
            .statusCode(404);
    }

    @Test
    @Order(4)
    public void testGetOrdersByStatus() {
        given()
            .when().get("/api/orders/status/PENDING")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON);
    }

    @Test
    @Order(5)
    public void testInvalidStatus() {
        String body = "{\\"status\\": \\"INVALID_STATUS\\"}";

        given()
            .contentType(ContentType.JSON)
            .body(body)
            .when().patch("/api/orders/1/status")
            .then()
            .statusCode(anyOf(is(400), is(404)));
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
