// Menu Service Source Code
export const menuServicePom = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.fooddelivery</groupId>
    <artifactId>menu-service</artifactId>
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
        <!-- Quarkus RESTEasy Reactive -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-resteasy-reactive-jackson</artifactId>
        </dependency>

        <!-- Hibernate ORM with Panache -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-hibernate-orm-panache</artifactId>
        </dependency>

        <!-- MySQL Driver -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-jdbc-mysql</artifactId>
        </dependency>

        <!-- Hibernate Validator -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-hibernate-validator</artifactId>
        </dependency>

        <!-- SmallRye Health (MicroProfile Health) -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-smallrye-health</artifactId>
        </dependency>

        <!-- OpenAPI / Swagger -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-smallrye-openapi</artifactId>
        </dependency>

        <!-- Arc (CDI) -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-arc</artifactId>
        </dependency>

        <!-- Testing -->
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

export const menuServiceProperties = `# Menu Service Configuration
quarkus.http.port=8081
quarkus.application.name=menu-service

# Database Configuration
quarkus.datasource.db-kind=mysql
quarkus.datasource.username=root
quarkus.datasource.password=root123
quarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/food_menu_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

# Hibernate Configuration
quarkus.hibernate-orm.database.generation=none
quarkus.hibernate-orm.log.sql=true
quarkus.hibernate-orm.dialect=org.hibernate.dialect.MySQLDialect

# OpenAPI / Swagger
quarkus.smallrye-openapi.info-title=Menu Service API
quarkus.smallrye-openapi.info-version=1.0.0
quarkus.smallrye-openapi.info-description=Food Delivery - Menu Microservice API
quarkus.swagger-ui.always-include=true

# Health
quarkus.smallrye-health.root-path=/q/health

# CORS
quarkus.http.cors=true
quarkus.http.cors.origins=*`;

export const categoryEntity = `package com.fooddelivery.menu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Category Entity - Represents a food category (e.g., Pizza, Burger, Momo)
 * Uses JPA annotations for database mapping
 */
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // One Category has many Food items
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Food> foods;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Constructors
    public Category() {}

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Food> getFoods() { return foods; }
    public void setFoods(List<Food> foods) { this.foods = foods; }
}`;

export const foodEntity = `package com.fooddelivery.menu.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Food Entity - Represents a food item in the menu
 * Linked to a Category via ManyToOne relationship
 */
@Entity
@Table(name = "foods")
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private boolean available = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Many Foods belong to one Category
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

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
    public Food() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}`;

export const categoryRepository = `package com.fooddelivery.menu.repository;

import com.fooddelivery.menu.entity.Category;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

/**
 * Category Repository - Handles database operations for Category entity
 * Extends PanacheRepository for built-in CRUD operations
 */
@ApplicationScoped
public class CategoryRepository implements PanacheRepository<Category> {

    public Optional<Category> findByName(String name) {
        return find("name", name).firstResultOptional();
    }

    public boolean existsByName(String name) {
        return find("name", name).count() > 0;
    }

    public Optional<Category> findByIdOptional(Long id) {
        return find("id", id).firstResultOptional();
    }
}`;

export const foodRepository = `package com.fooddelivery.menu.repository;

import com.fooddelivery.menu.entity.Food;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

/**
 * Food Repository - Handles database operations for Food entity
 * Provides custom queries beyond basic CRUD
 */
@ApplicationScoped
public class FoodRepository implements PanacheRepository<Food> {

    public List<Food> findByCategoryId(Long categoryId) {
        return list("category.id", categoryId);
    }

    public List<Food> findAvailable() {
        return list("available", true);
    }

    public Optional<Food> findByIdOptional(Long id) {
        return find("id", id).firstResultOptional();
    }

    public boolean existsByName(String name) {
        return find("name", name).count() > 0;
    }
}`;

export const foodDto = `package com.fooddelivery.menu.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * Food Request DTO - Used for creating/updating food items
 * Contains validation annotations for input validation
 */
public class FoodRequest {

    @NotBlank(message = "Food name is required")
    @Size(min = 2, max = 200, message = "Food name must be between 2 and 200 characters")
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private String imageUrl;
    private Boolean available;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
}`;

export const foodResponseDto = `package com.fooddelivery.menu.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Food Response DTO - Used for returning food data in API responses
 * Separates response format from database entity structure
 */
public class FoodResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private boolean available;
    private CategoryResponse category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public CategoryResponse getCategory() { return category; }
    public void setCategory(CategoryResponse category) { this.category = category; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}`;

