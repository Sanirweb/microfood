// Database SQL Scripts
export const menuServiceSQL = `-- ============================================
-- MENU SERVICE DATABASE SETUP
-- Database: food_menu_db
-- ============================================

CREATE DATABASE IF NOT EXISTS food_menu_db;
USE food_menu_db;

-- ============================================
-- TABLE: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLE: foods
-- ============================================
CREATE TABLE IF NOT EXISTS foods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    price DECIMAL(10, 2) NOT NULL,
    category_id BIGINT NOT NULL,
    image_url VARCHAR(500),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_category (category_id),
    INDEX idx_available (available),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SAMPLE DATA: Categories
-- ============================================
INSERT INTO categories (name, description) VALUES
('Momo', 'Traditional Nepalese dumplings - steamed, fried, or boiled'),
('Burger', 'Juicy burgers with various fillings and toppings'),
('Pizza', 'Italian-style pizzas with different toppings'),
('Drinks', 'Refreshing beverages and soft drinks'),
('Desserts', 'Sweet treats and desserts'),
('Nepali Food', 'Traditional Nepalese cuisine and dishes'),
('Fast Food', 'Quick snacks and fast food items'),
('Noodles', 'Various noodle dishes');

-- ============================================
-- SAMPLE DATA: Food Items
-- ============================================
INSERT INTO foods (name, description, price, category_id, image_url, available) VALUES
-- Momo (category_id = 1)
('Chicken Momo', 'Steamed chicken dumplings served with spicy achar', 180.00, 1, NULL, TRUE),
('Veg Momo', 'Steamed vegetable dumplings with mixed vegetables', 140.00, 1, NULL, TRUE),
('Buff Momo', 'Steamed buffalo meat dumplings - traditional Nepali style', 200.00, 1, NULL, TRUE),
('Fried Momo', 'Deep fried crispy momos served with tomato chutney', 200.00, 1, NULL, TRUE),
('C. Cheese Momo', 'Chicken momos with melted cheese filling', 220.00, 1, NULL, TRUE),

-- Burger (category_id = 2)
('Chicken Burger', 'Grilled chicken patty with lettuce, tomato, and special sauce', 300.00, 2, NULL, TRUE),
('Veg Burger', 'Crispy vegetable patty with fresh vegetables and mayo', 250.00, 2, NULL, TRUE),
('Buff Burger', 'Juicy buffalo meat burger with cheese and onions', 350.00, 2, NULL, TRUE),

-- Pizza (category_id = 3)
('Cheese Pizza', 'Classic cheese pizza with mozzarella and herbs', 450.00, 3, NULL, TRUE),
('Veg Pizza', 'Loaded with bell peppers, onions, mushrooms, and olives', 400.00, 3, NULL, TRUE),
('Chicken Pizza', 'Topped with grilled chicken, peppers, and extra cheese', 500.00, 3, NULL, TRUE),
('Pepperoni Pizza', 'Classic pepperoni with mozzarella cheese', 550.00, 3, NULL, TRUE),

-- Drinks (category_id = 4)
('Coke', 'Chilled Coca-Cola 330ml can', 80.00, 4, NULL, TRUE),
('Fanta', 'Orange flavored Fanta 330ml can', 80.00, 4, NULL, TRUE),
('Mineral Water', 'Pure drinking water 500ml bottle', 30.00, 4, NULL, TRUE),
('Fresh Lime Soda', 'Fresh lime juice with soda and mint', 120.00, 4, NULL, TRUE),
('Milk Shake', 'Creamy chocolate milkshake', 180.00, 4, NULL, TRUE),

-- Desserts (category_id = 5)
('Ice Cream', 'Vanilla ice cream with chocolate sauce', 150.00, 5, NULL, TRUE),
('Gulab Jamun', 'Soft milk dumplings in sugar syrup (2 pcs)', 100.00, 5, NULL, TRUE),
('Brownie', 'Warm chocolate brownie with ice cream', 200.00, 5, NULL, TRUE),

-- Nepali Food (category_id = 6)
('Dal Bhat Set', 'Traditional Nepali meal - rice, dal, tarkari, achar', 350.00, 6, NULL, TRUE),
('Chatamari', 'Newari rice flour crepe with minced meat topping', 250.00, 6, NULL, TRUE),
('Chowmein', 'Stir-fried noodles with vegetables and chicken', 200.00, 6, NULL, TRUE),

-- Fast Food (category_id = 7)
('French Fries', 'Crispy golden french fries with ketchup', 150.00, 7, NULL, TRUE),
('Chicken Wings', 'Spicy fried chicken wings (6 pcs)', 350.00, 7, NULL, TRUE),

-- Noodles (category_id = 8)
('Thukpa', 'Hot Tibetan noodle soup with vegetables and meat', 220.00, 8, NULL, TRUE),
('Thenthuk', 'Hand-pulled noodle soup - traditional Tibetan style', 200.00, 8, NULL, TRUE);`;

