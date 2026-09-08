export const sharedFiles: Record<string, string> = {
  "database/menu-service.sql": `-- ============================================
-- FOOD MENU DATABASE
-- ============================================
CREATE DATABASE IF NOT EXISTS food_menu_db;
USE food_menu_db;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Foods Table
CREATE TABLE IF NOT EXISTS foods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    price DECIMAL(10,2) NOT NULL,
    category_id BIGINT NOT NULL,
    image_url VARCHAR(500),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Categories
INSERT INTO categories (name, description) VALUES
('Momo', 'Steamed and fried dumplings - Nepali specialty'),
('Burger', 'Classic and specialty burgers'),
('Pizza', 'Italian-style pizzas with local toppings'),
('Drinks', 'Cold and hot beverages'),
('Desserts', 'Sweet treats and desserts'),
('Nepali Food', 'Traditional Nepali dishes'),
('Noodles', 'Chowmein and noodle dishes'),
('Fried Items', 'Crispy fried snacks and sides');

-- Foods
INSERT INTO foods (name, description, price, category_id, available) VALUES
-- Momo
('Chicken Momo', 'Steamed chicken dumplings with spicy achar', 180.00, 1, TRUE),
('Veg Momo', 'Steamed vegetable dumplings with tomato achar', 140.00, 1, TRUE),
('Buff Momo', 'Steamed buff meat dumplings with spicy sauce', 200.00, 1, TRUE),
('Fried Momo', 'Deep fried chicken momo with mayo dip', 220.00, 1, TRUE),
('Jhol Momo', 'Steamed momo served in hot spicy soup', 200.00, 1, TRUE),

-- Burger
('Chicken Burger', 'Grilled chicken patty with lettuce and sauce', 300.00, 2, TRUE),
('Veg Burger', 'Crispy vegetable patty with fresh veggies', 250.00, 2, TRUE),
('Cheese Burger', 'Double cheese chicken burger', 380.00, 2, TRUE),

-- Pizza
('Cheese Pizza', 'Classic cheese pizza with mozzarella', 450.00, 3, TRUE),
('Veg Pizza', 'Mixed vegetable pizza with bell peppers', 400.00, 3, TRUE),
('Chicken Pizza', 'Chicken tikka pizza with special sauce', 550.00, 3, TRUE),
('Pepperoni Pizza', 'Classic pepperoni with extra cheese', 600.00, 3, TRUE),

-- Drinks
('Coke', 'Chilled Coca Cola 300ml', 80.00, 4, TRUE),
('Fanta', 'Chilled Fanta Orange 300ml', 80.00, 4, TRUE),
('Fresh Lime Soda', 'Fresh lime with soda and mint', 120.00, 4, TRUE),
('Masala Tea', 'Traditional Nepali masala chiya', 60.00, 4, TRUE),

-- Desserts
('Ice Cream', 'Vanilla/Chocolate/Strawberry single scoop', 150.00, 5, TRUE),
('Gulab Jamun', 'Sweet milk balls in sugar syrup (2 pcs)', 100.00, 5, TRUE),

-- Nepali Food
('Dal Bhat Set', 'Complete Nepali meal with rice, dal, tarkari', 350.00, 6, TRUE),
('Chowmein', 'Stir-fried noodles with vegetables', 200.00, 7, TRUE),
('Chicken Chowmein', 'Stir-fried noodles with chicken', 250.00, 7, TRUE),

-- Fried Items
('French Fries', 'Crispy golden french fries', 150.00, 8, TRUE),
('Chicken Wings', 'Spicy fried chicken wings (4 pcs)', 280.00, 8, TRUE),
('Spring Roll', 'Crispy vegetable spring rolls (3 pcs)', 160.00, 8, TRUE);`,

  "database/order-service.sql": `-- ============================================
-- FOOD ORDER DATABASE
-- ============================================
CREATE DATABASE IF NOT EXISTS food_order_db;
USE food_order_db;

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(200),
    delivery_address VARCHAR(500) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING','CONFIRMED','PREPARING','READY','OUT_FOR_DELIVERY','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    food_id BIGINT NOT NULL,
    food_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Sample Orders
INSERT INTO orders (customer_name, customer_phone, customer_email, delivery_address, total_amount, status) VALUES
('Ram Sharma', '9801234567', 'ram@email.com', 'Putalisadak, Kathmandu', 540.00, 'PENDING'),
('Sita Thapa', '9812345678', 'sita@email.com', 'Baneshwor, Kathmandu', 850.00, 'CONFIRMED'),
('Hari Prasad', '9823456789', 'hari@email.com', 'Lalitpur, Pulchowk', 380.00, 'PREPARING'),
('Gita Rai', '9834567890', 'gita@email.com', 'Bhaktapur, Durbar Square', 680.00, 'DELIVERED');

-- Sample Order Items
INSERT INTO order_items (order_id, food_id, food_name, quantity, unit_price, subtotal) VALUES
-- Order 1: Ram - Chicken Momo x2 + Coke x1
(1, 1, 'Chicken Momo', 2, 180.00, 360.00),
(1, 13, 'Coke', 1, 80.00, 80.00),
(1, 17, 'French Fries', 1, 150.00, 150.00),

-- Order 2: Sita - Cheese Pizza x1 + Fresh Lime Soda x2
(2, 9, 'Cheese Pizza', 1, 450.00, 450.00),
(2, 15, 'Fresh Lime Soda', 2, 120.00, 240.00),
(2, 21, 'Spring Roll', 1, 160.00, 160.00),

-- Order 3: Hari - Chicken Burger x1 + Veg Momo x1
(3, 6, 'Chicken Burger', 1, 300.00, 300.00),
(3, 2, 'Veg Momo', 1, 140.00, 140.00),

-- Order 4: Gita - Chicken Chowmein x1 + Chicken Wings x1 + Coke x1
(4, 19, 'Chicken Chowmein', 1, 250.00, 250.00),
(4, 23, 'Chicken Wings', 1, 280.00, 280.00),
(4, 13, 'Coke', 1, 80.00, 80.00),
(4, 16, 'Masala Tea', 1, 60.00, 60.00);`,

  "database/delivery-service.sql": `-- ============================================
-- FOOD DELIVERY DATABASE
-- ============================================
CREATE DATABASE IF NOT EXISTS food_delivery_db;
USE food_delivery_db;

-- Deliveries Table
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    delivery_person_name VARCHAR(200),
    delivery_person_phone VARCHAR(20),
    delivery_address VARCHAR(500) NOT NULL,
    status ENUM('UNASSIGNED','ASSIGNED','PICKED_UP','OUT_FOR_DELIVERY','DELIVERED','FAILED','CANCELLED') NOT NULL DEFAULT 'UNASSIGNED',
    estimated_delivery_time INT,
    assigned_at TIMESTAMP NULL,
    picked_up_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SAMPLE DATA
-- ============================================

INSERT INTO deliveries (order_id, delivery_person_name, delivery_person_phone, delivery_address, status, estimated_delivery_time, assigned_at, picked_up_at, delivered_at) VALUES
(1, NULL, NULL, 'Putalisadak, Kathmandu', 'UNASSIGNED', 30, NULL, NULL, NULL),
(2, 'Bikash Tamang', '9841234567', 'Baneshwor, Kathmandu', 'ASSIGNED', 25, NOW(), NULL, NULL),
(3, 'Sujan Shrestha', '9851234567', 'Lalitpur, Pulchowk', 'OUT_FOR_DELIVERY', 20, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 30 MINUTE, NULL),
(4, 'Anil Gurung', '9861234567', 'Bhaktapur, Durbar Square', 'DELIVERED', 35, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR);`,

  "docker-compose.yml": `version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: food-delivery-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./database/menu-service.sql:/docker-entrypoint-initdb.d/01-menu.sql
      - ./database/order-service.sql:/docker-entrypoint-initdb.d/02-order.sql
      - ./database/delivery-service.sql:/docker-entrypoint-initdb.d/03-delivery.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Menu Service
  menu-service:
    build:
      context: ./menu-service
      dockerfile: Dockerfile
    container_name: menu-service
    ports:
      - "8081:8081"
    environment:
      QUARKUS_DATASOURCE_JDBC_URL: jdbc:mysql://mysql:3306/food_menu_db?useSSL=false&allowPublicKeyRetrieval=true
      QUARKUS_DATASOURCE_USERNAME: root
      QUARKUS_DATASOURCE_PASSWORD: root
    depends_on:
      mysql:
        condition: service_healthy

  # Order Service
  order-service:
    build:
      context: ./order-service
      dockerfile: Dockerfile
    container_name: order-service
    ports:
      - "8082:8082"
    environment:
      QUARKUS_DATASOURCE_JDBC_URL: jdbc:mysql://mysql:3306/food_order_db?useSSL=false&allowPublicKeyRetrieval=true
      QUARKUS_DATASOURCE_USERNAME: root
      QUARKUS_DATASOURCE_PASSWORD: root
      COM_FOODDELIVERY_ORDER_CLIENT_MENUSERVICECLIENT_MP_REST_URL: http://menu-service:8081
      COM_FOODDELIVERY_ORDER_CLIENT_DELIVERYSERVICECLIENT_MP_REST_URL: http://delivery-service:8083
    depends_on:
      mysql:
        condition: service_healthy
      menu-service:
        condition: service_started

  # Delivery Service
  delivery-service:
    build:
      context: ./delivery-service
      dockerfile: Dockerfile
    container_name: delivery-service
    ports:
      - "8083:8083"
    environment:
      QUARKUS_DATASOURCE_JDBC_URL: jdbc:mysql://mysql:3306/food_delivery_db?useSSL=false&allowPublicKeyRetrieval=true
      QUARKUS_DATASOURCE_USERNAME: root
      QUARKUS_DATASOURCE_PASSWORD: root
    depends_on:
      mysql:
        condition: service_healthy

volumes:
  mysql-data:`,

  ".gitignore": `# Build output
target/

# IDE
.idea/
*.iml
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Environment
.env
*.env.local`,

  "README.md": `# Food Delivery Microservices System

A complete microservices-based food delivery backend system built with Java, Quarkus, and MicroProfile.

## Architecture

\`\`\`
                CLIENT / POSTMAN
                       |
      -------------------------------------
      |                 |                 |
      v                 v                 v
 MENU SERVICE      ORDER SERVICE     DELIVERY SERVICE
   :8081             :8082              :8083
      |                 |                 |
      v                 v                 v
  menu_db           order_db         delivery_db
\`\`\`

## Technology Stack

- Java 17
- Quarkus 3.8.1
- MicroProfile Health
- Hibernate ORM with Panache
- MySQL 8.x
- Maven
- Docker & Docker Compose
- Swagger/OpenAPI

## Services

| Service | Port | Database |
|---------|------|----------|
| Menu Service | 8081 | food_menu_db |
| Order Service | 8082 | food_order_db |
| Delivery Service | 8083 | food_delivery_db |

## Quick Start

### Prerequisites

1. Java 17+ installed
2. Maven 3.8+ installed
3. MySQL 8.x running
4. (Optional) Docker & Docker Compose

### Step 1: Setup Database

Run the SQL scripts in the \`database/\` folder:

\`\`\`bash
mysql -u root -p < database/menu-service.sql
mysql -u root -p < database/order-service.sql
mysql -u root -p < database/delivery-service.sql
\`\`\`

### Step 2: Configure Database Credentials

Edit \`application.properties\` in each service if your MySQL password is different from "root".

### Step 3: Start Services

Open 3 terminals:

\`\`\`bash
# Terminal 1 - Menu Service
cd menu-service
mvn quarkus:dev

# Terminal 2 - Order Service
cd order-service
mvn quarkus:dev

# Terminal 3 - Delivery Service
cd delivery-service
mvn quarkus:dev
\`\`\`

### Step 4: Verify

- Menu Service: http://localhost:8081/q/health
- Order Service: http://localhost:8082/q/health
- Delivery Service: http://localhost:8083/q/health

### Docker (Alternative)

\`\`\`bash
docker compose up --build
\`\`\`

## API Endpoints

### Menu Service (Port 8081)
- GET /api/categories
- POST /api/categories
- GET /api/foods
- POST /api/foods
- GET /api/foods/available
- GET /api/foods/category/{id}
- PATCH /api/foods/{id}/availability

### Order Service (Port 8082)
- POST /api/orders (calls Menu Service for prices)
- GET /api/orders
- GET /api/orders/{id}
- PATCH /api/orders/{id}/status
- GET /api/orders/status/{status}

### Delivery Service (Port 8083)
- POST /api/deliveries
- GET /api/deliveries
- GET /api/deliveries/{id}
- GET /api/deliveries/order/{orderId}
- PATCH /api/deliveries/{id}/assign
- PATCH /api/deliveries/{id}/status

## Swagger UI

- Menu: http://localhost:8081/q/swagger-ui
- Order: http://localhost:8082/q/swagger-ui
- Delivery: http://localhost:8083/q/swagger-ui

## Health Checks

- Liveness: /q/health/live
- Readiness: /q/health/ready
- Overall: /q/health

## Postman

Import the collection from \`postman/\` folder to test all APIs.

## License

Academic Project - Food Delivery Microservices System
`,

  "postman/Food-Delivery-Microservices.postman_collection.json": `{
  "info": {
    "name": "Food Delivery Microservices",
    "description": "Complete API collection for Menu, Order, and Delivery microservices",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {"key": "menu_url", "value": "http://localhost:8081"},
    {"key": "order_url", "value": "http://localhost:8082"},
    {"key": "delivery_url", "value": "http://localhost:8083"}
  ],
  "item": [
    {
      "name": "Menu Service - Categories",
      "item": [
        {
          "name": "Get All Categories",
          "request": {"method": "GET", "url": "{{menu_url}}/api/categories"}
        },
        {
          "name": "Get Category by ID",
          "request": {"method": "GET", "url": "{{menu_url}}/api/categories/1"}
        },
        {
          "name": "Create Category",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{menu_url}}/api/categories",
            "body": {"mode": "raw", "raw": "{\\n  \\"name\\": \\"Salad\\",\\n  \\"description\\": \\"Fresh salads\\"\\n}"}
          }
        },
        {
          "name": "Update Category",
          "request": {
            "method": "PUT",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{menu_url}}/api/categories/1",
            "body": {"mode": "raw", "raw": "{\\n  \\"name\\": \\"Momo\\",\\n  \\"description\\": \\"Nepali dumplings\\"\\n}"}
          }
        },
        {
          "name": "Delete Category",
          "request": {"method": "DELETE", "url": "{{menu_url}}/api/categories/1"}
        }
      ]
    },
    {
      "name": "Menu Service - Foods",
      "item": [
        {
          "name": "Get All Foods",
          "request": {"method": "GET", "url": "{{menu_url}}/api/foods"}
        },
        {
          "name": "Get Food by ID",
          "request": {"method": "GET", "url": "{{menu_url}}/api/foods/1"}
        },
        {
          "name": "Get Foods by Category",
          "request": {"method": "GET", "url": "{{menu_url}}/api/foods/category/1"}
        },
        {
          "name": "Get Available Foods",
          "request": {"method": "GET", "url": "{{menu_url}}/api/foods/available"}
        },
        {
          "name": "Create Food",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{menu_url}}/api/foods",
            "body": {"mode": "raw", "raw": "{\\n  \\"name\\": \\"Paneer Momo\\",\\n  \\"description\\": \\"Steamed paneer dumplings\\",\\n  \\"price\\": 160.00,\\n  \\"categoryId\\": 1,\\n  \\"available\\": true\\n}"}
          }
        },
        {
          "name": "Update Food",
          "request": {
            "method": "PUT",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{menu_url}}/api/foods/1",
            "body": {"mode": "raw", "raw": "{\\n  \\"name\\": \\"Chicken Momo\\",\\n  \\"description\\": \\"Steamed chicken dumplings with spicy achar\\",\\n  \\"price\\": 180.00,\\n  \\"categoryId\\": 1,\\n  \\"available\\": true\\n}"}
          }
        },
        {
          "name": "Change Food Availability",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{menu_url}}/api/foods/1/availability",
            "body": {"mode": "raw", "raw": "{\\n  \\"available\\": false\\n}"}
          }
        },
        {
          "name": "Delete Food",
          "request": {"method": "DELETE", "url": "{{menu_url}}/api/foods/1"}
        }
      ]
    },
    {
      "name": "Order Service",
      "item": [
        {
          "name": "Create Order",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{order_url}}/api/orders",
            "body": {"mode": "raw", "raw": "{\\n  \\"customerName\\": \\"John Doe\\",\\n  \\"customerPhone\\": \\"9800000000\\",\\n  \\"customerEmail\\": \\"john@email.com\\",\\n  \\"deliveryAddress\\": \\"Kathmandu, Nepal\\",\\n  \\"items\\": [\\n    {\\"foodId\\": 1, \\"quantity\\": 2},\\n    {\\"foodId\\": 6, \\"quantity\\": 1}\\n  ]\\n}"}
          }
        },
        {
          "name": "Get All Orders",
          "request": {"method": "GET", "url": "{{order_url}}/api/orders"}
        },
        {
          "name": "Get Order by ID",
          "request": {"method": "GET", "url": "{{order_url}}/api/orders/1"}
        },
        {
          "name": "Get Orders by Status",
          "request": {"method": "GET", "url": "{{order_url}}/api/orders/status/PENDING"}
        },
        {
          "name": "Update Order Status",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{order_url}}/api/orders/1/status",
            "body": {"mode": "raw", "raw": "{\\n  \\"status\\": \\"CONFIRMED\\"\\n}"}
          }
        },
        {
          "name": "Cancel Order",
          "request": {"method": "DELETE", "url": "{{order_url}}/api/orders/1"}
        }
      ]
    },
    {
      "name": "Delivery Service",
      "item": [
        {
          "name": "Create Delivery",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{delivery_url}}/api/deliveries",
            "body": {"mode": "raw", "raw": "{\\n  \\"orderId\\": 1,\\n  \\"deliveryAddress\\": \\"Kathmandu, Nepal\\",\\n  \\"estimatedDeliveryTime\\": 30\\n}"}
          }
        },
        {
          "name": "Get All Deliveries",
          "request": {"method": "GET", "url": "{{delivery_url}}/api/deliveries"}
        },
        {
          "name": "Get Delivery by ID",
          "request": {"method": "GET", "url": "{{delivery_url}}/api/deliveries/1"}
        },
        {
          "name": "Get Delivery by Order ID",
          "request": {"method": "GET", "url": "{{delivery_url}}/api/deliveries/order/1"}
        },
        {
          "name": "Assign Delivery Person",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{delivery_url}}/api/deliveries/1/assign",
            "body": {"mode": "raw", "raw": "{\\n  \\"deliveryPersonName\\": \\"Bikash Tamang\\",\\n  \\"deliveryPersonPhone\\": \\"9841234567\\"\\n}"}
          }
        },
        {
          "name": "Update Delivery Status",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{delivery_url}}/api/deliveries/1/status",
            "body": {"mode": "raw", "raw": "{\\n  \\"status\\": \\"PICKED_UP\\"\\n}"}
          }
        },
        {
          "name": "Delete Delivery",
          "request": {"method": "DELETE", "url": "{{delivery_url}}/api/deliveries/1"}
        }
      ]
    },
    {
      "name": "Health Checks",
      "item": [
        {"name": "Menu - Health", "request": {"method": "GET", "url": "{{menu_url}}/q/health"}},
        {"name": "Menu - Liveness", "request": {"method": "GET", "url": "{{menu_url}}/q/health/live"}},
        {"name": "Menu - Readiness", "request": {"method": "GET", "url": "{{menu_url}}/q/health/ready"}},
        {"name": "Order - Health", "request": {"method": "GET", "url": "{{order_url}}/q/health"}},
        {"name": "Order - Liveness", "request": {"method": "GET", "url": "{{order_url}}/q/health/live"}},
        {"name": "Order - Readiness", "request": {"method": "GET", "url": "{{order_url}}/q/health/ready"}},
        {"name": "Delivery - Health", "request": {"method": "GET", "url": "{{delivery_url}}/q/health"}},
        {"name": "Delivery - Liveness", "request": {"method": "GET", "url": "{{delivery_url}}/q/health/live"}},
        {"name": "Delivery - Readiness", "request": {"method": "GET", "url": "{{delivery_url}}/q/health/ready"}}
      ]
    }
  ]
}`,

  "postman/Food-Delivery-Local.postman_environment.json": `{
  "id": "food-delivery-local",
  "name": "Food Delivery - Local",
  "values": [
    {"key": "menu_url", "value": "http://localhost:8081", "enabled": true},
    {"key": "order_url", "value": "http://localhost:8082", "enabled": true},
    {"key": "delivery_url", "value": "http://localhost:8083", "enabled": true}
  ],
  "_postman_variable_scope": "environment"
}`,

  "docs/setup-guide.md": `# Complete Setup Guide for Windows

## STEP 1: Install Java 17

1. Download from: https://adoptium.net/
2. Choose "JDK 17 (LTS)" for Windows x64
3. Run the installer
4. Verify installation:
   \`\`\`
   java -version
   \`\`\`
   Expected: openjdk version "17.x.x"

## STEP 2: Install Maven

1. Download from: https://maven.apache.org/download.cgi
2. Extract to C:\\\\maven
3. Add to PATH: C:\\\\maven\\\\bin
4. Verify:
   \`\`\`
   mvn -version
   \`\`\`

## STEP 3: Install MySQL 8

1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Run installer, choose "Developer Default"
3. Set root password (remember it!)
4. Verify with MySQL Workbench

## STEP 4: Create Databases

Open MySQL Workbench or command line:

\`\`\`bash
mysql -u root -p < database/menu-service.sql
mysql -u root -p < database/order-service.sql
mysql -u root -p < database/delivery-service.sql
\`\`\`

## STEP 5: Configure Database Password

If your MySQL password is NOT "root", edit each service's application.properties:

\`\`\`properties
quarkus.datasource.username=root
quarkus.datasource.password=YOUR_PASSWORD_HERE
\`\`\`

## STEP 6: Start Menu Service

\`\`\`bash
cd menu-service
mvn quarkus:dev
\`\`\`
Wait for "Listening on: http://0.0.0.0:8081"

## STEP 7: Start Order Service (new terminal)

\`\`\`bash
cd order-service
mvn quarkus:dev
\`\`\`
Wait for "Listening on: http://0.0.0.0:8082"

## STEP 8: Start Delivery Service (new terminal)

\`\`\`bash
cd delivery-service
mvn quarkus:dev
\`\`\`
Wait for "Listening on: http://0.0.0.0:8083"

## STEP 9: Verify

Open browser:
- http://localhost:8081/q/health
- http://localhost:8082/q/health
- http://localhost:8083/q/health

All should show {"status": "UP"}

## STEP 10: Open Swagger UI

- Menu: http://localhost:8081/q/swagger-ui
- Order: http://localhost:8082/q/swagger-ui
- Delivery: http://localhost:8083/q/swagger-ui
`,

  "docs/architecture.md": `# Architecture Documentation

## What is Microservices?

Microservices is an architectural style where an application is built as a collection of small, independent services. Each service:
- Runs in its own process
- Has its own database
- Communicates via lightweight protocols (HTTP/REST)
- Can be deployed independently

## Why Microservices for Food Delivery?

1. **Independent Services**: Menu, Order, and Delivery can evolve independently
2. **Independent Databases**: Each service owns its data
3. **Fault Isolation**: If Delivery Service fails, Menu and Order still work
4. **Scalability**: Scale each service based on demand
5. **Team Independence**: Different teams can work on different services

## System Architecture

\`\`\`
┌─────────────────────────────────────────────────────┐
│                  CLIENT / POSTMAN                     │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ MENU SERVICE │ │ORDER SERVICE │ │DELIVERY SVC  │
│   Port 8081  │ │  Port 8082   │ │  Port 8083   │
└──────┬───────┘ └──┬───────┬───┘ └──────┬───────┘
       │            │       │            │
       ▼            ▼       ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  menu_db     │ │  order_db    │ │ delivery_db  │
│  (MySQL)     │ │  (MySQL)     │ │  (MySQL)     │
└──────────────┘ └──────────────┘ └──────────────┘
\`\`\`

## Service Communication

- Order Service → Menu Service: REST (to get food prices)
- Order Service → Delivery Service: REST (to create deliveries)
- No circular dependencies

## MicroProfile Health

Each service exposes:
- /q/health/live - Liveness (is the app running?)
- /q/health/ready - Readiness (is the app ready for traffic?)
- /q/health - Combined health status
`,

  "docs/database-design.md": `# Database Design

## ER Diagram

\`\`\`mermaid
erDiagram
    %% Menu Service Database
    categories {
        bigint id PK
        varchar name UK
        varchar description
        timestamp created_at
    }
    foods {
        bigint id PK
        varchar name
        varchar description
        decimal price
        bigint category_id FK
        varchar image_url
        boolean available
        timestamp created_at
        timestamp updated_at
    }

    %% Order Service Database
    orders {
        bigint id PK
        varchar customer_name
        varchar customer_phone
        varchar customer_email
        varchar delivery_address
        decimal total_amount
        enum status
        timestamp created_at
        timestamp updated_at
    }
    order_items {
        bigint id PK
        bigint order_id FK
        bigint food_id
        varchar food_name
        int quantity
        decimal unit_price
        decimal subtotal
    }

    %% Delivery Service Database
    deliveries {
        bigint id PK
        bigint order_id
        varchar delivery_person_name
        varchar delivery_person_phone
        varchar delivery_address
        enum status
        int estimated_delivery_time
        timestamp assigned_at
        timestamp picked_up_at
        timestamp delivered_at
        timestamp created_at
        timestamp updated_at
    }

    categories ||--o{ foods : "has"
    orders ||--o{ order_items : "contains"
\`\`\`

## Important Note

Because this is a microservices architecture:
- Each service has its OWN database
- There are NO foreign keys between databases
- The \`order_items.food_id\` is a LOGICAL reference to Menu Service
- The \`deliveries.order_id\` is a LOGICAL reference to Order Service
- This is by design - services are independent!
`,

  "docs/microprofile-health.md": `# MicroProfile Health Documentation

## What is MicroProfile?

MicroProfile is a set of technologies for building microservices in Java. It provides:
- REST clients
- Health checks
- Fault tolerance
- OpenAPI support
- And more

## What is MicroProfile Health?

MicroProfile Health defines a way to check if a service is healthy. It provides two types:

### Liveness
Answers: "Is the application alive and running?"
- If liveness fails, the container/platform restarts the application
- URL: /q/health/live

### Readiness
Answers: "Is the application ready to receive requests?"
- If readiness fails, the load balancer stops sending traffic
- URL: /q/health/ready

## Why Health Checks Matter

In microservices:
1. **Container Orchestration**: Kubernetes uses health checks to manage pods
2. **Load Balancing**: Only send traffic to healthy instances
3. **Monitoring**: Alert when services go down
4. **Self-healing**: Automatically restart failed services

## Example Response

\`\`\`json
{
  "status": "UP",
  "checks": [
    {
      "name": "Menu Service Liveness",
      "status": "UP"
    },
    {
      "name": "Menu Service Database Readiness",
      "status": "UP",
      "data": {
        "database": "MySQL"
      }
    }
  ]
}
\`\`\`

## Our Implementation

Each service has:
1. A **Liveness Check** - Always returns UP (app is running)
2. A **Readiness Check** - Tests database connection

If MySQL is down:
- Liveness: UP (app is still running)
- Readiness: DOWN (can't serve requests without DB)
`,

  "docs/api-documentation.md": `# API Documentation

## Menu Service APIs (Port 8081)

### Categories

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/categories | Get all categories |
| GET | /api/categories/{id} | Get category by ID |
| POST | /api/categories | Create category |
| PUT | /api/categories/{id} | Update category |
| DELETE | /api/categories/{id} | Delete category |

### Foods

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/foods | Get all foods |
| GET | /api/foods/{id} | Get food by ID |
| GET | /api/foods/category/{id} | Get foods by category |
| GET | /api/foods/available | Get available foods |
| POST | /api/foods | Create food |
| PUT | /api/foods/{id} | Update food |
| PATCH | /api/foods/{id}/availability | Toggle availability |
| DELETE | /api/foods/{id} | Delete food |

## Order Service APIs (Port 8082)

| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/orders | Create order |
| GET | /api/orders | Get all orders |
| GET | /api/orders/{id} | Get order by ID |
| GET | /api/orders/status/{status} | Get orders by status |
| PATCH | /api/orders/{id}/status | Update order status |
| DELETE | /api/orders/{id} | Cancel order |

## Delivery Service APIs (Port 8083)

| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/deliveries | Create delivery |
| GET | /api/deliveries | Get all deliveries |
| GET | /api/deliveries/{id} | Get delivery by ID |
| GET | /api/deliveries/order/{orderId} | Get delivery for order |
| PATCH | /api/deliveries/{id}/assign | Assign delivery person |
| PATCH | /api/deliveries/{id}/status | Update delivery status |
| DELETE | /api/deliveries/{id} | Delete delivery |

## Health Endpoints (All Services)

| Method | URL | Description |
|--------|-----|-------------|
| GET | /q/health | Overall health |
| GET | /q/health/live | Liveness check |
| GET | /q/health/ready | Readiness check |
`,

  "docs/testing-guide.md": `# Testing Guide

## Using Postman

### Step 1: Import Collection
1. Open Postman
2. Click Import
3. Select: postman/Food-Delivery-Microservices.postman_collection.json
4. Click Import

### Step 2: Import Environment
1. Click Import again
2. Select: postman/Food-Delivery-Local.postman_environment.json
3. Set the environment as active

### Step 3: Start All Services
Make sure all 3 services are running on ports 8081, 8082, 8083.

### Step 4: Test Menu Service
1. Run "Get All Categories" - should return 8 categories
2. Run "Get Available Foods" - should return all available foods
3. Run "Create Food" - should return 201

### Step 5: Test Order Service
1. Run "Create Order" with sample body
2. Order Service calls Menu Service to verify prices
3. Check the response has correct total

### Step 6: Test Delivery Service
1. Run "Create Delivery" for an order
2. Run "Assign Delivery Person"
3. Update status through the delivery lifecycle

### Step 7: Test Health
1. Run all health check requests
2. All should return {"status": "UP"}

## Demonstration Workflow

1. GET /api/foods/available → See available food
2. POST /api/orders → Create order (Menu Service called automatically)
3. PATCH /api/orders/1/status → CONFIRMED (triggers delivery creation)
4. PATCH /api/deliveries/1/assign → Assign delivery person
5. PATCH /api/deliveries/1/status → PICKED_UP
6. PATCH /api/deliveries/1/status → OUT_FOR_DELIVERY
7. PATCH /api/deliveries/1/status → DELIVERED
8. PATCH /api/orders/1/status → DELIVERED
`,

  "docs/java-project-explanation.md": `# Java Project Explanation

## What Each Layer Does

### Entity Layer
Entities represent database tables. Each entity maps to one table.
- \`@Entity\` marks a class as a database table
- \`@Table(name = "...")\` specifies the table name
- \`@Id\` marks the primary key
- Fields map to columns

### DTO Layer
DTOs (Data Transfer Objects) are used for API input/output.
- Separate from entities to control what data is exposed
- Contain validation annotations (\`@NotBlank\`, \`@Min\`, etc.)
- Request DTOs = input validation
- Response DTOs = output formatting

### Controller Layer
Controllers handle HTTP requests.
- \`@Path\` defines the URL
- \`@GET\`, \`@POST\`, \`@PUT\`, \`@DELETE\` define HTTP methods
- Controllers should be thin - delegate to services

### Service Layer
Services contain business logic.
- Called by controllers
- Perform validation, calculations, and orchestration
- \`@Transactional\` ensures database operations are atomic

### Repository Layer
Repositories handle database operations.
- Extend \`PanacheRepository<Entity>\` for built-in CRUD
- Add custom query methods as needed

### REST Client
REST Clients call other microservices.
- \`@RegisterRestClient\` marks an interface as a REST client
- Quarkus generates the implementation automatically
- URL configured in application.properties

### Exception Handler
Global exception handler converts exceptions to HTTP responses.
- \`@Provider\` registers it with JAX-RS
- Returns consistent JSON error format

### Health Check
Health checks report service status.
- \`@Liveness\` for liveness probes
- \`@Readiness\` for readiness probes
- Used by Kubernetes/Docker for monitoring
`
};
