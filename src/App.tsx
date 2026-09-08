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
  if (path.endsWith('.properties')) return 'properties';
  if (path.endsWith('.sql')) return 'sql';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.md')) return 'markdown';
  if (path.endsWith('.yml') || path.endsWith('.yaml')) return 'yaml';
  if (path === 'Dockerfile') return 'dockerfile';
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
        <div
          className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer hover:bg-slate-700/50 rounded text-sm transition-colors ${isSelected ? 'bg-slate-700' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => toggleExpand(node.path)}
        >
          {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
          {isExpanded ? <FolderOpen size={16} className="text-yellow-400" /> : <Folder size={16} className="text-yellow-400" />}
          <span className="text-slate-200">{node.name}</span>
        </div>
        {isExpanded && node.children.map(child => (
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
    );
  }

  return (
    <div
      className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer hover:bg-slate-700/50 rounded text-sm transition-colors ${isSelected ? 'bg-blue-900/50 text-blue-200' : ''}`}
      style={{ paddingLeft: `${depth * 16 + 24}px` }}
      onClick={() => onSelect(node.path)}
    >
      {getFileIcon(node.name)}
      <span className="truncate">{node.name}</span>
    </div>
  );
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<string | null>('README.md');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['', 'menu-service', 'order-service', 'delivery-service', 'database', 'docs', 'postman']));
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'files' | 'overview'>('overview');

  const fileTree = useMemo(() => buildFileTree(allFiles), []);

  const toggleExpand = useCallback((path: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const copyToClipboard = useCallback(() => {
    if (!selectedFile || !allFiles[selectedFile]) return;
    navigator.clipboard.writeText(allFiles[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selectedFile]);

  const downloadFile = useCallback(() => {
    if (!selectedFile || !allFiles[selectedFile]) return;
    const blob = new Blob([allFiles[selectedFile]], { type: 'text/plain' });
    const name = selectedFile.split('/').pop() || 'file';
    saveAs(blob, name);
  }, [selectedFile]);

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

  const fileCount = Object.keys(allFiles).length;

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
              <p className="text-xs text-slate-400">Java • Quarkus • MicroProfile • MySQL</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:block">{fileCount} files</span>
          <button
            onClick={downloadAllAsZip}
            disabled={downloading}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          >
            <Download size={16} />
            {downloading ? 'Generating ZIP...' : 'Download ZIP'}
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
            <div className="p-4 overflow-y-auto flex-1 text-sm space-y-4">
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Globe size={14} className="text-blue-400" /> Architecture
                </h3>
                <pre className="text-xs text-slate-300 whitespace-pre overflow-x-auto">{`  CLIENT / POSTMAN
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

              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <h3 className="font-semibold text-white mb-2">Services</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-slate-300">Menu Service — :8081</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-slate-300">Order Service — :8082</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-slate-300">Delivery Service — :8083</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Heart size={14} className="text-red-400" /> Health Checks
                </h3>
                <div className="space-y-1 text-xs text-slate-300">
                  <p><code className="bg-slate-700 px-1 rounded">/q/health</code> — Overall</p>
                  <p><code className="bg-slate-700 px-1 rounded">/q/health/live</code> — Liveness</p>
                  <p><code className="bg-slate-700 px-1 rounded">/q/health/ready</code> — Readiness</p>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Terminal size={14} className="text-green-400" /> Quick Start
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div>
                    <p className="text-slate-400 mb-1">1. Setup MySQL databases</p>
                    <code className="bg-slate-700 px-2 py-1 rounded block">mysql -u root -p {'<'} database/*.sql</code>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">2. Start Menu Service</p>
                    <code className="bg-slate-700 px-2 py-1 rounded block">cd menu-service && mvn quarkus:dev</code>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">3. Start Order Service</p>
                    <code className="bg-slate-700 px-2 py-1 rounded block">cd order-service && mvn quarkus:dev</code>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">4. Start Delivery Service</p>
                    <code className="bg-slate-700 px-2 py-1 rounded block">cd delivery-service && mvn quarkus:dev</code>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <h3 className="font-semibold text-white mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['Java 17', 'Quarkus 3.8', 'MicroProfile', 'Hibernate Panache', 'MySQL 8', 'Maven', 'Docker', 'Swagger'].map(tech => (
                    <span key={tech} className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded">{tech}</span>
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
                  onSelect={(path) => { setSelectedFile(path); setSidebarOpen(false); }}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                />
              ))}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedFile && allFiles[selectedFile] ? (
            <>
              {/* File Header */}
              <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {getFileIcon(selectedFile.split('/').pop() || '')}
                  <span className="text-sm text-slate-200 font-mono">{selectedFile}</span>
                  <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">{getLanguage(selectedFile)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded transition-colors"
                  >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadFile}
                    className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded transition-colors"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="flex-1 overflow-auto">
                <pre className="p-4 text-sm leading-relaxed">
                  <code className="text-slate-200 font-mono whitespace-pre">
                    {allFiles[selectedFile]}
                  </code>
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                  <FileCode size={40} className="text-slate-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-300">Select a file to view</h2>
                  <p className="text-sm text-slate-500 mt-1">Browse the file tree or click "Download ZIP" to get everything</p>
                </div>
                <button
                  onClick={downloadAllAsZip}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                >
                  <Download size={18} />
                  {downloading ? 'Generating ZIP...' : 'Download Complete Project (ZIP)'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 px-4 py-2 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <span>Food Delivery Microservices — Academic Project</span>
        <div className="flex items-center gap-4">
          <span>Java 17 + Quarkus 3.8.1</span>
          <span>•</span>
          <span>3 Services • 3 Databases</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Heart size={12} className="text-red-400" /> MicroProfile Health
          </span>
        </div>
      </footer>
    </div>
  );
}