export const orderServiceSQL = `-- ============================================
-- ORDER SERVICE DATABASE SETUP
-- Database: food_order_db
-- ============================================

CREATE DATABASE IF NOT EXISTS food_order_db;
USE food_order_db;

-- ============================================
-- TABLE: orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(200),
    delivery_address VARCHAR(500) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_customer_phone (customer_phone),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLE: order_items
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    food_id BIGINT NOT NULL,
    food_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_food (food_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SAMPLE DATA: Orders
-- ============================================
INSERT INTO orders (customer_name, customer_phone, customer_email, delivery_address, total_amount, status) VALUES
('Ram Sharma', '9801234567', 'ram@email.com', 'Putalisadak, Kathmandu', 540.00, 'PENDING'),
('Sita Thapa', '9812345678', 'sita@email.com', 'Baneshwor, Kathmandu', 880.00, 'CONFIRMED'),
('Hari Prasad', '9823456789', 'hari@email.com', 'Lalitpur, Nepal', 450.00, 'PREPARING'),
('Gita Adhikari', '9834567890', 'gita@email.com', 'Bhaktapur, Nepal', 1080.00, 'READY'),
('Krishna Rai', '9845678901', 'krishna@email.com', 'Kalanki, Kathmandu', 350.00, 'DELIVERED');

-- ============================================
-- SAMPLE DATA: Order Items
-- ============================================
INSERT INTO order_items (order_id, food_id, food_name, quantity, unit_price, subtotal) VALUES
-- Order 1: Ram Sharma - Chicken Momo x 2 + Coke x 1
(1, 1, 'Chicken Momo', 2, 180.00, 360.00),
(1, 13, 'Coke', 1, 80.00, 80.00),
(1, 27, 'French Fries', 1, 150.00, 150.00),

-- Order 2: Sita Thapa - Cheese Pizza x 1 + Chicken Momo x 1
(2, 9, 'Cheese Pizza', 1, 450.00, 450.00),
(2, 1, 'Chicken Momo', 1, 180.00, 180.00),
(2, 27, 'French Fries', 1, 150.00, 150.00),
(2, 13, 'Coke', 1, 80.00, 80.00),

-- Order 3: Hari Prasad - Chicken Burger x 1 + Coke x 1
(3, 6, 'Chicken Burger', 1, 300.00, 300.00),
(3, 13, 'Coke', 1, 80.00, 80.00),
(3, 17, 'Ice Cream', 1, 150.00, 150.00),

-- Order 4: Gita Adhikari - Dal Bhat x 2 + Fresh Lime Soda x 2
(4, 22, 'Dal Bhat Set', 2, 350.00, 700.00),
(4, 16, 'Fresh Lime Soda', 2, 120.00, 240.00),
(4, 19, 'Gulab Jamun', 1, 100.00, 100.00),

-- Order 5: Krishna Rai - Veg Momo x 2 + Fanta x 1
(5, 2, 'Veg Momo', 2, 140.00, 280.00),
(5, 14, 'Fanta', 1, 80.00, 80.00);`;

