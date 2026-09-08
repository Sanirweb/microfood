// Postman Collection
export const postmanCollection = `{
  "info": {
    "name": "Food Delivery Microservices",
    "description": "Complete API collection for Menu, Order, and Delivery microservices",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "menu_url", "value": "http://localhost:8081" },
    { "key": "order_url", "value": "http://localhost:8082" },
    { "key": "delivery_url", "value": "http://localhost:8083" }
  ],
  "item": [
    {
      "name": "Menu Service",
      "item": [
        {
          "name": "Get All Categories",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{menu_url}}/api/categories"
          }
        },
        {
          "name": "Get Category by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{menu_url}}/api/categories/1"
          }
        },
        {
          "name": "Create Category",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"name\\": \\"Salads\\",\\n  \\"description\\": \\"Fresh and healthy salads\\"\\n}"
            },
            "url": "{{menu_url}}/api/categories"
          }
        },
        {
          "name": "Update Category",
          "request": {
            "method": "PUT",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"name\\": \\"Updated Salads\\",\\n  \\"description\\": \\"Fresh organic salads\\"\\n}"
            },
            "url": "{{menu_url}}/api/categories/1"
          }
        },
        {
          "name": "Delete Category",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": "{{menu_url}}/api/categories/1"
          }
        },
        {
          "name": "Get All Foods",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{menu_url}}/api/foods"
          }
        },
        {
          "name": "Get Food by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{menu_url}}/api/foods/1"
          }
        },
        {
          "name": "Get Foods by Category",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{menu_url}}/api/foods/category/1"
          }
        },
        {
          "name": "Get Available Foods",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{menu_url}}/api/foods/available"
          }
        },
        {
          "name": "Create Food",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"name\\": \\"Paneer Momo\\",\\n  \\"description\\": \\"Steamed momos with paneer filling\\",\\n  \\"price\\": 160.00,\\n  \\"categoryId\\": 1,\\n  \\"available\\": true\\n}"
            },
            "url": "{{menu_url}}/api/foods"
          }
        },
        {
          "name": "Update Food",
          "request": {
            "method": "PUT",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"name\\": \\"Chicken Momo\\",\\n  \\"description\\": \\"Steamed chicken dumplings with spicy achar\\",\\n  \\"price\\": 200.00,\\n  \\"categoryId\\": 1,\\n  \\"available\\": true\\n}"
            },
            "url": "{{menu_url}}/api/foods/1"
          }
        },
        {
          "name": "Toggle Availability",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"available\\": false\\n}"
            },
            "url": "{{menu_url}}/api/foods/1/availability"
          }
        },
        {
          "name": "Delete Food",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": "{{menu_url}}/api/foods/1"
          }
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
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"customerName\\": \\"Ram Sharma\\",\\n  \\"customerPhone\\": \\"9801234567\\",\\n  \\"customerEmail\\": \\"ram@email.com\\",\\n  \\"deliveryAddress\\": \\"Putalisadak, Kathmandu\\",\\n  \\"items\\": [\\n    { \\"foodId\\": 1, \\"quantity\\": 2 },\\n    { \\"foodId\\": 6, \\"quantity\\": 1 }\\n  ]\\n}"
            },
            "url": "{{order_url}}/api/orders"
          }
        },
        {
          "name": "Get All Orders",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{order_url}}/api/orders"
          }
        },
        {
          "name": "Get Order by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{order_url}}/api/orders/1"
          }
        },
        {
          "name": "Get Orders by Status",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{order_url}}/api/orders/status/PENDING"
          }
        },
        {
          "name": "Update Order Status",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"status\\": \\"CONFIRMED\\"\\n}"
            },
            "url": "{{order_url}}/api/orders/1/status"
          }
        },
        {
          "name": "Update Order",
          "request": {
            "method": "PUT",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"customerName\\": \\"Ram Sharma\\",\\n  \\"customerPhone\\": \\"9801234567\\",\\n  \\"deliveryAddress\\": \\"Baneshwor, Kathmandu\\",\\n  \\"items\\": [\\n    { \\"foodId\\": 1, \\"quantity\\": 3 }\\n  ]\\n}"
            },
            "url": "{{order_url}}/api/orders/1"
          }
        },
        {
          "name": "Cancel Order",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": "{{order_url}}/api/orders/1"
          }
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
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"orderId\\": 1,\\n  \\"deliveryAddress\\": \\"Putalisadak, Kathmandu\\"\\n}"
            },
            "url": "{{delivery_url}}/api/deliveries"
          }
        },
        {
          "name": "Get All Deliveries",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{delivery_url}}/api/deliveries"
          }
        },
        {
          "name": "Get Delivery by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{delivery_url}}/api/deliveries/1"
          }
        },
        {
          "name": "Get Delivery by Order",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{delivery_url}}/api/deliveries/order/1"
          }
        },
        {
          "name": "Assign Delivery Person",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"deliveryPersonName\\": \\"Ram Bahadur\\",\\n  \\"deliveryPersonPhone\\": \\"9841000001\\"\\n}"
            },
            "url": "{{delivery_url}}/api/deliveries/1/assign"
          }
        },
        {
          "name": "Update Delivery Status",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"status\\": \\"PICKED_UP\\"\\n}"
            },
            "url": "{{delivery_url}}/api/deliveries/1/status"
          }
        },
        {
          "name": "Cancel Delivery",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": "{{delivery_url}}/api/deliveries/1"
          }
        }
      ]
    },
    {
      "name": "Health Checks",
      "item": [
        {
          "name": "Menu Service Health",
          "request": { "method": "GET", "url": "{{menu_url}}/q/health" }
        },
        {
          "name": "Menu Service Liveness",
          "request": { "method": "GET", "url": "{{menu_url}}/q/health/live" }
        },
        {
          "name": "Menu Service Readiness",
          "request": { "method": "GET", "url": "{{menu_url}}/q/health/ready" }
        },
        {
          "name": "Order Service Health",
          "request": { "method": "GET", "url": "{{order_url}}/q/health" }
        },
        {
          "name": "Order Service Liveness",
          "request": { "method": "GET", "url": "{{order_url}}/q/health/live" }
        },
        {
          "name": "Order Service Readiness",
          "request": { "method": "GET", "url": "{{order_url}}/q/health/ready" }
        },
        {
          "name": "Delivery Service Health",
          "request": { "method": "GET", "url": "{{delivery_url}}/q/health" }
        },
        {
          "name": "Delivery Service Liveness",
          "request": { "method": "GET", "url": "{{delivery_url}}/q/health/live" }
        },
        {
          "name": "Delivery Service Readiness",
          "request": { "method": "GET", "url": "{{delivery_url}}/q/health/ready" }
        }
      ]
    }
  ]
}`;

