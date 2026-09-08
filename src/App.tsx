import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Database, Server, FileCode, BookOpen, Terminal, Heart,
  ChevronRight, Copy, Check, Folder, FolderOpen, Menu, X,
  Package, Settings, TestTube, Container, Globe
} from 'lucide-react';
import * as menuData from './data/menuService';
import * as orderData from './data/orderService';
import * as deliveryData from './data/deliveryService';
import * as infraData from './data/infrastructure';

type Section = 'overview' | 'setup' | 'menu-service' | 'order-service' | 'delivery-service' | 'database' | 'docker' | 'api' | 'health' | 'testing' | 'postman';

interface FileItem {
  name: string;
  path: string;
  content: string;
  language: string;
}

function App() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [activeFile, setActiveFile] = useState<string>('');
  const [copiedFile, setCopiedFile] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const copyToClipboard = (text: string, fileName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(''), 2000);
  };

  const menuServiceFiles: FileItem[] = [
    { name: 'pom.xml', path: 'menu-service/pom.xml', content: menuData.menuServicePom, language: 'xml' },
    { name: 'application.properties', path: 'menu-service/src/main/resources/application.properties', content: menuData.menuServiceProperties, language: 'properties' },
    { name: 'Category.java', path: 'menu-service/.../entity/Category.java', content: menuData.categoryEntity, language: 'java' },
    { name: 'Food.java', path: 'menu-service/.../entity/Food.java', content: menuData.foodEntity, language: 'java' },
    { name: 'CategoryRepository.java', path: 'menu-service/.../repository/CategoryRepository.java', content: menuData.categoryRepository, language: 'java' },
    { name: 'FoodRepository.java', path: 'menu-service/.../repository/FoodRepository.java', content: menuData.foodRepository, language: 'java' },
    { name: 'CategoryRequest.java', path: 'menu-service/.../dto/CategoryRequest.java', content: menuData.categoryDto, language: 'java' },
    { name: 'CategoryResponse.java', path: 'menu-service/.../dto/CategoryResponse.java', content: menuData.categoryResponseDto, language: 'java' },
    { name: 'FoodRequest.java', path: 'menu-service/.../dto/FoodRequest.java', content: menuData.foodDto, language: 'java' },
    { name: 'FoodResponse.java', path: 'menu-service/.../dto/FoodResponse.java', content: menuData.foodResponseDto, language: 'java' },
    { name: 'CategoryMapper.java', path: 'menu-service/.../mapper/CategoryMapper.java', content: menuData.categoryMapper, language: 'java' },
    { name: 'FoodMapper.java', path: 'menu-service/.../mapper/FoodMapper.java', content: menuData.foodMapper, language: 'java' },
    { name: 'CategoryService.java', path: 'menu-service/.../service/CategoryService.java', content: menuData.categoryServiceClass, language: 'java' },
    { name: 'FoodService.java', path: 'menu-service/.../service/FoodService.java', content: menuData.menuServiceClass, language: 'java' },
    { name: 'CategoryController.java', path: 'menu-service/.../controller/CategoryController.java', content: menuData.categoryController, language: 'java' },
    { name: 'FoodController.java', path: 'menu-service/.../controller/FoodController.java', content: menuData.menuController, language: 'java' },
    { name: 'Exceptions.java', path: 'menu-service/.../exception/*.java', content: menuData.exceptionClasses, language: 'java' },
    { name: 'HealthChecks.java', path: 'menu-service/.../health/MenuHealthChecks.java', content: menuData.menuHealthCheck, language: 'java' },
    { name: 'MenuServiceTest.java', path: 'menu-service/.../test/MenuServiceTest.java', content: menuData.menuServiceTest, language: 'java' },
  ];

  const orderServiceFiles: FileItem[] = [
    { name: 'pom.xml', path: 'order-service/pom.xml', content: orderData.orderServicePom, language: 'xml' },
    { name: 'application.properties', path: 'order-service/src/main/resources/application.properties', content: orderData.orderServiceProperties, language: 'properties' },
    { name: 'Order.java', path: 'order-service/.../entity/Order.java', content: orderData.orderEntity, language: 'java' },
    { name: 'OrderStatus.java', path: 'order-service/.../entity/OrderStatus.java', content: orderData.orderStatusEnum, language: 'java' },
    { name: 'OrderItem.java', path: 'order-service/.../entity/OrderItem.java', content: orderData.orderItemEntity, language: 'java' },
    { name: 'OrderRepository.java', path: 'order-service/.../repository/OrderRepository.java', content: orderData.orderRepository, language: 'java' },
    { name: 'MenuServiceClient.java', path: 'order-service/.../client/MenuServiceClient.java', content: orderData.menuServiceClient, language: 'java' },
    { name: 'DeliveryServiceClient.java', path: 'order-service/.../client/DeliveryServiceClient.java', content: orderData.deliveryServiceClient, language: 'java' },
    { name: 'OrderRequest.java', path: 'order-service/.../dto/OrderRequest.java', content: orderData.orderDto, language: 'java' },
    { name: 'OrderItemRequest.java', path: 'order-service/.../dto/OrderItemRequest.java', content: orderData.orderItemDto, language: 'java' },
    { name: 'OrderResponse.java', path: 'order-service/.../dto/OrderResponse.java', content: orderData.orderResponseDto, language: 'java' },
    { name: 'OrderItemResponse.java', path: 'order-service/.../dto/OrderItemResponse.java', content: orderData.orderItemResponseDto, language: 'java' },
    { name: 'OrderService.java', path: 'order-service/.../service/OrderService.java', content: orderData.orderServiceClass, language: 'java' },
    { name: 'OrderController.java', path: 'order-service/.../controller/OrderController.java', content: orderData.orderController, language: 'java' },
    { name: 'Exceptions.java', path: 'order-service/.../exception/*.java', content: orderData.orderExceptionClasses, language: 'java' },
    { name: 'HealthChecks.java', path: 'order-service/.../health/OrderHealthChecks.java', content: orderData.orderHealthCheck, language: 'java' },
    { name: 'OrderServiceTest.java', path: 'order-service/.../test/OrderServiceTest.java', content: orderData.orderServiceTest, language: 'java' },
  ];

  const deliveryServiceFiles: FileItem[] = [
    { name: 'pom.xml', path: 'delivery-service/pom.xml', content: deliveryData.deliveryServicePom, language: 'xml' },
    { name: 'application.properties', path: 'delivery-service/src/main/resources/application.properties', content: deliveryData.deliveryServiceProperties, language: 'properties' },
    { name: 'Delivery.java', path: 'delivery-service/.../entity/Delivery.java', content: deliveryData.deliveryEntity, language: 'java' },
    { name: 'DeliveryStatus.java', path: 'delivery-service/.../entity/DeliveryStatus.java', content: deliveryData.deliveryStatusEnum, language: 'java' },
    { name: 'DeliveryRepository.java', path: 'delivery-service/.../repository/DeliveryRepository.java', content: deliveryData.deliveryRepository, language: 'java' },
    { name: 'DeliveryRequest.java', path: 'delivery-service/.../dto/DeliveryRequest.java', content: deliveryData.deliveryDto, language: 'java' },
    { name: 'DeliveryResponse.java', path: 'delivery-service/.../dto/DeliveryResponse.java', content: deliveryData.deliveryResponseDto, language: 'java' },
    { name: 'DeliveryService.java', path: 'delivery-service/.../service/DeliveryService.java', content: deliveryData.deliveryServiceClass, language: 'java' },
    { name: 'DeliveryController.java', path: 'delivery-service/.../controller/DeliveryController.java', content: deliveryData.deliveryController, language: 'java' },
    { name: 'Exceptions.java', path: 'delivery-service/.../exception/*.java', content: deliveryData.deliveryExceptionClasses, language: 'java' },
    { name: 'HealthChecks.java', path: 'delivery-service/.../health/DeliveryHealthChecks.java', content: deliveryData.deliveryHealthCheck, language: 'java' },
    { name: 'DeliveryServiceTest.java', path: 'delivery-service/.../test/DeliveryServiceTest.java', content: deliveryData.deliveryServiceTest, language: 'java' },
  ];

  const navItems = [
    { id: 'overview' as Section, label: 'Overview', icon: BookOpen },
    { id: 'setup' as Section, label: 'Setup Guide', icon: Terminal },
    { id: 'menu-service' as Section, label: 'Menu Service', icon: Server },
    { id: 'order-service' as Section, label: 'Order Service', icon: Server },
    { id: 'delivery-service' as Section, label: 'Delivery Service', icon: Server },
    { id: 'database' as Section, label: 'Database Scripts', icon: Database },
    { id: 'docker' as Section, label: 'Docker', icon: Container },
    { id: 'api' as Section, label: 'API Documentation', icon: Globe },
    { id: 'health' as Section, label: 'Health Checks', icon: Heart },
    { id: 'testing' as Section, label: 'Testing Guide', icon: TestTube },
    { id: 'postman' as Section, label: 'Postman Collection', icon: Package },
  ];

  const CodeBlock = ({ content, language, fileName }: { content: string; language: string; fileName: string }) => (
    <div className="relative rounded-lg overflow-hidden border border-slate-700 mb-4">
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b border-slate-700">
        <span className="text-sm text-slate-400 font-mono">{fileName}</span>
        <button
          onClick={() => copyToClipboard(content, fileName)}
          className="copy-btn flex items-center gap-1 px-2 py-1 rounded text-xs bg-slate-700 hover:bg-slate-600 text-slate-300"
        >
          {copiedFile === fileName ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copiedFile === fileName ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '1rem', fontSize: '13px', background: '#1a1a2e' }}
        wrapLongLines={true}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );

  const FileExplorer = ({ files }: { files: FileItem[] }) => (
    <div className="space-y-1">
      {files.map((file) => (
        <button
          key={file.path}
          onClick={() => setActiveFile(file.path)}
          className={`w-full text-left px-3 py-2 rounded text-sm font-mono flex items-center gap-2 transition-colors ${
            activeFile === file.path
              ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
              : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
          }`}
        >
          <FileCode size={14} />
          {file.name}
        </button>
      ))}
    </div>
  );

  const renderOverview = () => (
    <div className="fade-in space-y-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-white mb-4">🍕 Food Delivery Microservices System</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          A complete microservices backend built with Java, Quarkus, and MicroProfile Health.
          Three independent services communicating via REST APIs.
        </p>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">System Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-lg p-6 border border-blue-700/30 text-center">
            <Server className="mx-auto mb-3 text-blue-400" size={40} />
            <h3 className="text-lg font-bold text-blue-300">Menu Service</h3>
            <p className="text-slate-400 text-sm mt-2">Port 8081</p>
            <div className="mt-3 text-xs text-slate-500">
              <p>• Food items</p>
              <p>• Categories</p>
              <p>• Prices</p>
              <p>• Availability</p>
            </div>
            <Database className="mx-auto mt-3 text-blue-500" size={24} />
            <p className="text-xs text-slate-500 mt-1">food_menu_db</p>
          </div>

          <div className="bg-gradient-to-b from-green-900/30 to-green-900/10 rounded-lg p-6 border border-green-700/30 text-center">
            <Server className="mx-auto mb-3 text-green-400" size={40} />
            <h3 className="text-lg font-bold text-green-300">Order Service</h3>
            <p className="text-slate-400 text-sm mt-2">Port 8082</p>
            <div className="mt-3 text-xs text-slate-500">
              <p>• Customer orders</p>
              <p>• Order items</p>
              <p>• Status tracking</p>
              <p>• Price calculation</p>
            </div>
            <Database className="mx-auto mt-3 text-green-500" size={24} />
            <p className="text-xs text-slate-500 mt-1">food_order_db</p>
          </div>

          <div className="bg-gradient-to-b from-purple-900/30 to-purple-900/10 rounded-lg p-6 border border-purple-700/30 text-center">
            <Server className="mx-auto mb-3 text-purple-400" size={40} />
            <h3 className="text-lg font-bold text-purple-300">Delivery Service</h3>
            <p className="text-slate-400 text-sm mt-2">Port 8083</p>
            <div className="mt-3 text-xs text-slate-500">
              <p>• Delivery records</p>
              <p>• Delivery persons</p>
              <p>• Status tracking</p>
              <p>• Time estimates</p>
            </div>
            <Database className="mx-auto mt-3 text-purple-500" size={24} />
            <p className="text-xs text-slate-500 mt-1">food_delivery_db</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-700/50 rounded-full px-6 py-3">
            <Globe className="text-yellow-400" size={20} />
            <span className="text-slate-300">Client / Postman → REST APIs → Services → Databases</span>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Settings size={20} className="text-blue-400" /> Technology Stack
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-400" /> Java 17</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-400" /> Quarkus 3.8.1</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-400" /> MicroProfile Health</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-400" /> RESTEasy Reactive</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-400" /> Hibernate ORM + Panache</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-400" /> MySQL 8.x</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-400" /> Maven</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-400" /> Docker & Docker Compose</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-green-400" /> Key Features
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-green-400" /> 3 Independent Microservices</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-green-400" /> REST API Communication</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-green-400" /> MicroProfile Health Checks</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-green-400" /> Input Validation</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-green-400" /> Global Error Handling</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-green-400" /> Swagger/OpenAPI Documentation</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-green-400" /> Service-to-Service Communication</li>
            <li className="flex items-center gap-2"><ChevronRight size={14} className="text-green-400" /> Automated Tests</li>
          </ul>
        </div>
      </div>

      {/* Project Structure */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Folder size={20} className="text-yellow-400" /> Project Structure
        </h3>
        <div className="font-mono text-sm text-slate-300 space-y-1">
          <p className="text-yellow-300">food-delivery-microservices/</p>
          <p className="pl-4">├── README.md</p>
          <p className="pl-4">├── docker-compose.yml</p>
          <p className="pl-4">├── docs/</p>
          <p className="pl-8 text-slate-500">├── setup-guide.md</p>
          <p className="pl-8 text-slate-500">├── api-documentation.md</p>
          <p className="pl-8 text-slate-500">└── architecture.md</p>
          <p className="pl-4">├── database/</p>
          <p className="pl-8 text-blue-400">├── menu-service.sql</p>
          <p className="pl-8 text-green-400">├── order-service.sql</p>
          <p className="pl-8 text-purple-400">└── delivery-service.sql</p>
          <p className="pl-4">├── postman/</p>
          <p className="pl-8 text-slate-500">└── collection.json</p>
          <p className="pl-4 text-blue-300">├── menu-service/</p>
          <p className="pl-8 text-slate-500">├── pom.xml</p>
          <p className="pl-8 text-slate-500">└── src/</p>
          <p className="pl-4 text-green-300">├── order-service/</p>
          <p className="pl-8 text-slate-500">├── pom.xml</p>
          <p className="pl-8 text-slate-500">└── src/</p>
          <p className="pl-4 text-purple-300">└── delivery-service/</p>
          <p className="pl-8 text-slate-500">├── pom.xml</p>
          <p className="pl-8 text-slate-500">└── src/</p>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-700/30">
        <h3 className="text-xl font-bold text-white mb-4">🚀 Quick Start</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-blue-300 font-bold mb-2">1. Start Menu Service</p>
            <code className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">cd menu-service && mvn quarkus:dev</code>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-green-300 font-bold mb-2">2. Start Order Service</p>
            <code className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">cd order-service && mvn quarkus:dev</code>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-purple-300 font-bold mb-2">3. Start Delivery Service</p>
            <code className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">cd delivery-service && mvn quarkus:dev</code>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSetup = () => (
    <div className="fade-in space-y-6">
      <h1 className="text-3xl font-bold text-white">📋 Complete Setup Guide (Windows)</h1>
      <p className="text-slate-400">Follow these steps carefully to set up and run the project on your Windows PC.</p>

      <div className="space-y-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-blue-300 mb-3">STEP 1 — Install Java 17</h2>
          <p className="text-slate-300 mb-3">Download and install JDK 17 from Oracle or Adoptium:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 mb-3">
            <li>Go to: https://adoptium.net/</li>
            <li>Download Temurin JDK 17 for Windows (x64)</li>
            <li>Run the installer and follow the prompts</li>
            <li>Make sure "Set JAVA_HOME" is checked during installation</li>
          </ul>
          <p className="text-slate-300 mb-2">Verify installation:</p>
          <CodeBlock content="java -version" language="bash" fileName="Terminal" />
          <p className="text-sm text-slate-500">Expected output: openjdk version "17.x.x"</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-blue-300 mb-3">STEP 2 — Install Maven</h2>
          <p className="text-slate-300 mb-3">Download Apache Maven:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 mb-3">
            <li>Go to: https://maven.apache.org/download.cgi</li>
            <li>Download the Binary zip (apache-maven-3.9.x-bin.zip)</li>
            <li>Extract to C:\Program Files\Maven</li>
            <li>Add C:\Program Files\Maven\bin to System PATH</li>
          </ul>
          <CodeBlock content="mvn -version" language="bash" fileName="Terminal" />
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-blue-300 mb-3">STEP 3 — Install MySQL 8</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-1 mb-3">
            <li>Download MySQL Community Server from: https://dev.mysql.com/downloads/</li>
            <li>Install with default settings</li>
            <li>Set root password (remember it!)</li>
            <li>Install MySQL Workbench for GUI access</li>
            <li>Start MySQL Service</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-blue-300 mb-3">STEP 4 — Create Databases</h2>
          <p className="text-slate-300 mb-3">Open MySQL Workbench and run each SQL file, or use command line:</p>
          <CodeBlock content={`mysql -u root -p < database/menu-service.sql
mysql -u root -p < database/order-service.sql
mysql -u root -p < database/delivery-service.sql`} language="bash" fileName="Command Prompt" />
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-blue-300 mb-3">STEP 5 — Configure Database Credentials</h2>
          <p className="text-slate-300 mb-3">Edit each service's application.properties with your MySQL password:</p>
          <CodeBlock content={`# In each service's application.properties:
quarkus.datasource.username=root
quarkus.datasource.password=YOUR_PASSWORD_HERE`} language="properties" fileName="application.properties" />
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-blue-300 mb-3">STEP 6 — Start All Services</h2>
          <p className="text-slate-300 mb-3">Open 3 separate terminal windows:</p>
          <CodeBlock content={`# Terminal 1 - Menu Service
cd menu-service
mvn quarkus:dev

# Terminal 2 - Order Service  
cd order-service
mvn quarkus:dev

# Terminal 3 - Delivery Service
cd delivery-service
mvn quarkus:dev`} language="bash" fileName="Terminal" />
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-blue-300 mb-3">STEP 7 — Verify Services</h2>
          <p className="text-slate-300 mb-3">Open browser and check health endpoints:</p>
          <CodeBlock content={`# Menu Service Health
http://localhost:8081/q/health

# Order Service Health
http://localhost:8082/q/health

# Delivery Service Health
http://localhost:8083/q/health

# Swagger UI
http://localhost:8081/q/swagger-ui
http://localhost:8082/q/swagger-ui
http://localhost:8083/q/swagger-ui`} language="bash" fileName="Browser URLs" />
        </div>
      </div>
    </div>
  );

  const renderServiceSection = (title: string, color: string, files: FileItem[], port: string) => (
    <div className="fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-mono bg-${color}-900/30 text-${color}-300 border border-${color}-700/30`}>
          Port {port}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 sticky top-4">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <FolderOpen size={16} /> Source Files
            </h3>
            <FileExplorer files={files} />
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeFile ? (
            (() => {
              const file = files.find(f => f.path === activeFile);
              if (file) {
                return (
                  <div>
                    <div className="mb-4">
                      <p className="text-sm text-slate-500 font-mono">{file.path}</p>
                    </div>
                    <CodeBlock content={file.content} language={file.language} fileName={file.name} />
                  </div>
                );
              }
              return <p className="text-slate-500">Select a file to view its contents</p>;
            })()
          ) : (
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 text-center">
              <FileCode className="mx-auto mb-4 text-slate-600" size={48} />
              <p className="text-slate-400">Click on a file from the left panel to view its source code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDatabase = () => (
    <div className="fade-in space-y-6">
      <h1 className="text-3xl font-bold text-white">🗄️ Database Scripts</h1>
      <p className="text-slate-400">Complete SQL scripts with schema creation and sample data for each service.</p>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-blue-300 mb-3">Menu Service Database (food_menu_db)</h2>
          <CodeBlock content={infraData.menuServiceSQL} language="sql" fileName="database/menu-service.sql" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-green-300 mb-3">Order Service Database (food_order_db)</h2>
          <CodeBlock content={infraData.orderServiceSQL} language="sql" fileName="database/order-service.sql" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-purple-300 mb-3">Delivery Service Database (food_delivery_db)</h2>
          <CodeBlock content={infraData.deliveryServiceSQL} language="sql" fileName="database/delivery-service.sql" />
        </div>
      </div>
    </div>
  );

  const renderDocker = () => (
    <div className="fade-in space-y-6">
      <h1 className="text-3xl font-bold text-white">🐳 Docker Configuration</h1>
      <p className="text-slate-400">Run the entire system with Docker Compose.</p>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
        <h2 className="text-xl font-bold text-white mb-3">Quick Docker Start</h2>
        <CodeBlock content={`# Build and start all services
docker compose up --build

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Start only specific service
docker compose up menu-service`} language="bash" fileName="Terminal Commands" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-blue-300 mb-3">docker-compose.yml</h2>
        <CodeBlock content={infraData.dockerCompose} language="yaml" fileName="docker-compose.yml" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-green-300 mb-3">Dockerfile (same for each service)</h2>
        <CodeBlock content={infraData.dockerfile} language="dockerfile" fileName="Dockerfile" />
      </div>
    </div>
  );

  const renderAPI = () => (
    <div className="fade-in space-y-6">
      <h1 className="text-3xl font-bold text-white">📡 API Documentation</h1>
      <p className="text-slate-400">Complete REST API reference for all three microservices.</p>

      {/* Menu Service APIs */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-blue-700/30">
        <h2 className="text-2xl font-bold text-blue-300 mb-4">Menu Service APIs (Port 8081)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">Method</th>
                <th className="text-left py-2 px-3 text-slate-400">Endpoint</th>
                <th className="text-left py-2 px-3 text-slate-400">Description</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">GET</span></td><td className="py-2 px-3 font-mono text-xs">/api/categories</td><td className="py-2 px-3">Get all categories</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">GET</span></td><td className="py-2 px-3 font-mono text-xs">/api/categories/&#123;id&#125;</td><td className="py-2 px-3">Get category by ID</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded text-xs">POST</span></td><td className="py-2 px-3 font-mono text-xs">/api/categories</td><td className="py-2 px-3">Create category</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-300 rounded text-xs">PUT</span></td><td className="py-2 px-3 font-mono text-xs">/api/categories/&#123;id&#125;</td><td className="py-2 px-3">Update category</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-red-900/50 text-red-300 rounded text-xs">DELETE</span></td><td className="py-2 px-3 font-mono text-xs">/api/categories/&#123;id&#125;</td><td className="py-2 px-3">Delete category</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">GET</span></td><td className="py-2 px-3 font-mono text-xs">/api/foods</td><td className="py-2 px-3">Get all foods</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">GET</span></td><td className="py-2 px-3 font-mono text-xs">/api/foods/&#123;id&#125;</td><td className="py-2 px-3">Get food by ID</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">GET</span></td><td className="py-2 px-3 font-mono text-xs">/api/foods/category/&#123;id&#125;</td><td className="py-2 px-3">Get foods by category</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">GET</span></td><td className="py-2 px-3 font-mono text-xs">/api/foods/available</td><td className="py-2 px-3">Get available foods</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded text-xs">POST</span></td><td className="py-2 px-3 font-mono text-xs">/api/foods</td><td className="py-2 px-3">Create food item</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-300 rounded text-xs">PUT</span></td><td className="py-2 px-3 font-mono text-xs">/api/foods/&#123;id&#125;</td><td className="py-2 px-3">Update food item</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-red-900/50 text-red-300 rounded text-xs">DELETE</span></td><td className="py-2 px-3 font-mono text-xs">/api/foods/&#123;id&#125;</td><td className="py-2 px-3">Delete food item</td></tr>
              <tr><td className="py-2 px-3"><span className="px-2 py-0.5 bg-orange-900/50 text-orange-300 rounded text-xs">PATCH</span></td><td className="py-2 px-3 font-mono text-xs">/api/foods/&#123;id&#125;/availability</td><td className="py-2 px-3">Toggle availability</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Service APIs */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-green-700/30">
        <h2 className="text-2xl font-bold text-green-300 mb-4">Order Service APIs (Port 8082)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">Method</th>
                <th className="text-left py-2 px-3 text-slate-400">Endpoint</th>
                <th className="text-left py-2 px-3 text-slate-400">Description</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">GET</span></td><td className="py-2 px-3 font-mono text-xs">/api/orders</td><td className="py-2 px-3">Get all orders</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">GET</span></td><td className="py-2 px-3 font-mono text-xs">/api/orders/&#123;id&#125;</td><td className="py-2 px-3">Get order by ID</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">GET</span></td><td className="py-2 px-3 font-mono text-xs">/api/orders/status/&#123;status&#125;</td><td className="py-2 px-3">Get orders by status</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded text-xs">POST</span></td><td className="py-2 px-3 font-mono text-xs">/api/orders</td><td className="py-2 px-3">Create order</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-300 rounded text-xs">PUT</span></td><td className="py-2 px-3 font-mono text-xs">/api/orders/&#123;id&#125;</td><td className="py-2 px-3">Update order</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-orange-900/50 text-orange-300 rounded text-xs">PATCH</span></td><td className="py-2 px-3 font-mono text-xs">/api/orders/&#123;id&#125;/status</td><td className="py-2 px-3">Update order status</td></tr>
              <tr><td className="py-2 px-3"><span className="px-2 py-0.5 bg-red-900/50 text-red-300 rounded text-xs">DELETE</span></td><td className="py-2 px-3 font-mono text-xs">/api/orders/&#123;id&#125;</td><td className="py-2 px-3">Cancel order</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivery Service APIs */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-700/30">
        <h2 className="text-2xl font-bold text-purple-300 mb-4">Delivery Service APIs (Port 8083)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">Method</th>
                <th className="text-left py-2 px-3 text-slate-400">Endpoint</th>
                <th className="text-left py-2 px-3 text-slate-400">Description</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">GET</span></td><td className="py-2 px-3 font-mono text-xs">/api/deliveries</td><td className="py-2 px-3">Get all deliveries</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">GET</span></td><td className="py-2 px-3 font-mono text-xs">/api/deliveries/&#123;id&#125;</td><td className="py-2 px-3">Get delivery by ID</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">GET</span></td><td className="py-2 px-3 font-mono text-xs">/api/deliveries/order/&#123;orderId&#125;</td><td className="py-2 px-3">Get delivery by order</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded text-xs">POST</span></td><td className="py-2 px-3 font-mono text-xs">/api/deliveries</td><td className="py-2 px-3">Create delivery</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-300 rounded text-xs">PUT</span></td><td className="py-2 px-3 font-mono text-xs">/api/deliveries/&#123;id&#125;</td><td className="py-2 px-3">Update delivery</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-orange-900/50 text-orange-300 rounded text-xs">PATCH</span></td><td className="py-2 px-3 font-mono text-xs">/api/deliveries/&#123;id&#125;/status</td><td className="py-2 px-3">Update delivery status</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-2 px-3"><span className="px-2 py-0.5 bg-orange-900/50 text-orange-300 rounded text-xs">PATCH</span></td><td className="py-2 px-3 font-mono text-xs">/api/deliveries/&#123;id&#125;/assign</td><td className="py-2 px-3">Assign delivery person</td></tr>
              <tr><td className="py-2 px-3"><span className="px-2 py-0.5 bg-red-900/50 text-red-300 rounded text-xs">DELETE</span></td><td className="py-2 px-3 font-mono text-xs">/api/deliveries/&#123;id&#125;</td><td className="py-2 px-3">Cancel delivery</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Example Requests */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Example: Create Order</h2>
        <CodeBlock content={`POST http://localhost:8082/api/orders
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerPhone": "9800000000",
  "customerEmail": "john@email.com",
  "deliveryAddress": "Kathmandu, Nepal",
  "items": [
    { "foodId": 1, "quantity": 2 },
    { "foodId": 6, "quantity": 1 }
  ]
}`} language="json" fileName="Create Order Request" />

        <h3 className="text-lg font-bold text-white mb-3 mt-6">Example Response:</h3>
        <CodeBlock content={`{
  "id": 6,
  "customerName": "John Doe",
  "customerPhone": "9800000000",
  "customerEmail": "john@email.com",
  "deliveryAddress": "Kathmandu, Nepal",
  "totalAmount": 660.00,
  "status": "PENDING",
  "items": [
    {
      "foodId": 1,
      "foodName": "Chicken Momo",
      "quantity": 2,
      "unitPrice": 180.00,
      "subtotal": 360.00
    },
    {
      "foodId": 6,
      "foodName": "Chicken Burger",
      "quantity": 1,
      "unitPrice": 300.00,
      "subtotal": 300.00
    }
  ],
  "createdAt": "2026-01-15T12:00:00",
  "updatedAt": "2026-01-15T12:00:00"
}`} language="json" fileName="Create Order Response" />
      </div>
    </div>
  );

  const renderHealth = () => (
    <div className="fade-in space-y-6">
      <h1 className="text-3xl font-bold text-white">🏥 MicroProfile Health</h1>
      <p className="text-slate-400">Each service implements liveness and readiness health checks.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-green-700/30">
          <h2 className="text-xl font-bold text-green-300 mb-3">Liveness Check</h2>
          <p className="text-slate-400 mb-4">"Is the application alive?" — Used by orchestrators (Kubernetes) to restart if dead.</p>
          <CodeBlock content={`GET /q/health/live

Response:
{
  "status": "UP",
  "checks": [
    {
      "name": "Menu Service is running",
      "status": "UP"
    }
  ]
}`} language="json" fileName="Liveness" />
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-blue-700/30">
          <h2 className="text-xl font-bold text-blue-300 mb-3">Readiness Check</h2>
          <p className="text-slate-400 mb-4">"Is the application ready to serve traffic?" — Checks database connectivity.</p>
          <CodeBlock content={`GET /q/health/ready

Response:
{
  "status": "UP",
  "checks": [
    {
      "name": "Database connection",
      "status": "UP",
      "data": {
        "database": "food_menu_db"
      }
    }
  ]
}`} language="json" fileName="Readiness" />
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-3">Health Endpoints</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
            <p className="text-blue-300 font-bold mb-2">Menu Service</p>
            <p className="text-xs text-slate-400 font-mono">http://localhost:8081/q/health</p>
            <p className="text-xs text-slate-400 font-mono">http://localhost:8081/q/health/live</p>
            <p className="text-xs text-slate-400 font-mono">http://localhost:8081/q/health/ready</p>
          </div>
          <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
            <p className="text-green-300 font-bold mb-2">Order Service</p>
            <p className="text-xs text-slate-400 font-mono">http://localhost:8082/q/health</p>
            <p className="text-xs text-slate-400 font-mono">http://localhost:8082/q/health/live</p>
            <p className="text-xs text-slate-400 font-mono">http://localhost:8082/q/health/ready</p>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/30">
            <p className="text-purple-300 font-bold mb-2">Delivery Service</p>
            <p className="text-xs text-slate-400 font-mono">http://localhost:8083/q/health</p>
            <p className="text-xs text-slate-400 font-mono">http://localhost:8083/q/health/live</p>
            <p className="text-xs text-slate-400 font-mono">http://localhost:8083/q/health/ready</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTesting = () => (
    <div className="fade-in space-y-6">
      <h1 className="text-3xl font-bold text-white">🧪 Testing Guide</h1>
      <p className="text-slate-400">Complete demonstration workflow for testing all services.</p>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Complete Demo Workflow</h2>
        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-blue-300 font-bold">Step 1: Get Available Foods</p>
            <CodeBlock content={`GET http://localhost:8081/api/foods/available`} language="bash" fileName="Request" />
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-green-300 font-bold">Step 2: Create Order</p>
            <CodeBlock content={`POST http://localhost:8082/api/orders
{
  "customerName": "Ram Sharma",
  "customerPhone": "9801234567",
  "deliveryAddress": "Putalisadak, Kathmandu",
  "items": [
    { "foodId": 1, "quantity": 2 },
    { "foodId": 6, "quantity": 1 }
  ]
}`} language="json" fileName="Create Order" />
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-yellow-300 font-bold">Step 3: Confirm Order (triggers delivery creation)</p>
            <CodeBlock content={`PATCH http://localhost:8082/api/orders/1/status
{ "status": "CONFIRMED" }`} language="json" fileName="Update Status" />
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-purple-300 font-bold">Step 4: Check Delivery Created</p>
            <CodeBlock content={`GET http://localhost:8083/api/deliveries/order/1`} language="bash" fileName="Get Delivery" />
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-orange-300 font-bold">Step 5: Assign Delivery Person</p>
            <CodeBlock content={`PATCH http://localhost:8083/api/deliveries/1/assign
{
  "deliveryPersonName": "Ram Bahadur",
  "deliveryPersonPhone": "9841000001"
}`} language="json" fileName="Assign Person" />
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-pink-300 font-bold">Step 6: Update Delivery Status Flow</p>
            <CodeBlock content={`# Mark as picked up
PATCH http://localhost:8083/api/deliveries/1/status
{ "status": "PICKED_UP" }

# Mark as out for delivery
PATCH http://localhost:8083/api/deliveries/1/status
{ "status": "OUT_FOR_DELIVERY" }

# Mark as delivered
PATCH http://localhost:8083/api/deliveries/1/status
{ "status": "DELIVERED" }`} language="bash" fileName="Status Updates" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Running Automated Tests</h2>
        <CodeBlock content={`# Run all tests for a service
cd menu-service
mvn test

# Run with coverage
mvn test -Dquarkus.test.profile.tags=unit

# Package (includes tests)
mvn clean package`} language="bash" fileName="Terminal" />
      </div>
    </div>
  );

  const renderPostman = () => (
    <div className="fade-in space-y-6">
      <h1 className="text-3xl font-bold text-white">📮 Postman Collection</h1>
      <p className="text-slate-400">Import the collection to test all APIs interactively.</p>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Import Instructions</h2>
        <ol className="list-decimal list-inside text-slate-300 space-y-2">
          <li>Open Postman</li>
          <li>Click "Import" button</li>
          <li>Select the collection JSON file from postman/ folder</li>
          <li>Import the environment file (Food-Delivery-Local.postman_environment.json)</li>
          <li>Select the environment from dropdown</li>
          <li>Start making requests!</li>
        </ol>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Collection Structure</h2>
        <div className="font-mono text-sm text-slate-300 space-y-2">
          <p className="text-yellow-300">📁 Food Delivery Microservices</p>
          <p className="pl-4 text-blue-300">📁 Menu Service</p>
          <p className="pl-8">• GET Categories</p>
          <p className="pl-8">• GET Category by ID</p>
          <p className="pl-8">• POST Create Category</p>
          <p className="pl-8">• PUT Update Category</p>
          <p className="pl-8">• DELETE Category</p>
          <p className="pl-8">• GET All Foods</p>
          <p className="pl-8">• GET Food by ID</p>
          <p className="pl-8">• GET Foods by Category</p>
          <p className="pl-8">• GET Available Foods</p>
          <p className="pl-8">• POST Create Food</p>
          <p className="pl-8">• PUT Update Food</p>
          <p className="pl-8">• PATCH Toggle Availability</p>
          <p className="pl-8">• DELETE Food</p>
          <p className="pl-4 text-green-300">📁 Order Service</p>
          <p className="pl-8">• POST Create Order</p>
          <p className="pl-8">• GET All Orders</p>
          <p className="pl-8">• GET Order by ID</p>
          <p className="pl-8">• PATCH Update Status</p>
          <p className="pl-8">• GET Orders by Status</p>
          <p className="pl-8">• DELETE Cancel Order</p>
          <p className="pl-4 text-purple-300">📁 Delivery Service</p>
          <p className="pl-8">• POST Create Delivery</p>
          <p className="pl-8">• GET All Deliveries</p>
          <p className="pl-8">• GET Delivery by ID</p>
          <p className="pl-8">• GET Delivery by Order</p>
          <p className="pl-8">• PATCH Assign Person</p>
          <p className="pl-8">• PATCH Update Status</p>
          <p className="pl-4 text-yellow-300">📁 Health Checks</p>
          <p className="pl-8">• Menu Health/Live/Ready</p>
          <p className="pl-8">• Order Health/Live/Ready</p>
          <p className="pl-8">• Delivery Health/Live/Ready</p>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Environment Variables</h2>
        <CodeBlock content={`{
  "MENU_SERVICE_URL": "http://localhost:8081",
  "ORDER_SERVICE_URL": "http://localhost:8082",
  "DELIVERY_SERVICE_URL": "http://localhost:8083"
}`} language="json" fileName="Postman Environment" />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'setup': return renderSetup();
      case 'menu-service': return renderServiceSection('🔵 Menu Service', 'blue', menuServiceFiles, '8081');
      case 'order-service': return renderServiceSection('🟢 Order Service', 'green', orderServiceFiles, '8082');
      case 'delivery-service': return renderServiceSection('🟣 Delivery Service', 'purple', deliveryServiceFiles, '8083');
      case 'database': return renderDatabase();
      case 'docker': return renderDocker();
      case 'api': return renderAPI();
      case 'health': return renderHealth();
      case 'testing': return renderTesting();
      case 'postman': return renderPostman();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-slate-800/80 border-r border-slate-700 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            🍕 Food Delivery
          </h1>
          <p className="text-xs text-slate-500 mt-1">Microservices System</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setActiveFile(''); }}
              className={`sidebar-item w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-600/20 text-blue-300 border-l-3 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 space-y-1">
            <p>Java 17 + Quarkus 3.8.1</p>
            <p>MicroProfile Health</p>
            <p>MySQL 8.x</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-slate-800/50 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 hidden md:block">
              Quarkus 3.8.1 • MicroProfile • REST APIs
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs text-green-400">Services Ready</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
