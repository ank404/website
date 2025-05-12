"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FadeIn } from "./ui/animations";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tooltip } from './ui/tooltip';

// Importing SVG assets for cloud icons
import { 
  FaServer, 
  FaNetworkWired, 
  FaDatabase, 
  FaLock, 
  FaShieldAlt, 
  FaExchangeAlt,
  FaUsers, 
  FaCloudDownloadAlt, 
  FaCloud,
  FaCloudUploadAlt,
  FaGlobe,
  FaWrench,
  FaExclamationTriangle,
  FaRegFileAlt,
  FaCode,
  FaEye
} from "react-icons/fa";

interface CloudNode {
  id: string;
  type: 'server' | 'database' | 'security' | 'loadBalancer' | 'cdn' | 'vpc' | 'apiGateway' | 'objectStorage' | 'monitoring' | 'customer' | 'webApp';
  name: string;
  x: number;
  y: number;
  details?: {
    cpuCores?: number;
    memory?: string;
    storage?: string;
    os?: string;
    role?: string;
    description?: string;
    uptime?: string;
    connections?: number;
  };
  connections: string[];
}

interface EdgeData {
  from: string;
  to: string;
  path?: string;
  animated?: boolean;
  label?: string;
}

// Define different architecture presets
const architecturePresets = {
  webApp: {
    name: "Modern Web Application",
    nodes: [
      { id: "user", type: "customer", name: "End Users", x: 50, y: 60, connections: ["cdn", "waf"] },
      { id: "cdn", type: "cdn", name: "CDN", x: 160, y: 60, connections: ["waf"] },
      { id: "waf", type: "security", name: "WAF", x: 270, y: 60, connections: ["lb"] },
      { id: "lb", type: "loadBalancer", name: "Load Balancer", x: 380, y: 60, connections: ["web1", "web2"] },
      { id: "web1", type: "server", name: "Web Server 1", x: 330, y: 140, connections: ["api", "cache"] },
      { id: "web2", type: "server", name: "Web Server 2", x: 440, y: 140, connections: ["api", "cache"] },
      { id: "api", type: "apiGateway", name: "API Gateway", x: 380, y: 220, connections: ["app1", "app2"] },
      { id: "app1", type: "server", name: "App Server 1", x: 330, y: 300, connections: ["db", "cache"] },
      { id: "app2", type: "server", name: "App Server 2", x: 440, y: 300, connections: ["db", "cache"] },
      { id: "db", type: "database", name: "Database", x: 380, y: 380, connections: [] },
      { id: "cache", type: "database", name: "Cache", x: 490, y: 220, connections: [] },
      { id: "mon", type: "monitoring", name: "Monitoring", x: 220, y: 220, connections: ["web1", "web2", "app1", "app2", "db", "cache"] }
    ]
  },
  containerized: {
    name: "Containerized Microservices",
    nodes: [
      { id: "user", type: "customer", name: "End Users", x: 50, y: 130, connections: ["gateway"] },
      { id: "gateway", type: "apiGateway", name: "API Gateway", x: 170, y: 130, connections: ["lb1", "lb2", "lb3"] },
      { id: "lb1", type: "loadBalancer", name: "Service Mesh", x: 290, y: 130, connections: ["auth", "profile", "order"] },
      { id: "auth", type: "server", name: "Auth Service", x: 230, y: 220, connections: ["authdb", "cache"] },
      { id: "profile", type: "server", name: "Profile Service", x: 350, y: 220, connections: ["userdb", "cache"] },
      { id: "order", type: "server", name: "Order Service", x: 470, y: 220, connections: ["orderdb", "cache"] },
      { id: "authdb", type: "database", name: "Auth DB", x: 230, y: 300, connections: [] },
      { id: "userdb", type: "database", name: "User DB", x: 350, y: 300, connections: [] },
      { id: "orderdb", type: "database", name: "Order DB", x: 470, y: 300, connections: [] },
      { id: "cache", type: "database", name: "Redis Cache", x: 350, y: 70, connections: [] },
      { id: "log", type: "objectStorage", name: "Log Storage", x: 470, y: 70, connections: [] },
      { id: "mon", type: "monitoring", name: "Monitoring", x: 110, y: 220, connections: ["auth", "profile", "order", "authdb", "userdb", "orderdb"] }
    ]
  },
  serverless: {
    name: "Serverless Architecture",
    nodes: [
      { id: "user", type: "customer", name: "End Users", x: 50, y: 130, connections: ["cdn"] },
      { id: "cdn", type: "cdn", name: "CDN", x: 170, y: 130, connections: ["gateway"] },
      { id: "gateway", type: "apiGateway", name: "API Gateway", x: 290, y: 130, connections: ["auth", "content", "payment"] },
      { id: "auth", type: "server", name: "Auth Lambda", x: 230, y: 220, connections: ["userdb"] },
      { id: "content", type: "server", name: "Content Lambda", x: 350, y: 220, connections: ["contentdb", "storage"] },
      { id: "payment", type: "server", name: "Payment Lambda", x: 470, y: 220, connections: ["paymentdb"] },
      { id: "userdb", type: "database", name: "User Table", x: 230, y: 300, connections: [] },
      { id: "contentdb", type: "database", name: "Content Table", x: 350, y: 300, connections: [] },
      { id: "paymentdb", type: "database", name: "Payment Table", x: 470, y: 300, connections: [] },
      { id: "storage", type: "objectStorage", name: "S3 Storage", x: 350, y: 70, connections: [] },
      { id: "log", type: "objectStorage", name: "CloudWatch", x: 470, y: 70, connections: ["auth", "content", "payment"] },
      { id: "waf", type: "security", name: "WAF", x: 110, y: 220, connections: ["gateway"] }
    ]
  },
  hybrid: {
    name: "Hybrid Cloud",
    nodes: [
      { id: "user", type: "customer", name: "End Users", x: 50, y: 130, connections: ["cdn", "vpn"] },
      { id: "cdn", type: "cdn", name: "CDN", x: 170, y: 130, connections: ["cloudlb"] },
      { id: "cloudlb", type: "loadBalancer", name: "Cloud LB", x: 290, y: 130, connections: ["cloudweb1", "cloudweb2"] },
      { id: "cloudweb1", type: "server", name: "Cloud Web 1", x: 230, y: 220, connections: ["clouddb"] },
      { id: "cloudweb2", type: "server", name: "Cloud Web 2", x: 350, y: 220, connections: ["clouddb"] },
      { id: "clouddb", type: "database", name: "Cloud DB", x: 290, y: 300, connections: ["vpc"] },
      { id: "vpc", type: "vpc", name: "VPN Gateway", x: 290, y: 380, connections: ["onpremdb"] },
      { id: "vpn", type: "security", name: "VPN", x: 170, y: 380, connections: ["vpc"] },
      { id: "onpremdb", type: "database", name: "On-Prem DB", x: 410, y: 380, connections: [] },
      { id: "onpremapp", type: "server", name: "Legacy App", x: 520, y: 380, connections: ["onpremdb"] },
      { id: "mon", type: "monitoring", name: "Monitoring", x: 480, y: 130, connections: ["cloudweb1", "cloudweb2", "clouddb", "onpremdb", "onpremapp"] }
    ]
  }
};