export const postmanEnvironment = `{
  "name": "Food Delivery - Local",
  "values": [
    { "key": "menu_url", "value": "http://localhost:8081", "enabled": true },
    { "key": "order_url", "value": "http://localhost:8082", "enabled": true },
    { "key": "delivery_url", "value": "http://localhost:8083", "enabled": true }
  ],
  "_postman_variable_scope": "environment"
}`;

export const readme = `# 🍕 Food Delivery Microservices System

A complete microservices backend built with **Java 17**, **Quarkus 3.8.1**, and **MicroProfile Health**.

## 🏗️ Architecture

Three independent microservices communicating via REST APIs:

| Service | Port | Database | Purpose |
|---------|------|----------|---------|
| Menu Service | 8081 | food_menu_db | Food items, categories, prices |
| Order Service | 8082 | food_order_db | Customer orders, order items |
| Delivery Service | 8083 | food_delivery_db | Delivery tracking |

## 🛠️ Technology Stack

- **Java 17** - Programming language
- **Quarkus 3.8.1** - Supersonic Subatomic Java framework
- **MicroProfile** - Enterprise Java microservices specs
- **MicroProfile Health** - Service health monitoring
- **Hibernate ORM + Panache** - Database access
- **MySQL 8.x** - Database
- **Maven** - Build tool
- **Docker** - Containerization

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.x

### Setup

1. **Create databases:**
\`\`\`bash
mysql -u root -p < database/menu-service.sql
mysql -u root -p < database/order-service.sql
mysql -u root -p < database/delivery-service.sql
\`\`\`

2. **Configure database credentials** in each service's \`application.properties\`

3. **Start services** (in separate terminals):
\`\`\`bash
# Terminal 1
cd menu-service && mvn quarkus:dev

# Terminal 2
cd order-service && mvn quarkus:dev

# Terminal 3
cd delivery-service && mvn quarkus:dev
\`\`\`

4. **Verify** - Open http://localhost:8081/q/health

## 📡 API Endpoints

### Menu Service (8081)
- \`GET /api/categories\` - List categories
- \`GET /api/foods\` - List foods
- \`GET /api/foods/available\` - Available foods
- \`POST /api/foods\` - Create food
- \`PATCH /api/foods/{id}/availability\` - Toggle availability

### Order Service (8082)
- \`POST /api/orders\` - Create order
- \`GET /api/orders\` - List orders
- \`PATCH /api/orders/{id}/status\` - Update status

### Delivery Service (8083)
- \`POST /api/deliveries\` - Create delivery
- \`PATCH /api/deliveries/{id}/assign\` - Assign person
- \`PATCH /api/deliveries/{id}/status\` - Update status

## 🏥 Health Checks
- \`/q/health\` - Overall health
- \`/q/health/live\` - Liveness
- \`/q/health/ready\` - Readiness

## 🐳 Docker
\`\`\`bash
docker compose up --build
docker compose down
\`\`\`

## 📋 Documentation
- [Setup Guide](docs/setup-guide.md)
- [API Documentation](docs/api-documentation.md)
- [Architecture](docs/architecture.md)
- [Testing Guide](docs/testing-guide.md)
`;
