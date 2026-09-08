import { useState, useMemo, useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Folder, FolderOpen, FileCode, FileText, Database, Server,
  Download, Copy, Check, ChevronRight, ChevronDown, Menu, X,
  Package, Settings, Globe, Heart, Terminal, BookOpen, Layers
} from 'lucide-react';
import { menuServiceFiles } from './data/menuServiceFiles';
import { orderServiceFiles } from './data/orderServiceFiles';
import { deliveryServiceFiles } from './data/deliveryServiceFiles';
import { sharedFiles } from './data/sharedFiles';

// Combine all files
const allFiles: Record<string, string> = {
  ...sharedFiles,
  ...menuServiceFiles,
  ...orderServiceFiles,
  ...deliveryServiceFiles,
};

// Debug: log file count
console.log('Total files in ZIP:', Object.keys(allFiles).length);
console.log('Database files:', Object.keys(allFiles).filter(f => f.includes('database')));
console.log('Postman files:', Object.keys(allFiles).filter(f => f.includes('postman')));

// Build file tree structure
interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children: TreeNode[];
}

function buildFileTree(files: Record<string, string>): TreeNode {
  const root: TreeNode = { name: 'food-delivery-microservices', path: '', isFolder: true, children: [] };
  const pathMap = new Map<string, TreeNode>();
  pathMap.set('', root);

  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split('/');
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!pathMap.has(currentPath)) {
        const isLast = i === parts.length - 1;
        const node: TreeNode = {
          name: part,
          path: currentPath,
          isFolder: !isLast,
          children: [],
        };
        pathMap.set(currentPath, node);
        const parent = pathMap.get(parentPath);
        if (parent) {
          parent.children.push(node);
        }
      }
    }
  }

  return root;
}

function getFileIcon(name: string) {
  if (name.endsWith('.java')) return <FileCode size={16} className="text-orange-400" />;
  if (name.endsWith('.xml')) return <FileCode size={16} className="text-red-400" />;
  if (name.endsWith('.properties')) return <Settings size={16} className="text-green-400" />;
  if (name.endsWith('.sql')) return <Database size={16} className="text-blue-400" />;
  if (name.endsWith('.json')) return <FileText size={16} className="text-yellow-400" />;
  if (name.endsWith('.md')) return <BookOpen size={16} className="text-purple-400" />;
  if (name === 'Dockerfile') return <Package size={16} className="text-cyan-400" />;
  if (name.endsWith('.yml') || name.endsWith('.yaml')) return <Layers size={16} className="text-indigo-400" />;
  return <FileText size={16} className="text-gray-400" />;
}

function getLanguage(path: string): string {
  if (path.endsWith('.java')) return 'java';
  if (path.endsWith('.xml')) return 'xml';
  if (path.endsWith('.properties')) return 'ini';
  if (path.endsWith('.sql')) return 'sql';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.md')) return 'markdown';
  if (path.endsWith('.yml') || path.endsWith('.yaml')) return 'yaml';
  if (path === 'Dockerfile') return 'docker';
  return 'text';
}