export const categoryDto = `package com.fooddelivery.menu.dto;

import jakarta.validation.constraints.*;

/**
 * Category Request DTO - Used for creating/updating categories
 */
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 100, message = "Category name must be between 2 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}`;

export const categoryResponseDto = `package com.fooddelivery.menu.dto;

import java.time.LocalDateTime;

/**
 * Category Response DTO - Used for returning category data in API responses
 */
public class CategoryResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}`;

export const foodMapper = `package com.fooddelivery.menu.mapper;

import com.fooddelivery.menu.dto.*;
import com.fooddelivery.menu.entity.*;
import org.springframework.stereotype.Component;

/**
 * Food Mapper - Converts between Food entities and DTOs
 * Keeps conversion logic separate from business logic
 */
public class FoodMapper {

    public static FoodResponse toResponse(Food food) {
        if (food == null) return null;

        FoodResponse response = new FoodResponse();
        response.setId(food.getId());
        response.setName(food.getName());
        response.setDescription(food.getDescription());
        response.setPrice(food.getPrice());
        response.setImageUrl(food.getImageUrl());
        response.setAvailable(food.isAvailable());
        response.setCreatedAt(food.getCreatedAt());
        response.setUpdatedAt(food.getUpdatedAt());

        if (food.getCategory() != null) {
            CategoryResponse catResponse = new CategoryResponse();
            catResponse.setId(food.getCategory().getId());
            catResponse.setName(food.getCategory().getName());
            catResponse.setDescription(food.getCategory().getDescription());
            catResponse.setCreatedAt(food.getCategory().getCreatedAt());
            response.setCategory(catResponse);
        }

        return response;
    }

    public static Food toEntity(FoodRequest request, Category category) {
        Food food = new Food();
        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setImageUrl(request.getImageUrl());
        food.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);
        food.setCategory(category);
        return food;
    }

    public static void updateEntity(Food food, FoodRequest request, Category category) {
        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setImageUrl(request.getImageUrl());
        if (request.getAvailable() != null) {
            food.setAvailable(request.getAvailable());
        }
        food.setCategory(category);
    }
}`;

export const categoryMapper = `package com.fooddelivery.menu.mapper;

import com.fooddelivery.menu.dto.*;
import com.fooddelivery.menu.entity.*;

/**
 * Category Mapper - Converts between Category entities and DTOs
 */
public class CategoryMapper {

    public static CategoryResponse toResponse(Category category) {
        if (category == null) return null;

        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setCreatedAt(category.getCreatedAt());
        return response;
    }

    public static Category toEntity(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return category;
    }

    public static void updateEntity(Category category, CategoryRequest request) {
        category.setName(request.getName());
        category.setDescription(request.getDescription());
    }
}`;

export const menuServiceClass = `package com.fooddelivery.menu.service;

import com.fooddelivery.menu.dto.*;
import com.fooddelivery.menu.entity.*;
import com.fooddelivery.menu.mapper.*;
import com.fooddelivery.menu.repository.*;
import com.fooddelivery.menu.exception.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Food Service - Contains business logic for food operations
 * Controllers call this service, which uses repositories for data access
 */
@ApplicationScoped
public class FoodService {

    @Inject
    FoodRepository foodRepository;

    @Inject
    CategoryRepository categoryRepository;

    public List<FoodResponse> getAllFoods() {
        return foodRepository.listAll().stream()
                .map(FoodMapper::toResponse)
                .collect(Collectors.toList());
    }

    public FoodResponse getFoodById(Long id) {
        Food food = foodRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
        return FoodMapper.toResponse(food);
    }

    public List<FoodResponse> getFoodsByCategory(Long categoryId) {
        // Verify category exists
        categoryRepository.findByIdOptional(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        return foodRepository.findByCategoryId(categoryId).stream()
                .map(FoodMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<FoodResponse> getAvailableFoods() {
        return foodRepository.findAvailable().stream()
                .map(FoodMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FoodResponse createFood(FoodRequest request) {
        // Check if food name already exists
        if (foodRepository.existsByName(request.getName())) {
            throw new ConflictException("Food item with name '" + request.getName() + "' already exists");
        }

        // Verify category exists
        Category category = categoryRepository.findByIdOptional(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Food food = FoodMapper.toEntity(request, category);
        foodRepository.persist(food);
        return FoodMapper.toResponse(food);
    }

    @Transactional
    public FoodResponse updateFood(Long id, FoodRequest request) {
        Food food = foodRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));

        // Verify category exists
        Category category = categoryRepository.findByIdOptional(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        FoodMapper.updateEntity(food, request, category);
        foodRepository.persist(food);
        return FoodMapper.toResponse(food);
    }

    @Transactional
    public void deleteFood(Long id) {
        Food food = foodRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
        foodRepository.delete(food);
    }

    @Transactional
    public FoodResponse updateAvailability(Long id, boolean available) {
        Food food = foodRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
        food.setAvailable(available);
        foodRepository.persist(food);
        return FoodMapper.toResponse(food);
    }
}`;

