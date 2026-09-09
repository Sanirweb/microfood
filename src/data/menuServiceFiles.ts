export const menuServiceFiles: Record<string, string> = {
  "menu-service/pom.xml": `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.fooddelivery</groupId>
    <artifactId>menu-service</artifactId>
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
        <!-- Quarkus REST -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-rest-jackson</artifactId>
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
        <!-- Validation -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-hibernate-validator</artifactId>
        </dependency>
        <!-- Health -->
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
</project>`,

  "menu-service/src/main/resources/application.properties": `# Menu Service Configuration
quarkus.http.port=8081
quarkus.http.cors=true
quarkus.http.cors.origins=*

# MySQL Database
quarkus.datasource.db-kind=mysql
quarkus.datasource.username=root
quarkus.datasource.password=root
quarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/food_menu_db?useSSL=false&allowPublicKeyRetrieval=true

# Hibernate
quarkus.hibernate-orm.database.generation=none
quarkus.hibernate-orm.log.sql=true

# OpenAPI
quarkus.smallrye-openapi.info-title=Menu Service API
quarkus.smallrye-openapi.info-version=1.0.0
quarkus.smallrye-openapi.info-description=Menu Microservice for Food Delivery System
quarkus.swagger-ui.always-include=true`,

  "menu-service/src/main/java/com/fooddelivery/menu/entity/Category.java": `package com.fooddelivery.menu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Category entity - represents a food category like Pizza, Burger, Momo, etc.
 * Each category can have multiple food items.
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

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Food> foods = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
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
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/entity/Food.java": `package com.fooddelivery.menu.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Food entity - represents a food item in the menu.
 * Each food belongs to one category.
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

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

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/dto/CategoryRequest.java": `package com.fooddelivery.menu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating/updating a category.
 * Contains validation rules for input data.
 */
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 100, message = "Category name must be between 2 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/dto/CategoryResponse.java": `package com.fooddelivery.menu.dto;

import java.time.LocalDateTime;

/**
 * DTO for returning category data in API responses.
 */
public class CategoryResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;

    public CategoryResponse() {}

    public CategoryResponse(Long id, String name, String description, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/dto/FoodRequest.java": `package com.fooddelivery.menu.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * DTO for creating/updating a food item.
 * Contains validation rules for food data.
 */
public class FoodRequest {

    @NotBlank(message = "Food name is required")
    @Size(min = 2, max = 200, message = "Food name must be between 2 and 200 characters")
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Price must have at most 2 decimal places")
    private BigDecimal price;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private String imageUrl;

    private boolean available = true;

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

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/dto/FoodResponse.java": `package com.fooddelivery.menu.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for returning food data in API responses.
 * Includes nested category information.
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
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/dto/AvailabilityRequest.java": `package com.fooddelivery.menu.dto;

import jakarta.validation.constraints.NotNull;

/**
 * DTO for changing food availability status.
 */
public class AvailabilityRequest {

    @NotNull(message = "Available status is required")
    private Boolean available;

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/mapper/CategoryMapper.java": `package com.fooddelivery.menu.mapper;

import com.fooddelivery.menu.dto.CategoryRequest;
import com.fooddelivery.menu.dto.CategoryResponse;
import com.fooddelivery.menu.entity.Category;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * Mapper to convert between Category entities and DTOs.
 * Keeps conversion logic separate from entities and services.
 */
@ApplicationScoped
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        if (category == null) return null;
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setCreatedAt(category.getCreatedAt());
        return response;
    }

    public Category toEntity(CategoryRequest request) {
        if (request == null) return null;
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return category;
    }

    public void updateEntity(Category category, CategoryRequest request) {
        category.setName(request.getName());
        category.setDescription(request.getDescription());
    }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/mapper/FoodMapper.java": `package com.fooddelivery.menu.mapper;

import com.fooddelivery.menu.dto.FoodRequest;
import com.fooddelivery.menu.dto.FoodResponse;
import com.fooddelivery.menu.entity.Category;
import com.fooddelivery.menu.entity.Food;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * Mapper to convert between Food entities and DTOs.
 */
@ApplicationScoped
public class FoodMapper {

    @Inject
    CategoryMapper categoryMapper;

    public FoodResponse toResponse(Food food) {
        if (food == null) return null;
        FoodResponse response = new FoodResponse();
        response.setId(food.getId());
        response.setName(food.getName());
        response.setDescription(food.getDescription());
        response.setPrice(food.getPrice());
        response.setImageUrl(food.getImageUrl());
        response.setAvailable(food.isAvailable());
        response.setCategory(categoryMapper.toResponse(food.getCategory()));
        response.setCreatedAt(food.getCreatedAt());
        response.setUpdatedAt(food.getUpdatedAt());
        return response;
    }

    public Food toEntity(FoodRequest request, Category category) {
        if (request == null) return null;
        Food food = new Food();
        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setImageUrl(request.getImageUrl());
        food.setAvailable(request.isAvailable());
        food.setCategory(category);
        return food;
    }

    public void updateEntity(Food food, FoodRequest request, Category category) {
        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setImageUrl(request.getImageUrl());
        food.setAvailable(request.isAvailable());
        food.setCategory(category);
    }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/repository/CategoryRepository.java": `package com.fooddelivery.menu.repository;

import com.fooddelivery.menu.entity.Category;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

/**
 * Repository for Category entity.
 * Uses Panache for simplified database operations.
 */
@ApplicationScoped
public class CategoryRepository implements PanacheRepository<Category> {

    public Optional<Category> findByName(String name) {
        return find("name", name).firstResultOptional();
    }

    public boolean existsByName(String name) {
        return find("name", name).count() > 0;
    }

    public boolean existsByNameAndIdNot(String name, Long id) {
        return find("name ?1 and id ?2", name, id).count() > 0;
    }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/repository/FoodRepository.java": `package com.fooddelivery.menu.repository;

import com.fooddelivery.menu.entity.Food;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

/**
 * Repository for Food entity.
 * Provides custom queries for food items.
 */
@ApplicationScoped
public class FoodRepository implements PanacheRepository<Food> {

    public List<Food> findByCategoryId(Long categoryId) {
        return list("category.id", categoryId);
    }

    public List<Food> findAvailable() {
        return list("available", true);
    }

    public boolean existsByName(String name) {
        return find("name", name).count() > 0;
    }

    public boolean existsByNameAndIdNot(String name, Long id) {
        return find("name ?1 and id ?2", name, id).count() > 0;
    }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/service/CategoryService.java": `package com.fooddelivery.menu.service;

import com.fooddelivery.menu.dto.CategoryRequest;
import com.fooddelivery.menu.dto.CategoryResponse;
import com.fooddelivery.menu.entity.Category;
import com.fooddelivery.menu.exception.ResourceNotFoundException;
import com.fooddelivery.menu.exception.DuplicateResourceException;
import com.fooddelivery.menu.mapper.CategoryMapper;
import com.fooddelivery.menu.repository.CategoryRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Category business logic.
 * Handles CRUD operations and validation.
 */
@ApplicationScoped
public class CategoryService {

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    CategoryMapper categoryMapper;

    @Inject
    Logger logger;

    public List<CategoryResponse> getAllCategories() {
        logger.info("Fetching all categories");
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id);
        if (category == null) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        return categoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Category already exists with name: " + request.getName());
        }
        Category category = categoryMapper.toEntity(request);
        categoryRepository.persist(category);
        logger.info("Created category: " + category.getName());
        return categoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id);
        if (category == null) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        if (categoryRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new DuplicateResourceException("Category already exists with name: " + request.getName());
        }
        categoryMapper.updateEntity(category, request);
        logger.info("Updated category: " + category.getName());
        return categoryMapper.toResponse(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id);
        if (category == null) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.delete(category);
        logger.info("Deleted category with id: " + id);
    }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/service/FoodService.java": `package com.fooddelivery.menu.service;

import com.fooddelivery.menu.dto.AvailabilityRequest;
import com.fooddelivery.menu.dto.FoodRequest;
import com.fooddelivery.menu.dto.FoodResponse;
import com.fooddelivery.menu.entity.Category;
import com.fooddelivery.menu.entity.Food;
import com.fooddelivery.menu.exception.ResourceNotFoundException;
import com.fooddelivery.menu.mapper.FoodMapper;
import com.fooddelivery.menu.repository.CategoryRepository;
import com.fooddelivery.menu.repository.FoodRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Food business logic.
 * Handles CRUD operations, availability changes, and validation.
 */
@ApplicationScoped
public class FoodService {

    @Inject
    FoodRepository foodRepository;

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    FoodMapper foodMapper;

    @Inject
    Logger logger;

    public List<FoodResponse> getAllFoods() {
        logger.info("Fetching all food items");
        return foodRepository.findAll().stream()
                .map(foodMapper::toResponse)
                .collect(Collectors.toList());
    }

    public FoodResponse getFoodById(Long id) {
        Food food = foodRepository.findById(id);
        if (food == null) {
            throw new ResourceNotFoundException("Food item not found with id: " + id);
        }
        return foodMapper.toResponse(food);
    }

    public List<FoodResponse> getFoodsByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId);
        if (category == null) {
            throw new ResourceNotFoundException("Category not found with id: " + categoryId);
        }
        return foodRepository.findByCategoryId(categoryId).stream()
                .map(foodMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<FoodResponse> getAvailableFoods() {
        logger.info("Fetching available food items");
        return foodRepository.findAvailable().stream()
                .map(foodMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FoodResponse createFood(FoodRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId());
        if (category == null) {
            throw new ResourceNotFoundException("Category not found with id: " + request.getCategoryId());
        }
        Food food = foodMapper.toEntity(request, category);
        foodRepository.persist(food);
        logger.info("Created food item: " + food.getName());
        return foodMapper.toResponse(food);
    }

    @Transactional
    public FoodResponse updateFood(Long id, FoodRequest request) {
        Food food = foodRepository.findById(id);
        if (food == null) {
            throw new ResourceNotFoundException("Food item not found with id: " + id);
        }
        Category category = categoryRepository.findById(request.getCategoryId());
        if (category == null) {
            throw new ResourceNotFoundException("Category not found with id: " + request.getCategoryId());
        }
        foodMapper.updateEntity(food, request, category);
        logger.info("Updated food item: " + food.getName());
        return foodMapper.toResponse(food);
    }

    @Transactional
    public FoodResponse updateAvailability(Long id, AvailabilityRequest request) {
        Food food = foodRepository.findById(id);
        if (food == null) {
            throw new ResourceNotFoundException("Food item not found with id: " + id);
        }
        food.setAvailable(request.getAvailable());
        logger.info("Updated availability for food: " + food.getName() + " to: " + request.getAvailable());
        return foodMapper.toResponse(food);
    }

    @Transactional
    public void deleteFood(Long id) {
        Food food = foodRepository.findById(id);
        if (food == null) {
            throw new ResourceNotFoundException("Food item not found with id: " + id);
        }
        foodRepository.delete(food);
        logger.info("Deleted food item with id: " + id);
    }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/controller/CategoryController.java": `package com.fooddelivery.menu.controller;

import com.fooddelivery.menu.dto.CategoryRequest;
import com.fooddelivery.menu.dto.CategoryResponse;
import com.fooddelivery.menu.service.CategoryService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;

/**
 * REST controller for Category operations.
 * Handles HTTP requests and delegates to CategoryService.
 */
@Path("/api/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Categories", description = "Category management operations")
public class CategoryController {

    @Inject
    CategoryService categoryService;

    @GET
    @Operation(summary = "Get all categories")
    public Response getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return Response.ok(categories).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get category by ID")
    public Response getCategoryById(@PathParam("id") Long id) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return Response.ok(category).build();
    }

    @POST
    @Operation(summary = "Create a new category")
    public Response createCategory(@Valid CategoryRequest request) {
        CategoryResponse category = categoryService.createCategory(request);
        return Response.status(Response.Status.CREATED).entity(category).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update a category")
    public Response updateCategory(@PathParam("id") Long id, @Valid CategoryRequest request) {
        CategoryResponse category = categoryService.updateCategory(id, request);
        return Response.ok(category).build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete a category")
    public Response deleteCategory(@PathParam("id") Long id) {
        categoryService.deleteCategory(id);
        return Response.noContent().build();
    }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/controller/FoodController.java": `package com.fooddelivery.menu.controller;

import com.fooddelivery.menu.dto.AvailabilityRequest;
import com.fooddelivery.menu.dto.FoodRequest;
import com.fooddelivery.menu.dto.FoodResponse;
import com.fooddelivery.menu.service.FoodService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;

/**
 * REST controller for Food operations.
 * Handles HTTP requests and delegates to FoodService.
 */
@Path("/api/foods")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Foods", description = "Food item management operations")
public class FoodController {

    @Inject
    FoodService foodService;

    @GET
    @Operation(summary = "Get all food items")
    public Response getAllFoods() {
        List<FoodResponse> foods = foodService.getAllFoods();
        return Response.ok(foods).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get food item by ID")
    public Response getFoodById(@PathParam("id") Long id) {
        FoodResponse food = foodService.getFoodById(id);
        return Response.ok(food).build();
    }

    @GET
    @Path("/category/{categoryId}")
    @Operation(summary = "Get food items by category")
    public Response getFoodsByCategory(@PathParam("categoryId") Long categoryId) {
        List<FoodResponse> foods = foodService.getFoodsByCategory(categoryId);
        return Response.ok(foods).build();
    }

    @GET
    @Path("/available")
    @Operation(summary = "Get available food items")
    public Response getAvailableFoods() {
        List<FoodResponse> foods = foodService.getAvailableFoods();
        return Response.ok(foods).build();
    }

    @POST
    @Operation(summary = "Create a new food item")
    public Response createFood(@Valid FoodRequest request) {
        FoodResponse food = foodService.createFood(request);
        return Response.status(Response.Status.CREATED).entity(food).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update a food item")
    public Response updateFood(@PathParam("id") Long id, @Valid FoodRequest request) {
        FoodResponse food = foodService.updateFood(id, request);
        return Response.ok(food).build();
    }

    @PATCH
    @Path("/{id}/availability")
    @Operation(summary = "Change food availability")
    public Response updateAvailability(@PathParam("id") Long id, @Valid AvailabilityRequest request) {
        FoodResponse food = foodService.updateAvailability(id, request);
        return Response.ok(food).build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete a food item")
    public Response deleteFood(@PathParam("id") Long id) {
        foodService.deleteFood(id);
        return Response.noContent().build();
    }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/exception/ResourceNotFoundException.java": `package com.fooddelivery.menu.exception;

/**
 * Exception thrown when a requested resource is not found.
 * Results in HTTP 404 response.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/exception/DuplicateResourceException.java": `package com.fooddelivery.menu.exception;

/**
 * Exception thrown when trying to create a resource that already exists.
 * Results in HTTP 409 response.
 */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/exception/ErrorResponse.java": `package com.fooddelivery.menu.exception;

import java.time.LocalDateTime;

/**
 * Standard error response format for all API errors.
 */
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

  "menu-service/src/main/java/com/fooddelivery/menu/exception/GlobalExceptionHandler.java": `package com.fooddelivery.menu.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;
import java.util.stream.Collectors;

/**
 * Global exception handler for the Menu Service.
 * Converts exceptions to proper HTTP error responses.
 */
@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

    private static final Logger logger = Logger.getLogger(GlobalExceptionHandler.class);

    @Override
    public Response toResponse(Exception exception) {
        logger.error("Exception caught: " + exception.getMessage());

        if (exception instanceof ResourceNotFoundException) {
            ErrorResponse error = new ErrorResponse(
                404, "Not Found", exception.getMessage(), "/api"
            );
            return Response.status(Response.Status.NOT_FOUND).entity(error).build();
        }

        if (exception instanceof DuplicateResourceException) {
            ErrorResponse error = new ErrorResponse(
                409, "Conflict", exception.getMessage(), "/api"
            );
            return Response.status(Response.Status.CONFLICT).entity(error).build();
        }

        if (exception instanceof jakarta.validation.ConstraintViolationException) {
            jakarta.validation.ConstraintViolationException cve =
                (jakarta.validation.ConstraintViolationException) exception;
            String messages = cve.getConstraintViolations().stream()
                .map(v -> v.getMessage())
                .collect(Collectors.joining(", "));
            ErrorResponse error = new ErrorResponse(
                400, "Bad Request", messages, "/api"
            );
            return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
        }

        if (exception instanceof jakarta.ws.rs.WebApplicationException) {
            jakarta.ws.rs.WebApplicationException wae =
                (jakarta.ws.rs.WebApplicationException) exception;
            return wae.getResponse();
        }

        // Generic internal server error
        logger.error("Unhandled exception", exception);
        ErrorResponse error = new ErrorResponse(
            500, "Internal Server Error", "An unexpected error occurred", "/api"
        );
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
    }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/health/MenuServiceHealthCheck.java": `package com.fooddelivery.menu.health;

import jakarta.inject.Inject;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * Liveness health check for Menu Service.
 * Indicates whether the application is running.
 */
@Liveness
@ApplicationScoped
public class MenuServiceHealthCheck implements HealthCheck {

    @Override
    public HealthCheckResponse call() {
        return HealthCheckResponse.named("Menu Service Liveness")
                .up()
                .build();
    }
}`,

  "menu-service/src/main/java/com/fooddelivery/menu/health/MenuServiceReadinessCheck.java": `package com.fooddelivery.menu.health;

import jakarta.inject.Inject;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Readiness;
import jakarta.enterprise.context.ApplicationScoped;
import javax.sql.DataSource;
import java.sql.Connection;

/**
 * Readiness health check for Menu Service.
 * Checks if the database connection is available.
 */
@Readiness
@ApplicationScoped
public class MenuServiceReadinessCheck implements HealthCheck {

    @Inject
    DataSource dataSource;

    @Override
    public HealthCheckResponse call() {
        try (Connection connection = dataSource.getConnection()) {
            boolean valid = connection.isValid(2);
            return HealthCheckResponse.named("Menu Service Database Readiness")
                    .status(valid)
                    .withData("database", "MySQL")
                    .build();
        } catch (Exception e) {
            return HealthCheckResponse.named("Menu Service Database Readiness")
                    .down()
                    .withData("error", e.getMessage())
                    .build();
        }
    }
}`,

  "menu-service/src/test/java/com/fooddelivery/menu/CategoryControllerTest.java": `package com.fooddelivery.menu;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
public class CategoryControllerTest {

    @Test
    public void testGetAllCategories() {
        given()
            .when().get("/api/categories")
            .then()
            .statusCode(200)
            .body("$.size()", is(notNullValue()));
    }

    @Test
    public void testGetCategoryNotFound() {
        given()
            .when().get("/api/categories/99999")
            .then()
            .statusCode(404);
    }

    @Test
    public void testCreateCategory() {
        String json = "{\\"name\\": \\"Test Category\\", \\"description\\": \\"Test desc\\"}";
        given()
            .contentType("application/json")
            .body(json)
            .when().post("/api/categories")
            .then()
            .statusCode(201)
            .body("name", is("Test Category"));
    }

    @Test
    public void testCreateCategoryValidation() {
        String json = "{\\"name\\": \\"\\", \\"description\\": \\"Test\\"}";
        given()
            .contentType("application/json")
            .body(json)
            .when().post("/api/categories")
            .then()
            .statusCode(400);
    }
}`,

  "menu-service/src/test/java/com/fooddelivery/menu/FoodControllerTest.java": `package com.fooddelivery.menu;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
public class FoodControllerTest {

    @Test
    public void testGetAllFoods() {
        given()
            .when().get("/api/foods")
            .then()
            .statusCode(200);
    }

    @Test
    public void testGetAvailableFoods() {
        given()
            .when().get("/api/foods/available")
            .then()
            .statusCode(200);
    }

    @Test
    public void testGetFoodNotFound() {
        given()
            .when().get("/api/foods/99999")
            .then()
            .statusCode(404);
    }

    @Test
    public void testCreateFoodValidation() {
        String json = "{\\"name\\": \\"\\", \\"price\\": -10, \\"categoryId\\": 1}";
        given()
            .contentType("application/json")
            .body(json)
            .when().post("/api/foods")
            .then()
            .statusCode(400);
    }
}`,

  "menu-service/src/test/java/com/fooddelivery/menu/HealthCheckTest.java": `package com.fooddelivery.menu;

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

  "menu-service/Dockerfile": `FROM quay.io/quarkus/ubi-quarkus-mandrel-builder-image:23.1-java17 AS build
COPY --chown=quarkus:quarkus . /code/
RUN mvn -f /code/pom.xml package -DskipTests
FROM quay.io/quarkus/quarkus-micro-image:2.0
WORKDIR /work/
COPY --from=build /code/target/quarkus-app/lib/ /work/lib/
COPY --from=build /code/target/quarkus-app/*.jar /work/
COPY --from=build /code/target/quarkus-app/app/ /work/app/
COPY --from=build /code/target/quarkus-app/quarkus/ /work/quarkus/
EXPOSE 8081
CMD ["java", "-jar", "quarkus-run.jar"]`
};