function FileTreeItem({ node, depth, selectedFile, onSelect, expanded, toggleExpand }: {
  node: TreeNode;
  depth: number;
  selectedFile: string | null;
  onSelect: (path: string) => void;
  expanded: Set<string>;
  toggleExpand: (path: string) => void;
}) {
  const isExpanded = expanded.has(node.path);
  const isSelected = selectedFile === node.path;

  if (node.isFolder) {
    return (
      <div>
        <button
          onClick={() => toggleExpand(node.path)}
          className={`w-full flex items-center gap-1 py-1 px-2 text-left text-sm hover:bg-slate-700/50 rounded transition-colors ${isSelected ? 'bg-slate-700' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {isExpanded ? <ChevronDown size={14} className="text-slate-400 shrink-0" /> : <ChevronRight size={14} className="text-slate-400 shrink-0" />}
          {isExpanded ? <FolderOpen size={16} className="text-yellow-400 shrink-0" /> : <Folder size={16} className="text-yellow-400 shrink-0" />}
          <span className="truncate text-slate-200">{node.name}</span>
        </button>
        {isExpanded && (
          <div>
            {node.children.map(child => (
              <FileTreeItem
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedFile={selectedFile}
                onSelect={onSelect}
                expanded={expanded}
                toggleExpand={toggleExpand}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(node.path)}
      className={`w-full flex items-center gap-1.5 py-1 px-2 text-left text-sm hover:bg-slate-700/50 rounded transition-colors ${isSelected ? 'bg-blue-600/20 text-blue-300' : 'text-slate-300'}`}
      style={{ paddingLeft: `${depth * 16 + 24}px` }}
    >
      {getFileIcon(node.name)}
      <span className="truncate">{node.name}</span>
    </button>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'files'>('overview');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['database', 'postman', 'docs', 'menu-service', 'order-service', 'delivery-service']));
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadedFile, setDownloadedFile] = useState<string | null>(null);

  const fileTree = useMemo(() => buildFileTree(allFiles), []);

  const toggleExpand = useCallback((path: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const downloadFile = useCallback((path: string) => {
    const content = allFiles[path];
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const name = path.split('/').pop() || 'file';
    saveAs(blob, name);
    setDownloadedFile(path);
    setTimeout(() => setDownloadedFile(null), 2000);
  }, []);

  const downloadAllAsZip = useCallback(async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('food-delivery-microservices');
      if (!rootFolder) return;

      for (const [path, content] of Object.entries(allFiles)) {
        rootFolder.file(path, content);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'food-delivery-microservices.zip');
    } catch (e) {
      console.error('Error generating ZIP:', e);
    }
    setDownloading(false);
  }, []);

  const copyContent = useCallback(() => {
    if (!selectedFile || !allFiles[selectedFile]) return;
    navigator.clipboard.writeText(allFiles[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selectedFile]);

  const fileCount = Object.keys(allFiles).length;
  const dbFiles = Object.keys(allFiles).filter(f => f.startsWith('database/'));
  const postmanFiles = Object.keys(allFiles).filter(f => f.startsWith('postman/'));

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 hover:bg-slate-700 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Server size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Food Delivery Microservices</h1>
              <p className="text-xs text-slate-400">Java • Quarkus • MicroProfile • MySQL — {fileCount} files</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadAllAsZip}
            disabled={downloading}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 shadow-lg shadow-green-900/30"
          >
            <Download size={16} />
            {downloading ? 'Generating ZIP...' : '⬇ Download Complete ZIP'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-slate-800/50 border-r border-slate-700 overflow-hidden shrink-0 flex flex-col`}>
          {/* Tabs */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${activeTab === 'files' ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Files
            </button>
          </div>

          {activeTab === 'overview' ? (
            <div className="p-4 overflow-y-auto flex-1 text-sm space-y-3">
              {/* Quick Download Buttons */}
              <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-lg p-3 border border-blue-700/50">
                <h3 className="font-semibold text-blue-300 mb-2 text-xs uppercase tracking-wide">Quick Downloads</h3>
                <div className="space-y-1.5">
                  <button
                    onClick={downloadAllAsZip}
                    className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
                  >
                    <Download size={14} /> Download Complete ZIP ({fileCount} files)
                  </button>
                  {dbFiles.map(f => (
                    <button
                      key={f}
                      onClick={() => downloadFile(f)}
                      className="w-full flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 px-3 py-1.5 rounded text-xs transition-colors"
                    >
                      <Database size={12} /> {f.split('/').pop()}
                      {downloadedFile === f && <Check size={12} className="text-green-400 ml-auto" />}
                    </button>
                  ))}
                  {postmanFiles.map(f => (
                    <button
                      key={f}
                      onClick={() => downloadFile(f)}
                      className="w-full flex items-center gap-2 bg-orange-600/30 hover:bg-orange-600/50 text-orange-200 px-3 py-1.5 rounded text-xs transition-colors"
                    >
                      <FileText size={12} /> {f.split('/').pop()}
                      {downloadedFile === f && <Check size={12} className="text-green-400 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Architecture */}
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Globe size={14} className="text-blue-400" /> Architecture
                </h3>
                <pre className="text-xs text-slate-300 whitespace-pre overflow-x-auto font-mono">{`  CLIENT / POSTMAN
         |
    ─────┼─────┬─────
    │     │     │     │
    ▼     ▼     ▼     ▼
  MENU  ORDER  DELIVERY
  :8081 :8082  :8083
    │     │     │
    ▼     ▼     ▼
  menu  order delivery
   _db   _db    _db`}</pre>
              </div>

              {/* Services */}
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <h3 className="font-semibold text-white mb-2 text-xs uppercase tracking-wide">Services</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-300">Menu Service</span>
                    </div>
                    <span className="text-xs text-slate-500">:8081</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-300">Order Service</span>
                    </div>
                    <span className="text-xs text-slate-500">:8082</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-300">Delivery Service</span>
                    </div>
                    <span className="text-xs text-slate-500">:8083</span>
                  </div>
                </div>
              </div>

              {/* Database */}
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Database size={14} className="text-blue-400" /> Database
                </h3>
                <div className="space-y-1 text-xs text-slate-300">
                  <p>• food_menu_db</p>
                  <p>• food_order_db</p>
                  <p>• food_delivery_db</p>
                  <p className="text-slate-500 mt-1">SQL scripts in database/ folder</p>
                </div>
              </div>

              {/* Health */}
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Heart size={14} className="text-red-400" /> Health Checks
                </h3>
                <div className="space-y-1 text-xs text-slate-300">
                  <p><code className="bg-slate-700 px-1 rounded text-[10px]">/q/health</code> Overall</p>
                  <p><code className="bg-slate-700 px-1 rounded text-[10px]">/q/health/live</code> Liveness</p>
                  <p><code className="bg-slate-700 px-1 rounded text-[10px]">/q/health/ready</code> Readiness</p>
                </div>
              </div>

              {/* Quick Start */}
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Terminal size={14} className="text-green-400" /> Quick Start
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div>
                    <p className="text-slate-400 mb-1">1. Run SQL scripts</p>
                    <code className="bg-slate-700 px-2 py-1 rounded block text-[10px]">mysql -u root -p {'<'} database/*.sql</code>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">2. Start services</p>
                    <code className="bg-slate-700 px-2 py-1 rounded block text-[10px]">cd menu-service{'\n'}mvn quarkus:dev</code>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">3. Open Swagger</p>
                    <code className="bg-slate-700 px-2 py-1 rounded block text-[10px]">http://localhost:8081/q/swagger-ui</code>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <h3 className="font-semibold text-white mb-2 text-xs uppercase tracking-wide">Tech Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['Java 17', 'Quarkus 3.8', 'MicroProfile', 'Hibernate Panache', 'MySQL 8', 'Maven', 'Docker', 'Swagger', 'Postman'].map(tech => (
                    <span key={tech} className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 py-2">
              {fileTree.children.map(child => (
                <FileTreeItem
                  key={child.path}
                  node={child}
                  depth={0}
                  selectedFile={selectedFile}
                  onSelect={setSelectedFile}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                />
              ))}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedFile ? (
            <>
              {/* File Header */}
              <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {getFileIcon(selectedFile.split('/').pop() || '')}
                  <span className="text-sm text-slate-200 font-mono">{selectedFile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadFile(selectedFile)}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs transition-colors"
                  >
                    <Download size={12} /> Download
                  </button>
                  <button
                    onClick={copyContent}
                    className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded text-xs transition-colors"
                  >
                    {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              {/* Code Content */}
              <div className="flex-1 overflow-auto bg-slate-900">
                <pre className="p-4 text-sm text-slate-300 font-mono whitespace-pre leading-relaxed">
                  {allFiles[selectedFile]}
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-900/30">
                  <Server size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Food Delivery Microservices</h2>
                <p className="text-slate-400 mb-6">
                  Complete Java backend project with 3 microservices, database scripts, Postman collection, Docker support, and full documentation.
                </p>

                {/* File Summary Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-left">
                    <Database size={20} className="text-blue-400 mb-1" />
                    <p className="text-xs text-slate-400">Database</p>
                    <p className="text-lg font-bold text-white">{dbFiles.length} SQL files</p>
                    <p className="text-[10px] text-slate-500">menu, order, delivery</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-left">
                    <FileText size={20} className="text-orange-400 mb-1" />
                    <p className="text-xs text-slate-400">Postman</p>
                    <p className="text-lg font-bold text-white">{postmanFiles.length} files</p>
                    <p className="text-[10px] text-slate-500">collection + environment</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-left">
                    <FileCode size={20} className="text-green-400 mb-1" />
                    <p className="text-xs text-slate-400">Java Source</p>
                    <p className="text-lg font-bold text-white">{Object.keys(allFiles).filter(f => f.endsWith('.java')).length} files</p>
                    <p className="text-[10px] text-slate-500">entities, services, controllers</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-left">
                    <BookOpen size={20} className="text-purple-400 mb-1" />
                    <p className="text-xs text-slate-400">Documentation</p>
                    <p className="text-lg font-bold text-white">{Object.keys(allFiles).filter(f => f.endsWith('.md')).length} files</p>
                    <p className="text-[10px] text-slate-500">setup, API, architecture</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={downloadAllAsZip}
                    disabled={downloading}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 shadow-lg shadow-green-900/30"
                  >
                    <Download size={18} />
                    {downloading ? 'Generating...' : 'Download Complete ZIP'}
                  </button>
                  <button
                    onClick={() => { setActiveTab('files'); setSidebarOpen(true); }}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Folder size={18} /> Browse Files
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-6">
                  Click any file in the sidebar to view its content. Use the download buttons to get individual files or the complete project as ZIP.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
