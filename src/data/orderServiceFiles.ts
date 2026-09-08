export const orderServiceFiles: Record<string, string> = {
  "order-service/pom.xml": `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.fooddelivery</groupId>
    <artifactId>order-service</artifactId>
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
        <!-- REST Client for calling Menu Service -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-rest-client-jackson</artifactId>
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

  "order-service/src/main/resources/application.properties": `# Order Service Configuration
quarkus.http.port=8082
quarkus.http.cors=true
quarkus.http.cors.origins=*

# MySQL Database
quarkus.datasource.db-kind=mysql
quarkus.datasource.username=root
quarkus.datasource.password=root
quarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/food_order_db?useSSL=false&allowPublicKeyRetrieval=true

# Hibernate
quarkus.hibernate-orm.database.generation=none
quarkus.hibernate-orm.log.sql=true

# REST Client - Menu Service
com.fooddelivery.order.client.MenuServiceClient/mp-rest/url=http://localhost:8081
com.fooddelivery.order.client.MenuServiceClient/mp-rest/scope=jakarta.inject.Singleton

# REST Client - Delivery Service
com.fooddelivery.order.client.DeliveryServiceClient/mp-rest/url=http://localhost:8083
com.fooddelivery.order.client.DeliveryServiceClient/mp-rest/scope=jakarta.inject.Singleton

# OpenAPI
quarkus.smallrye-openapi.info-title=Order Service API
quarkus.smallrye-openapi.info-version=1.0.0
quarkus.smallrye-openapi.info-description=Order Microservice for Food Delivery System
quarkus.swagger-ui.always-include=true`,

  "order-service/src/main/java/com/fooddelivery/order/entity/Order.java": `package com.fooddelivery.order.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Order entity - represents a customer order.
 * Contains customer info, total amount, and order status.
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

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> items = new ArrayList<>();

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

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}`,

  "order-service/src/main/java/com/fooddelivery/order/entity/OrderItem.java": `package com.fooddelivery.order.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * OrderItem entity - represents a single item in an order.
 * Stores food details at time of order (price snapshot).
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

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
}`,

  "order-service/src/main/java/com/fooddelivery/order/entity/OrderStatus.java": `package com.fooddelivery.order.entity;

/**
 * Enum representing all possible order states.
 * Status transitions must follow logical flow.
 */
public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PREPARING,
    READY,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED
}`,

  "order-service/src/main/java/com/fooddelivery/order/dto/OrderRequest.java": `package com.fooddelivery.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

/**
 * DTO for creating/updating an order.
 * Client sends food IDs and quantities; backend calculates prices.
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
}`,

  "order-service/src/main/java/com/fooddelivery/order/dto/OrderItemRequest.java": `package com.fooddelivery.order.dto;

import jakarta.validation.constraints.*;

/**
 * DTO for each item in an order request.
 * Client sends foodId and quantity; price comes from Menu Service.
 */
public class OrderItemRequest {

    @NotNull(message = "Food ID is required")
    private Long foodId;

    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 100, message = "Quantity cannot exceed 100")
    private int quantity;

    public Long getFoodId() { return foodId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}`,

  "order-service/src/main/java/com/fooddelivery/order/dto/OrderResponse.java": `package com.fooddelivery.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for returning complete order information.
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
}`,

  "order-service/src/main/java/com/fooddelivery/order/dto/OrderItemResponse.java": `package com.fooddelivery.order.dto;

import java.math.BigDecimal;

/**
 * DTO for returning order item information.
 */
public class OrderItemResponse {

    private Long foodId;
    private String foodName;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

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
}`,

  "order-service/src/main/java/com/fooddelivery/order/dto/StatusUpdateRequest.java": `package com.fooddelivery.order.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for updating order status.
 */
public class StatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}`,

  "order-service/src/main/java/com/fooddelivery/order/client/MenuServiceClient.java": `package com.fooddelivery.order.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

/**
 * MicroProfile REST Client for Menu Service.
 * Used to fetch food details and prices when creating orders.
 * URL is configured in application.properties.
 */
@Path("/api/foods")
@RegisterRestClient
public interface MenuServiceClient {

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    FoodDTO getFoodById(@PathParam("id") Long id);
}`,

  "order-service/src/main/java/com/fooddelivery/order/client/FoodDTO.java": `package com.fooddelivery.order.client;