export const deliveryServiceSQL = `-- ============================================
-- DELIVERY SERVICE DATABASE SETUP
-- Database: food_delivery_db
-- ============================================

CREATE DATABASE IF NOT EXISTS food_delivery_db;
USE food_delivery_db;

-- ============================================
-- TABLE: deliveries
-- ============================================
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    delivery_person_name VARCHAR(200),
    delivery_person_phone VARCHAR(20),
    delivery_address VARCHAR(500) NOT NULL,
    status ENUM('UNASSIGNED', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'UNASSIGNED',
    estimated_delivery_time DATETIME,
    assigned_at DATETIME,
    picked_up_at DATETIME,
    delivered_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order (order_id),
    INDEX idx_status (status),
    INDEX idx_delivery_person (delivery_person_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SAMPLE DATA: Deliveries
-- ============================================
INSERT INTO deliveries (order_id, delivery_person_name, delivery_person_phone, delivery_address, status, estimated_delivery_time, assigned_at, picked_up_at, delivered_at) VALUES
(2, 'Ram Bahadur', '9841000001', 'Baneshwor, Kathmandu', 'PICKED_UP', '2026-01-15 12:30:00', '2026-01-15 12:00:00', '2026-01-15 12:15:00', NULL),
(3, NULL, NULL, 'Lalitpur, Nepal', 'UNASSIGNED', '2026-01-15 13:00:00', NULL, NULL, NULL),
(4, 'Sita Gurung', '9841000002', 'Bhaktapur, Nepal', 'ASSIGNED', '2026-01-15 13:30:00', '2026-01-15 12:45:00', NULL, NULL),
(5, 'Bikash Tamang', '9841000003', 'Kalanki, Kathmandu', 'DELIVERED', '2026-01-15 11:30:00', '2026-01-15 10:45:00', '2026-01-15 11:00:00', '2026-01-15 11:25:00'),
(1, NULL, NULL, 'Putalisadak, Kathmandu', 'UNASSIGNED', '2026-01-15 14:00:00', NULL, NULL, NULL);`;

// Docker Compose
export const dockerCompose = `version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: food-delivery-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: food_menu_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/menu-service.sql:/docker-entrypoint-initdb.d/01-menu.sql
      - ./database/order-service.sql:/docker-entrypoint-initdb.d/02-order.sql
      - ./database/delivery-service.sql:/docker-entrypoint-initdb.d/03-delivery.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - food-network

  # Menu Service
  menu-service:
    build:
      context: ./menu-service
      dockerfile: Dockerfile
    container_name: menu-service
    ports:
      - "8081:8081"
    environment:
      QUARKUS_DATASOURCE_JDBC_URL: jdbc:mysql://mysql:3306/food_menu_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      QUARKUS_DATASOURCE_USERNAME: root
      QUARKUS_DATASOURCE_PASSWORD: root123
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - food-network

  # Order Service
  order-service:
    build:
      context: ./order-service
      dockerfile: Dockerfile
    container_name: order-service
    ports:
      - "8082:8082"
    environment:
      QUARKUS_DATASOURCE_JDBC_URL: jdbc:mysql://mysql:3306/food_order_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      QUARKUS_DATASOURCE_USERNAME: root
      QUARKUS_DATASOURCE_PASSWORD: root123
      # Point to menu-service container
      COM_FOODDELIVERY_ORDER_CLIENT_MENUSERVICECLIENT_MP_REST_URL: http://menu-service:8081
      COM_FOODDELIVERY_ORDER_CLIENT_DELIVERYSERVICECLIENT_MP_REST_URL: http://delivery-service:8083
    depends_on:
      mysql:
        condition: service_healthy
      menu-service:
        condition: service_started
    networks:
      - food-network

  # Delivery Service
  delivery-service:
    build:
      context: ./delivery-service
      dockerfile: Dockerfile
    container_name: delivery-service
    ports:
      - "8083:8083"
    environment:
      QUARKUS_DATASOURCE_JDBC_URL: jdbc:mysql://mysql:3306/food_delivery_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      QUARKUS_DATASOURCE_USERNAME: root
      QUARKUS_DATASOURCE_PASSWORD: root123
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - food-network

volumes:
  mysql_data:

networks:
  food-network:
    driver: bridge`;

export const dockerfile = `# Multi-stage Dockerfile for Quarkus Service
# Build Stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/quarkus-app/lib/ ./lib/
COPY --from=build /app/target/quarkus-app/*.jar ./
COPY --from=build /app/target/quarkus-app/app/ ./app/
COPY --from=build /app/target/quarkus-app/quarkus/ ./quarkus/

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "quarkus-run.jar"]`;

export const gitignore = `# Build output
target/

# IDE
.idea/
*.iml
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Environment
.env
.env.local`;