// Define components to represent different node types
const NodeIcon = ({ type, x, y, selected, onClick }: { 
  type: CloudNode['type'], 
  x: number, 
  y: number, 
  selected: boolean,
  onClick: () => void
}) => {
  let icon;
  let color = selected ? "text-primary bg-primary/10" : "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800";
  
  switch (type) {
    case 'server':
      icon = <FaServer className="w-5 h-5" />;
      break;
    case 'database':
      icon = <FaDatabase className="w-5 h-5" />;
      break;
    case 'security':
      icon = <FaLock className="w-5 h-5" />;
      break;
    case 'loadBalancer':
      icon = <FaExchangeAlt className="w-5 h-5" />;
      break;
    case 'cdn':
      icon = <FaCloudDownloadAlt className="w-5 h-5" />;
      break;
    case 'vpc':
      icon = <FaNetworkWired className="w-5 h-5" />;
      break;
    case 'apiGateway':
      icon = <FaCode className="w-5 h-5" />;
      break;
    case 'objectStorage':
      icon = <FaRegFileAlt className="w-5 h-5" />;
      break;
    case 'monitoring':
      icon = <FaEye className="w-5 h-5" />;
      break;
    case 'customer':
      icon = <FaUsers className="w-5 h-5" />;
      break;
    case 'webApp':
      icon = <FaGlobe className="w-5 h-5" />;
      break;
    default:
      icon = <FaCloud className="w-5 h-5" />;
  }

  return (
    <div 
      className={`absolute cursor-pointer w-12 h-12 rounded-full flex items-center justify-center ${color} border-2 ${selected ? 'border-primary shadow-lg scale-110' : 'border-gray-300 dark:border-gray-600'} transition-all duration-300`}
      style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

// Edge to connect nodes
const Edge = ({ from, to, nodes, animated = false }: { 
  from: string, 
  to: string, 
  nodes: CloudNode[],
  animated?: boolean 
}) => {
  const fromNode = nodes.find(node => node.id === from);
  const toNode = nodes.find(node => node.id === to);
  
  if (!fromNode || !toNode) return null;
  
  // Calculate edge coordinates
  const x1 = fromNode.x;
  const y1 = fromNode.y;
  const x2 = toNode.x;
  const y2 = toNode.y;
  
  // Calculate edge length for dash array animation
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  
  // Generate random ID for the gradient
  const gradientId = `gradient-${from}-${to}`;
  
  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--edge-start-color, #94a3b8)" />
          <stop offset="100%" stopColor="var(--edge-end-color, #64748b)" />
        </linearGradient>
      </defs>
      <line 
        x1={x1} 
        y1={y1} 
        x2={x2} 
        y2={y2} 
        stroke={`url(#${gradientId})`}
        strokeWidth={2} 
        strokeDasharray={animated ? "5,5" : "none"} 
        className={animated ? "animate-dash" : ""}
      />
    </>
  );
};

// Node label component
const NodeLabel = ({ node }: { node: CloudNode }) => (
  <div 
    className="absolute text-xs font-medium text-center px-2 py-1 bg-background border border-border rounded shadow-sm"
    style={{ 
      left: `${node.x}px`, 
      top: `${node.y + 30}px`, 
      transform: 'translate(-50%, 0)',
      maxWidth: '100px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}
  >
    {node.name}
  </div>
);

// Main component
const CloudArchitecture = () => {
  const [selectedArchitecture, setSelectedArchitecture] = useState<string>('webApp');
  const [nodes, setNodes] = useState<CloudNode[]>(architecturePresets.webApp.nodes as unknown as CloudNode[]);
  const [selectedNode, setSelectedNode] = useState<CloudNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate edges whenever nodes change
  useEffect(() => {
    const edgesList: EdgeData[] = [];
    
    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        edgesList.push({
          from: node.id,
          to: targetId,
          animated: false
        });
      });
    });
    
    setEdges(edgesList);
  }, [nodes]);
  // Handle architecture preset change
  const changeArchitecture = (key: string) => {
    setSelectedArchitecture(key);
    // Cast the nodes to ensure they conform to CloudNode type
    const presetNodes = architecturePresets[key as keyof typeof architecturePresets].nodes as unknown as CloudNode[];
    setNodes(presetNodes);
    setSelectedNode(null);
    setHoveredNode(null);
    setIsAnimating(false);
    
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
      setIsSimulating(false);
    }
  };
  
  // Handle node selection
  const handleNodeClick = (node: CloudNode) => {
    if (selectedNode && selectedNode.id === node.id) {
      setSelectedNode(null);
    } else {
      setSelectedNode(node);
      
      // Highlight connected edges
      const connectedEdges = [...edges];
      connectedEdges.forEach(edge => {
        edge.animated = (edge.from === node.id || edge.to === node.id);
      });
      setEdges(connectedEdges);
    }
  };

  const startDataFlowSimulation = () => {
    if (isSimulating) {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
      setIsSimulating(false);
      
      // Reset edges animation
      const resetEdges = edges.map(edge => ({ ...edge, animated: false }));
      setEdges(resetEdges);
      return;
    }
    
    setIsSimulating(true);
    
    // Create simulation that randomly animates different paths through the architecture
    simulationRef.current = setInterval(() => {
      const newEdges = [...edges];
      const startNodeIndex = Math.floor(Math.random() * nodes.length);
      const startNode = nodes[startNodeIndex];
      
      // Find a random path through the architecture
      let currentNode = startNode;
      let path: CloudNode[] = [currentNode];
      let maxPathLength = 4; // Limit path length to avoid infinite loops
      
      while (currentNode.connections.length > 0 && maxPathLength > 0) {
        const nextNodeId = currentNode.connections[Math.floor(Math.random() * currentNode.connections.length)];
        const nextNode = nodes.find(n => n.id === nextNodeId);
        
        if (nextNode && !path.includes(nextNode)) {
          path.push(nextNode);
          currentNode = nextNode;
        }
        
        maxPathLength--;
      }
      
      // Animate edges along this path
      for (let i = 0; i < path.length - 1; i++) {
        const edgeIndex = newEdges.findIndex(e => 
          (e.from === path[i].id && e.to === path[i+1].id) || 
          (e.to === path[i].id && e.from === path[i+1].id)
        );
        
        if (edgeIndex !== -1) {
          newEdges[edgeIndex].animated = true;
          
          // Schedule this edge to stop animating after a delay
          setTimeout(() => {
            setEdges(prev => prev.map((e, i) => 
              i === edgeIndex ? { ...e, animated: false } : e
            ));
          }, 2000 + Math.random() * 1000);
        }
      }
      
      setEdges(newEdges);
    }, 1000);
  };

  return (
    <section id="architecture-diagram" className="scroll-mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Cloud Architecture
        </h2>
      </div>

      <FadeIn direction="up" delay={100}>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Interactive Cloud Architecture Diagram</h3>
          <p className="text-muted-foreground">
            Explore different cloud architecture patterns through this interactive diagram. 
            Click on components to see relationships and simulate data flows across the infrastructure.
          </p>
        </div>
      </FadeIn>

      <Card className="mb-6 p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(architecturePresets).map(key => (
            <Button
              key={key}
              variant={selectedArchitecture === key ? "default" : "outline"}
              size="sm"
              onClick={() => changeArchitecture(key)}
              className="text-sm"
            >
              {architecturePresets[key as keyof typeof architecturePresets].name}
            </Button>
          ))}
        </div>
        
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startDataFlowSimulation}
              className={isSimulating ? "bg-primary/10" : ""}
            >
              {isSimulating ? "Stop Simulation" : "Simulate Data Flow"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTooltips(!showTooltips)}
            >
              {showTooltips ? "Hide Labels" : "Show Labels"}
            </Button>
          </div>
        </div>
        
        <div className="relative border rounded-lg bg-muted/30 h-[450px] overflow-hidden">
          <svg 
            ref={svgRef}
            className="absolute inset-0 w-full h-full z-0"
            style={{ '--edge-start-color': 'rgb(203 213 225)', '--edge-end-color': 'rgb(148 163 184)' } as React.CSSProperties}
          >
            {edges.map((edge, i) => (
              <Edge 
                key={`${edge.from}-${edge.to}-${i}`} 
                from={edge.from} 
                to={edge.to} 
                nodes={nodes} 
                animated={edge.animated}
              />
            ))}
          </svg>
          
          <div className="absolute inset-0 z-10">
            {nodes.map(node => (
              <div 
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <NodeIcon 
                  type={node.type} 
                  x={node.x} 
                  y={node.y} 
                  selected={selectedNode?.id === node.id || hoveredNode === node.id}
                  onClick={() => handleNodeClick(node)}
                />
                {showTooltips && <NodeLabel node={node} />}
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-4 left-4 z-20">
            <div className="flex flex-col gap-1 p-3 bg-background/90 dark:bg-background/80 backdrop-blur border rounded-md shadow-sm">
              <div className="text-sm font-medium">{architecturePresets[selectedArchitecture as keyof typeof architecturePresets].name}</div>
              <div className="text-xs text-muted-foreground">Click on components to explore</div>
            </div>
          </div>
        </div>
        
        {selectedNode && (
          <div className="mt-4 p-3 border rounded-md bg-background">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-muted">
                  <NodeIcon 
                    type={selectedNode.type}
                    x={0}
                    y={0}
                    selected={true}
                    onClick={() => {}}
                  />
                </div>
                <h4 className="font-medium">{selectedNode.name}</h4>
              </div>
              <Badge variant="outline">
                {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
              </Badge>
            </div>
            
            <div className="text-sm">
              {selectedNode.type === 'server' && (
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <span>Role: </span>
                    <span className="font-medium text-foreground">Application Server</span>
                  </div>
                  <div>
                    <span>CPU: </span>
                    <span className="font-medium text-foreground">4 cores</span>
                  </div>
                  <div>
                    <span>Memory: </span>
                    <span className="font-medium text-foreground">16 GB</span>
                  </div>
                  <div>
                    <span>OS: </span>
                    <span className="font-medium text-foreground">Linux</span>
                  </div>
                </div>
              )}
              
              {selectedNode.type === 'database' && (
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <span>Type: </span>
                    <span className="font-medium text-foreground">PostgreSQL</span>
                  </div>
                  <div>
                    <span>Storage: </span>
                    <span className="font-medium text-foreground">500 GB</span>
                  </div>
                  <div>
                    <span>Connections: </span>
                    <span className="font-medium text-foreground">120 active</span>
                  </div>
                  <div>
                    <span>Replication: </span>
                    <span className="font-medium text-foreground">Active-Standby</span>
                  </div>
                </div>
              )}
              
              {selectedNode.type === 'loadBalancer' && (
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <span>Algorithm: </span>
                    <span className="font-medium text-foreground">Round Robin</span>
                  </div>
                  <div>
                    <span>Health Checks: </span>
                    <span className="font-medium text-foreground">TCP/HTTP</span>
                  </div>
                  <div>
                    <span>Throughput: </span>
                    <span className="font-medium text-foreground">10K req/s</span>
                  </div>
                  <div>
                    <span>SSL Termination: </span>
                    <span className="font-medium text-foreground">Enabled</span>
                  </div>
                </div>
              )}
              
              {selectedNode.type === 'security' && (
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <span>Type: </span>
                    <span className="font-medium text-foreground">Web Application Firewall</span>
                  </div>
                  <div>
                    <span>Rules: </span>
                    <span className="font-medium text-foreground">OWASP Top 10</span>
                  </div>
                  <div>
                    <span>Mode: </span>
                    <span className="font-medium text-foreground">Prevention</span>
                  </div>
                  <div>
                    <span>Logging: </span>
                    <span className="font-medium text-foreground">Real-time</span>
                  </div>
                </div>
              )}
              
              {(selectedNode.type !== 'server' && selectedNode.type !== 'database' && 
                selectedNode.type !== 'loadBalancer' && selectedNode.type !== 'security') && (
                <p className="text-muted-foreground">
                  {selectedNode.type === 'cdn' && "Content Delivery Network optimizing static content delivery with global edge locations."}
                  {selectedNode.type === 'vpc' && "Virtual Private Cloud providing isolated network infrastructure for secure communications."}
                  {selectedNode.type === 'apiGateway' && "API Gateway managing access control, rate limiting, and request routing to backend services."}
                  {selectedNode.type === 'objectStorage' && "Object Storage offering scalable, durable storage for files, backups, and static assets."}
                  {selectedNode.type === 'monitoring' && "Monitoring system collecting metrics, logs, and alerts for performance and health tracking."}
                  {selectedNode.type === 'customer' && "End users accessing application services through web browsers or mobile applications."}
                  {selectedNode.type === 'webApp' && "Web application serving content and processing user requests in a scalable frontend tier."}
                </p>
              )}
            </div>
            
            <div className="mt-3 border-t pt-2">
              <div className="text-xs text-muted-foreground">Connections:</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedNode.connections.length > 0 ? (
                  selectedNode.connections.map(connId => {
                    const connectedNode = nodes.find(n => n.id === connId);
                    return connectedNode ? (
                      <Badge key={connId} variant="secondary" className="text-xs">
                        {connectedNode.name}
                      </Badge>
                    ) : null;
                  })
                ) : (
                  <span className="text-xs text-muted-foreground">No outgoing connections</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaServer className="text-blue-500 dark:text-blue-400" />
            <h4 className="font-semibold">Modern Infrastructure</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Explore how modern applications leverage multi-tier architectures with load balancing,
            microservices, and database clusters to achieve high availability.
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaCloudUploadAlt className="text-purple-500 dark:text-purple-400" />
            <h4 className="font-semibold">Cloud Native Design</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            See how cloud-native applications are designed with scalability, resilience and 
            distributed architecture patterns to maximize resource efficiency.
          </p>
        </Card>
          <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaShieldAlt className="text-green-500 dark:text-green-400" />
            <h4 className="font-semibold">Security by Design</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Visualize security layers including WAFs, VPNs, and network segmentation that 
            protect modern applications from threats at multiple levels.
          </p>
        </Card>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>This interactive diagram showcases various cloud architecture patterns commonly used in enterprise environments. 
        Click on individual components to see details and relationships, or use the simulation feature to visualize data flows.</p>
      </div>
    </section>
  );
};

export default CloudArchitecture;