/**
 * DTO for receiving food data from Menu Service.
 * Contains only the fields needed for order processing.
 */
public class FoodDTO {
    private Long id;
    private String name;
    private Double price;
    private boolean available;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}`,

  "order-service/src/main/java/com/fooddelivery/order/client/DeliveryServiceClient.java": `package com.fooddelivery.order.client;

import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

/**
 * MicroProfile REST Client for Delivery Service.
 * Used to create delivery records when orders are confirmed.
 */
@Path("/api/deliveries")
@RegisterRestClient
public interface DeliveryServiceClient {

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    Object createDelivery(DeliveryRequest request);
}`,

  "order-service/src/main/java/com/fooddelivery/order/client/DeliveryRequest.java": `package com.fooddelivery.order.client;

/**
 * DTO for creating a delivery via Delivery Service.
 */
public class DeliveryRequest {
    private Long orderId;
    private String deliveryAddress;

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
}`,

  "order-service/src/main/java/com/fooddelivery/order/repository/OrderRepository.java": `package com.fooddelivery.order.repository;

import com.fooddelivery.order.entity.Order;
import com.fooddelivery.order.entity.OrderStatus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

/**
 * Repository for Order entity.
 * Provides custom queries for orders.
 */
@ApplicationScoped
public class OrderRepository implements PanacheRepository<Order> {

    public List<Order> findByStatus(OrderStatus status) {
        return list("status", status);
    }

    public List<Order> findByCustomerPhone(String phone) {
        return list("customerPhone", phone);
    }
}`,

  "order-service/src/main/java/com/fooddelivery/order/repository/OrderItemRepository.java": `package com.fooddelivery.order.repository;

import com.fooddelivery.order.entity.OrderItem;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * Repository for OrderItem entity.
 */
@ApplicationScoped
public class OrderItemRepository implements PanacheRepository<OrderItem> {
}`,

  "order-service/src/main/java/com/fooddelivery/order/service/OrderService.java": `package com.fooddelivery.order.service;

import com.fooddelivery.order.client.*;
import com.fooddelivery.order.dto.*;
import com.fooddelivery.order.entity.*;
import com.fooddelivery.order.exception.*;
import com.fooddelivery.order.repository.OrderRepository;
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
 * Service class for Order business logic.
 * Communicates with Menu Service to verify food and get prices.
 * Communicates with Delivery Service to create deliveries.
 */
@ApplicationScoped
public class OrderService {

    @Inject
    OrderRepository orderRepository;

    @Inject
    @RestClient
    MenuServiceClient menuServiceClient;

    @Inject
    @RestClient
    DeliveryServiceClient deliveryServiceClient;