export const categoryServiceClass = `package com.fooddelivery.menu.service;

import com.fooddelivery.menu.dto.*;
import com.fooddelivery.menu.entity.*;
import com.fooddelivery.menu.mapper.*;
import com.fooddelivery.menu.repository.*;
import com.fooddelivery.menu.exception.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Category Service - Contains business logic for category operations
 */
@ApplicationScoped
public class CategoryService {

    @Inject
    CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.listAll().stream()
                .map(CategoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return CategoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new ConflictException("Category with name '" + request.getName() + "' already exists");
        }

        Category category = CategoryMapper.toEntity(request);
        categoryRepository.persist(category);
        return CategoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        CategoryMapper.updateEntity(category, request);
        categoryRepository.persist(category);
        return CategoryMapper.toResponse(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        categoryRepository.delete(category);
    }
}`;

export const menuController = `package com.fooddelivery.menu.controller;

import com.fooddelivery.menu.dto.*;
import com.fooddelivery.menu.service.*;
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
 * Food Controller - REST endpoints for food operations
 * Handles HTTP requests and delegates to FoodService
 */
@Path("/api/foods")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Food", description = "Food item management operations")
public class FoodController {

    @Inject
    FoodService foodService;

    @GET
    @Operation(summary = "Get all food items")
    public List<FoodResponse> getAllFoods() {
        return foodService.getAllFoods();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get food item by ID")
    public FoodResponse getFoodById(@PathParam("id") Long id) {
        return foodService.getFoodById(id);
    }

    @GET
    @Path("/category/{categoryId}")
    @Operation(summary = "Get food items by category")
    public List<FoodResponse> getFoodsByCategory(@PathParam("categoryId") Long categoryId) {
        return foodService.getFoodsByCategory(categoryId);
    }

    @GET
    @Path("/available")
    @Operation(summary = "Get all available food items")
    public List<FoodResponse> getAvailableFoods() {
        return foodService.getAvailableFoods();
    }

    @POST
    @Operation(summary = "Create a new food item")
    public Response createFood(@Valid FoodRequest request) {
        FoodResponse created = foodService.createFood(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update a food item")
    public FoodResponse updateFood(@PathParam("id") Long id, @Valid FoodRequest request) {
        return foodService.updateFood(id, request);
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete a food item")
    public Response deleteFood(@PathParam("id") Long id) {
        foodService.deleteFood(id);
        return Response.noContent().build();
    }

    @PATCH
    @Path("/{id}/availability")
    @Operation(summary = "Update food availability status")
    public FoodResponse updateAvailability(@PathParam("id") Long id, Map<String, Boolean> body) {
        boolean available = body.getOrDefault("available", true);
        return foodService.updateAvailability(id, available);
    }
}`;

export const categoryController = `package com.fooddelivery.menu.controller;

import com.fooddelivery.menu.dto.*;
import com.fooddelivery.menu.service.*;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;

/**
 * Category Controller - REST endpoints for category operations
 */
@Path("/api/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Category", description = "Category management operations")
public class CategoryController {

    @Inject
    CategoryService categoryService;

    @GET
    @Operation(summary = "Get all categories")
    public List<CategoryResponse> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get category by ID")
    public CategoryResponse getCategoryById(@PathParam("id") Long id) {
        return categoryService.getCategoryById(id);
    }

    @POST
    @Operation(summary = "Create a new category")
    public Response createCategory(@Valid CategoryRequest request) {
        CategoryResponse created = categoryService.createCategory(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update a category")
    public CategoryResponse updateCategory(@PathParam("id") Long id, @Valid CategoryRequest request) {
        return categoryService.updateCategory(id, request);
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete a category")
    public Response deleteCategory(@PathParam("id") Long id) {
        categoryService.deleteCategory(id);
        return Response.noContent().build();
    }
}`;