    @Inject
    Logger logger;

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id);
        if (order == null) {
            throw new ResourceNotFoundException("Order not found with id: " + id);
        }
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
        logger.infof("Creating order for customer: %s", request.getCustomerName());

        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            // Call Menu Service to get food details and current price
            FoodDTO food;
            try {
                food = menuServiceClient.getFoodById(itemRequest.getFoodId());
            } catch (Exception e) {
                logger.errorf("Failed to contact Menu Service for food ID: %d", itemRequest.getFoodId());
                throw new ServiceUnavailableException("Menu Service is currently unavailable");
            }

            if (food == null) {
                throw new BadRequestException("Food item not found with id: " + itemRequest.getFoodId());
            }

            if (!food.isAvailable()) {
                throw new BadRequestException("Food item '" + food.getName() + "' is currently unavailable");
            }

            // Create order item with verified price
            OrderItem orderItem = new OrderItem();
            orderItem.setFoodId(food.getId());
            orderItem.setFoodName(food.getName());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(BigDecimal.valueOf(food.getPrice()));
            orderItem.setSubtotal(BigDecimal.valueOf(food.getPrice())
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
            orderItem.setOrder(order);

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(orderItem.getSubtotal());
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);
        orderRepository.persist(order);

        logger.infof("Order created successfully with ID: %d, Total: %s", order.getId(), totalAmount);
        return toResponse(order);
    }

    /**
     * Update order status with validation of transitions
     */
    @Transactional
    public OrderResponse updateOrderStatus(Long id, StatusUpdateRequest request) {
        Order order = orderRepository.findById(id);
        if (order == null) {
            throw new ResourceNotFoundException("Order not found with id: " + id);
        }

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + request.getStatus());
        }

        validateStatusTransition(order.getStatus(), newStatus);
        order.setStatus(newStatus);

        // If order becomes CONFIRMED, notify Delivery Service
        if (newStatus == OrderStatus.CONFIRMED) {
            try {
                DeliveryRequest deliveryRequest = new DeliveryRequest();
                deliveryRequest.setOrderId(order.getId());
                deliveryRequest.setDeliveryAddress(order.getDeliveryAddress());
                deliveryServiceClient.createDelivery(deliveryRequest);
                logger.infof("Delivery created for order: %d", id);
            } catch (Exception e) {
                logger.warnf("Failed to create delivery for order %d: %s", id, e.getMessage());
            }
        }

        logger.infof("Order %d status updated to: %s", id, newStatus);
        return toResponse(order);
    }

    @Transactional
    public void cancelOrder(Long id) {
        Order order = orderRepository.findById(id);
        if (order == null) {
            throw new ResourceNotFoundException("Order not found with id: " + id);
        }
        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel a delivered order");
        }
        order.setStatus(OrderStatus.CANCELLED);
        logger.infof("Order %d cancelled", id);
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        if (current == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot change status of a delivered order");
        }
        if (current == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot change status of a cancelled order");
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
}`,

  "order-service/src/main/java/com/fooddelivery/order/controller/OrderController.java": `package com.fooddelivery.order.controller;

import com.fooddelivery.order.dto.*;
import com.fooddelivery.order.service.OrderService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;

/**
 * REST controller for Order operations.
 */
@Path("/api/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Orders", description = "Order management operations")
public class OrderController {

    @Inject
    OrderService orderService;

    @GET
    @Operation(summary = "Get all orders")
    public Response getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return Response.ok(orders).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get order by ID")
    public Response getOrderById(@PathParam("id") Long id) {
        OrderResponse order = orderService.getOrderById(id);
        return Response.ok(order).build();
    }

    @GET
    @Path("/status/{status}")
    @Operation(summary = "Get orders by status")
    public Response getOrdersByStatus(@PathParam("status") String status) {
        List<OrderResponse> orders = orderService.getOrdersByStatus(status);
        return Response.ok(orders).build();
    }

    @POST
    @Operation(summary = "Create a new order")
    public Response createOrder(@Valid OrderRequest request) {
        OrderResponse order = orderService.createOrder(request);
        return Response.status(Response.Status.CREATED).entity(order).build();
    }

    @PATCH
    @Path("/{id}/status")
    @Operation(summary = "Update order status")
    public Response updateOrderStatus(@PathParam("id") Long id, @Valid StatusUpdateRequest request) {
        OrderResponse order = orderService.updateOrderStatus(id, request);
        return Response.ok(order).build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Cancel an order")
    public Response cancelOrder(@PathParam("id") Long id) {
        orderService.cancelOrder(id);
        return Response.noContent().build();
    }
}`,

  "order-service/src/main/java/com/fooddelivery/order/exception/ResourceNotFoundException.java": `package com.fooddelivery.order.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}`,

  "order-service/src/main/java/com/fooddelivery/order/exception/BadRequestException.java": `package com.fooddelivery.order.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}`,

  "order-service/src/main/java/com/fooddelivery/order/exception/ServiceUnavailableException.java": `package com.fooddelivery.order.exception;

public class ServiceUnavailableException extends RuntimeException {
    public ServiceUnavailableException(String message) {
        super(message);
    }
}`,

  "order-service/src/main/java/com/fooddelivery/order/exception/ErrorResponse.java": `package com.fooddelivery.order.exception;

import java.time.LocalDateTime;

public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;

    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

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

  "order-service/src/main/java/com/fooddelivery/order/exception/GlobalExceptionHandler.java": `package com.fooddelivery.order.exception;

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
            ErrorResponse error = new ErrorResponse(404, "Not Found", exception.getMessage(), "/api/orders");
            return Response.status(Response.Status.NOT_FOUND).entity(error).build();
        }

        if (exception instanceof BadRequestException) {
            ErrorResponse error = new ErrorResponse(400, "Bad Request", exception.getMessage(), "/api/orders");
            return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
        }

        if (exception instanceof ServiceUnavailableException) {
            ErrorResponse error = new ErrorResponse(503, "Service Unavailable", exception.getMessage(), "/api/orders");
            return Response.status(Response.Status.SERVICE_UNAVAILABLE).entity(error).build();
        }

        if (exception instanceof jakarta.validation.ConstraintViolationException) {
            jakarta.validation.ConstraintViolationException cve = (jakarta.validation.ConstraintViolationException) exception;
            String messages = cve.getConstraintViolations().stream()
                .map(v -> v.getMessage())
                .collect(Collectors.joining(", "));
            ErrorResponse error = new ErrorResponse(400, "Bad Request", messages, "/api/orders");
            return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
        }

        if (exception instanceof jakarta.ws.rs.WebApplicationException) {
            return ((jakarta.ws.rs.WebApplicationException) exception).getResponse();
        }

        logger.error("Unhandled exception", exception);
        ErrorResponse error = new ErrorResponse(500, "Internal Server Error", "An unexpected error occurred", "/api/orders");
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
    }
}`,

  "order-service/src/main/java/com/fooddelivery/order/health/OrderServiceHealthCheck.java": `package com.fooddelivery.order.health;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;
import jakarta.enterprise.context.ApplicationScoped;

@Liveness
@ApplicationScoped
public class OrderServiceHealthCheck implements HealthCheck {

    @Override
    public HealthCheckResponse call() {
        return HealthCheckResponse.named("Order Service Liveness")
                .up()
                .build();
    }
}`,

  "order-service/src/main/java/com/fooddelivery/order/health/OrderServiceReadinessCheck.java": `package com.fooddelivery.order.health;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Readiness;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import javax.sql.DataSource;
import java.sql.Connection;

@Readiness
@ApplicationScoped
public class OrderServiceReadinessCheck implements HealthCheck {

    @Inject
    DataSource dataSource;

    @Override
    public HealthCheckResponse call() {
        try (Connection connection = dataSource.getConnection()) {
            boolean valid = connection.isValid(2);
            return HealthCheckResponse.named("Order Service Database Readiness")
                    .status(valid)
                    .withData("database", "MySQL")
                    .build();
        } catch (Exception e) {
            return HealthCheckResponse.named("Order Service Database Readiness")
                    .down()
                    .withData("error", e.getMessage())
                    .build();
        }
    }
}`,

  "order-service/src/test/java/com/fooddelivery/order/OrderControllerTest.java": `package com.fooddelivery.order;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
public class OrderControllerTest {

    @Test
    public void testGetAllOrders() {
        given()
            .when().get("/api/orders")
            .then()
            .statusCode(200);
    }

    @Test
    public void testGetOrderNotFound() {
        given()
            .when().get("/api/orders/99999")
            .then()
            .statusCode(404);
    }

    @Test
    public void testGetOrdersByStatus() {
        given()
            .when().get("/api/orders/status/PENDING")
            .then()
            .statusCode(200);
    }

    @Test
    public void testCreateOrderValidation() {
        String json = "{\\"customerName\\": \\"\\", \\"items\\": []}";
        given()
            .contentType("application/json")
            .body(json)
            .when().post("/api/orders")
            .then()
            .statusCode(400);
    }
}`,

  "order-service/src/test/java/com/fooddelivery/order/HealthCheckTest.java": `package com.fooddelivery.order;

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

  "order-service/Dockerfile": `FROM quay.io/quarkus/ubi-quarkus-mandrel-builder-image:23.1-java17 AS build
COPY --chown=quarkus:quarkus . /code/
RUN mvn -f /code/pom.xml package -DskipTests
FROM quay.io/quarkus/quarkus-micro-image:2.0
WORKDIR /work/
COPY --from=build /code/target/quarkus-app/lib/ /work/lib/
COPY --from=build /code/target/quarkus-app/*.jar /work/
COPY --from=build /code/target/quarkus-app/app/ /work/app/
COPY --from=build /code/target/quarkus-app/quarkus/ /work/quarkus/
EXPOSE 8082
CMD ["java", "-jar", "quarkus-run.jar"]`
};