export const exceptionClasses = `package com.fooddelivery.menu.exception;

/**
 * Custom exception for resource not found (404)
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

---

package com.fooddelivery.menu.exception;

/**
 * Custom exception for conflict errors (409)
 */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}

---

package com.fooddelivery.menu.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import jakarta.validation.ConstraintViolationException;

/**
 * Global Exception Handler - Converts exceptions to proper HTTP responses
 * Implements consistent error response format across all endpoints
 */
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

        if (exception instanceof jakarta.ws.rs.WebApplicationException) {
            jakarta.ws.rs.WebApplicationException wae = (jakarta.ws.rs.WebApplicationException) exception;
            errorResponse.put("status", wae.getResponse().getStatus());
            errorResponse.put("error", "Request Error");
            errorResponse.put("message", exception.getMessage());
            return Response.status(wae.getResponse().getStatus()).entity(errorResponse).build();
        }

        // Generic internal server error - do not expose details
        errorResponse.put("status", 500);
        errorResponse.put("error", "Internal Server Error");
        errorResponse.put("message", "An unexpected error occurred");
        return Response.status(500).entity(errorResponse).build();
    }
}`;

export const menuHealthCheck = `package com.fooddelivery.menu.health;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;
import org.eclipse.microprofile.health.Readiness;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

/**
 * Menu Service Health Checks
 * 
 * Liveness: Is the application running? (Used by orchestrator to restart if dead)
 * Readiness: Is the application ready to serve traffic? (Used to route traffic)
 */
@ApplicationScoped
public class MenuHealthChecks {

    @Inject
    EntityManager entityManager;

    /**
     * Liveness Check - Application is alive and running
     */
    @Liveness
    @ApplicationScoped
    public static class MenuLivenessCheck implements HealthCheck {
        @Override
        public HealthCheckResponse call() {
            return HealthCheckResponse.up("Menu Service is running");
        }
    }

    /**
     * Readiness Check - Database connection is available
     */
    @Readiness
    @ApplicationScoped
    public static class MenuReadinessCheck implements HealthCheck {
        @Inject
        EntityManager entityManager;

        @Override
        public HealthCheckResponse call() {
            try {
                entityManager.createNativeQuery("SELECT 1").getSingleResult();
                return HealthCheckResponse.named("Database connection")
                        .up()
                        .withData("database", "food_menu_db")
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

export const menuServiceTest = `package com.fooddelivery.menu;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

/**
 * Menu Service Integration Tests
 * Tests the REST API endpoints for food and category operations
 */
@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class MenuServiceTest {

    @Test
    @Order(1)
    public void testGetAllCategories() {
        given()
            .when().get("/api/categories")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON);
    }

    @Test
    @Order(2)
    public void testCreateCategory() {
        String body = "{\\"name\\": \\"Test Category\\", \\"description\\": \\"A test category\\"}";

        given()
            .contentType(ContentType.JSON)
            .body(body)
            .when().post("/api/categories")
            .then()
            .statusCode(201)
            .body("name", is("Test Category"));
    }

    @Test
    @Order(3)
    public void testGetAllFoods() {
        given()
            .when().get("/api/foods")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON);
    }

    @Test
    @Order(4)
    public void testCreateFood() {
        String body = "{\\"name\\": \\"Test Food\\", \\"description\\": \\"Test\\", \\"price\\": 100.00, \\"categoryId\\": 1}";

        given()
            .contentType(ContentType.JSON)
            .body(body)
            .when().post("/api/foods")
            .then()
            .statusCode(201)
            .body("name", is("Test Food"));
    }

    @Test
    @Order(5)
    public void testCreateFoodValidation() {
        // Missing required fields
        String body = "{\\"name\\": \\"\\", \\"price\\": -10}";

        given()
            .contentType(ContentType.JSON)
            .body(body)
            .when().post("/api/foods")
            .then()
            .statusCode(400);
    }

    @Test
    @Order(6)
    public void testGetFoodNotFound() {
        given()
            .when().get("/api/foods/99999")
            .then()
            .statusCode(404);
    }

    @Test
    @Order(7)
    public void testGetAvailableFoods() {
        given()
            .when().get("/api/foods/available")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON);
    }

    @Test
    @Order(8)
    public void testHealthEndpoint() {
        given()
            .when().get("/q/health")
            .then()
            .statusCode(200)
            .body("status", is("UP"));
    }

    @Test
    @Order(9)
    public void testLivenessEndpoint() {
        given()
            .when().get("/q/health/live")
            .then()
            .statusCode(200)
            .body("status", is("UP"));
    }

    @Test
    @Order(10)
    public void testReadinessEndpoint() {
        given()
            .when().get("/q/health/ready")
            .then()
            .statusCode(200)
            .body("status", is("UP"));
    }
}`;
