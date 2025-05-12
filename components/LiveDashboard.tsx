"use client";

import { useState, useEffect, useRef } from "react";
import { FadeIn } from "./ui/animations";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FaServer, FaExclamationTriangle, FaCheckCircle, FaSync } from "react-icons/fa";

interface ServerMetrics {
  id: string;
  name: string;
  type: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  status: "healthy" | "warning" | "critical" | "offline";
  uptime: string;
  responseTime: number;
  incidents?: Incident[];
}

interface Incident {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "active" | "resolved" | "investigating";
  severity: "low" | "medium" | "high" | "critical";
}

const statusColors = {
  healthy: "bg-green-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
  offline: "bg-gray-500",
};

const statusBadgeVariant = {
  healthy: "outline",
  warning: "outline",
  critical: "destructive", 
  offline: "secondary",
};

const severityColors = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

// Create simulated server data
const initialServers: ServerMetrics[] = [
  {
    id: "srv-web-1",
    name: "Web Server 1",
    type: "Web Server",
    cpu: 28,
    memory: 42,
    disk: 36,
    network: 57,
    status: "healthy",
    uptime: "45d 12h 33m",
    responseTime: 35,
  },
  {
    id: "srv-web-2",
    name: "Web Server 2",
    type: "Web Server",
    cpu: 35,
    memory: 51,
    disk: 42,
    network: 49,
    status: "healthy",
    uptime: "30d 8h 15m",
    responseTime: 42,
  },
  {
    id: "srv-db-1",
    name: "Database Primary",
    type: "Database",
    cpu: 62,
    memory: 78,
    disk: 68,
    network: 34,
    status: "warning",
    uptime: "60d 22h 40m",
    responseTime: 55,
    incidents: [
      {
        id: "inc-db-1-1",
        title: "High CPU Usage",
        description: "Database server experiencing higher than normal CPU utilization",
        timestamp: "2023-05-10T15:23:42Z",
        status: "investigating",
        severity: "medium",
      },
    ],
  },
  {
    id: "srv-db-2",
    name: "Database Replica",
    type: "Database",
    cpu: 45,
    memory: 60,
    disk: 55,
    network: 28,
    status: "healthy",
    uptime: "15d 6h 12m",
    responseTime: 48,
  },
  {
    id: "srv-cache-1",
    name: "Cache Server",
    type: "Cache",
    cpu: 18,
    memory: 65,
    disk: 22,
    network: 72,
    status: "healthy",
    uptime: "25d 14h 50m",
    responseTime: 12,
  },
  {
    id: "srv-worker-1",
    name: "Worker Node 1",
    type: "Worker",
    cpu: 88,
    memory: 92,
    disk: 45,
    network: 67,
    status: "critical",
    uptime: "12d 3h 45m",
    responseTime: 120,
    incidents: [
      {
        id: "inc-worker-1-1",
        title: "Resource Exhaustion",
        description: "Worker node is experiencing resource exhaustion due to excessive job processing",
        timestamp: "2023-05-12T09:15:22Z",
        status: "active",
        severity: "high",
      },
    ],
  },
];

const StatusDot = ({ status }: { status: ServerMetrics["status"] }) => (
  <span className={`inline-block w-3 h-3 rounded-full ${statusColors[status]}`}></span>
);

const LiveDashboard = () => {
  const [servers, setServers] = useState<ServerMetrics[]>(initialServers);
  const [activeServer, setActiveServer] = useState<ServerMetrics | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState<boolean>(false);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [filter, setFilter] = useState<"all" | ServerMetrics["status"]>("all");
  const [totalMetrics, setTotalMetrics] = useState({
    servers: initialServers.length,
    healthy: initialServers.filter(s => s.status === "healthy").length,
    warning: initialServers.filter(s => s.status === "warning").length, 
    critical: initialServers.filter(s => s.status === "critical").length,
    offline: initialServers.filter(s => s.status === "offline").length,
    incidents: initialServers.reduce((acc, s) => acc + (s.incidents?.length || 0), 0),
  });
  
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  const filteredServers = filter === "all" 
    ? servers 
    : servers.filter(server => server.status === filter);

  // Update server metrics periodically to simulate real-time monitoring
  useEffect(() => {
    const updateServerMetrics = () => {
      setServers(prevServers => 
        prevServers.map(server => {
          // Random CPU fluctuation
          const cpuChange = Math.random() * 6 - 3; // -3 to +3
          let newCpu = server.cpu + cpuChange;
          newCpu = Math.max(5, Math.min(95, newCpu));
          
          // Random memory fluctuation
          const memChange = Math.random() * 4 - 2; // -2 to +2
          let newMemory = server.memory + memChange;
          newMemory = Math.max(10, Math.min(95, newMemory));
          
          // Network fluctuation
          const netChange = Math.random() * 8 - 4; // -4 to +4
          let newNetwork = server.network + netChange;
          newNetwork = Math.max(5, Math.min(95, newNetwork));
          
          // Response time fluctuation
          const responseChange = Math.random() * 10 - 5; // -5 to +5
          let newResponseTime = server.responseTime + responseChange;
          newResponseTime = Math.max(5, newResponseTime);
          
          // Determine server status based on metrics
          let newStatus = server.status;
          if (newCpu > 85 || newMemory > 90) {
            newStatus = "critical";
          } else if (newCpu > 70 || newMemory > 75) {
            newStatus = "warning";
          } else if (Math.random() > 0.995) { // Rare random offline event
            newStatus = "offline";
          } else {
            newStatus = "healthy";
          }
          
          // Generate incidents if status becomes critical
          let incidents = server.incidents || [];
          if (newStatus === "critical" && server.status !== "critical") {
            const issue = newCpu > 85 ? "CPU Saturation" : "Memory Exhaustion";
            incidents = [
              ...incidents,
              {
                id: `inc-${server.id}-${Date.now()}`,
                title: issue,
                description: `${server.name} is experiencing ${issue.toLowerCase()}. Automated remediation in progress.`,
                timestamp: new Date().toISOString(),
                status: "active",
                severity: "high",
              }
            ];
          }
          
          // Sometimes resolve incidents
          if (newStatus === "healthy" && incidents.length > 0) {
            incidents = incidents.map(incident => {
              if (incident.status !== "resolved" && Math.random() > 0.7) {
                return { ...incident, status: "resolved" };
              }
              return incident;
            });
          }
          
          return {
            ...server,
            cpu: newCpu,
            memory: newMemory,
            disk: server.disk + (Math.random() * 0.2 - 0.05), // Very slow disk growth
            network: newNetwork,
            status: newStatus,
            responseTime: newResponseTime,
            incidents,
          };
        })
      );
    };

    if (isSimulating) {
      // Update every 3 seconds
      simulationRef.current = setInterval(updateServerMetrics, 3000);
    }

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, [isSimulating]);

  // Update summary metrics whenever servers change
  useEffect(() => {
    setTotalMetrics({
      servers: servers.length,
      healthy: servers.filter(s => s.status === "healthy").length,
      warning: servers.filter(s => s.status === "warning").length,
      critical: servers.filter(s => s.status === "critical").length,
      offline: servers.filter(s => s.status === "offline").length,
      incidents: servers.reduce((acc, s) => acc + (s.incidents?.filter(i => i.status !== "resolved").length || 0), 0),
    });
  }, [servers]);

  const handleServerClick = (server: ServerMetrics) => {
    setActiveServer(server);
  };

  const handleIncidentClick = (incident: Incident) => {
    setActiveIncident(incident);
    setIsIncidentModalOpen(true);
  };

  const triggeFlagituation = (type: 'resourceExhaustion' | 'databaseOverload' | 'networkLatency' | 'diskFailure') => {
    if (type === 'resourceExhaustion') {
      setServers(prevServers => 
        prevServers.map(server => 
          server.id === "srv-web-1" ? {
            ...server,
            cpu: 95,
            memory: 92,
            status: "critical",
            incidents: [
              ...(server.incidents || []),
              {
                id: `inc-simulated-${Date.now()}`,
                title: "Critical Resource Exhaustion",
                description: "Web server experiencing critical resource exhaustion due to traffic spike. Auto-scaling triggered.",
                timestamp: new Date().toISOString(),
                status: "active",
                severity: "critical",
              }
            ]
          } : server
        )
      );
    } else if (type === 'databaseOverload') {
      setServers(prevServers => 
        prevServers.map(server => 
          server.id === "srv-db-1" ? {
            ...server,
            cpu: 89,
            memory: 86,
            disk: 92,
            status: "critical",
            responseTime: 320,
            incidents: [
              ...(server.incidents || []),
              {
                id: `inc-simulated-${Date.now()}`,
                title: "Database Overload",
                description: "Primary database experiencing high load and connection pooling issues. Read replicas being promoted.",
                timestamp: new Date().toISOString(),
                status: "active",
                severity: "critical",
              }
            ]
          } : server
        )
      );
    } else if (type === 'networkLatency') {
      setServers(prevServers => 
        prevServers.map(server => {
          if (server.type === "Web Server") {
            return {
              ...server,
              network: 95,
              responseTime: server.responseTime * 4,
              status: "warning",
              incidents: [
                ...(server.incidents || []),
                {
                  id: `inc-simulated-${Date.now()}`,
                  title: "Network Latency Issue",
                  description: "Elevated network latency detected. Traffic rerouting in progress.",
                  timestamp: new Date().toISOString(),
                  status: "investigating",
                  severity: "medium",
                }
              ]
            };
          }
          return server;
        })
      );
    } else if (type === 'diskFailure') {
      setServers(prevServers => 
        prevServers.map(server => 
          server.id === "srv-db-2" ? {
            ...server,
            disk: 99,
            status: "critical",
            incidents: [
              ...(server.incidents || []),
              {
                id: `inc-simulated-${Date.now()}`,
                title: "Disk Failure Imminent",
                description: "SMART warnings indicate imminent disk failure. Failover procedure initiated.",
                timestamp: new Date().toISOString(),
                status: "active",
                severity: "high",
              }
            ]
          } : server
        )
      );
    }
  };
  
  const resolveAllIncidents = () => {
    setServers(prevServers => 
      prevServers.map(server => ({
        ...server,
        status: "healthy",
        cpu: 20 + Math.random() * 15,
        memory: 30 + Math.random() * 20,
        disk: server.disk,
        network: 20 + Math.random() * 30,
        responseTime: 20 + Math.random() * 30,
        incidents: (server.incidents || []).map(incident => ({
          ...incident,
          status: "resolved"
        }))
      }))
    );
  };

  return (
    <section id="infrastructure-dashboard" className="scroll-mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-8 w-screen bg-background/80 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary lg:sr-only">
          Infrastructure Dashboard
        </h2>
      </div>

      <FadeIn direction="up" delay={100}>
        <div className="mb-8 relative">
          {/* Decorative element */}
          <div className="absolute left-0 top-0 h-12 w-1 bg-gradient-to-b from-primary/80 to-primary/0 rounded-full hidden lg:block"></div>
          
          <div className="lg:pl-8">
            <h3 className="text-2xl font-bold mb-3 font-heading">Live Infrastructure Dashboard</h3>
            <p className="text-muted-foreground">
              Experience a real-time view of a cloud infrastructure environment. Monitor server health, 
              view detailed metrics, and simulate incident response scenarios.
            </p>
          </div>
        </div>
      </FadeIn>      <FadeIn direction="up" delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <Card className="overflow-hidden border-green-200/50 dark:border-green-800/50 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 to-green-100/30 dark:from-green-950/80 dark:to-green-900/30 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-0 left-0 h-1 w-full bg-green-500/70"></div>
            <CardContent className="p-5 flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-green-800 dark:text-green-400 mb-1">Healthy</p>
                <h4 className="text-3xl font-bold font-heading">{totalMetrics.healthy}</h4>
              </div>
              <div className="bg-green-100 dark:bg-green-800/70 p-3 rounded-full shadow-sm">
                <FaCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-yellow-200/50 dark:border-yellow-800/50 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/80 to-yellow-100/30 dark:from-yellow-950/80 dark:to-yellow-900/30 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-0 left-0 h-1 w-full bg-yellow-500/70"></div>
            <CardContent className="p-5 flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-yellow-800 dark:text-yellow-400 mb-1">Warning</p>
                <h4 className="text-3xl font-bold font-heading">{totalMetrics.warning}</h4>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-800/70 p-3 rounded-full shadow-sm">
                <FaExclamationTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-red-200/50 dark:border-red-800/50 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 to-red-100/30 dark:from-red-950/80 dark:to-red-900/30 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-0 left-0 h-1 w-full bg-red-500/70"></div>
            <CardContent className="p-5 flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-red-800 dark:text-red-400 mb-1">Critical</p>
                <h4 className="text-3xl font-bold font-heading">{totalMetrics.critical}</h4>
              </div>
              <div className="bg-red-100 dark:bg-red-800/70 p-3 rounded-full shadow-sm">
                <FaExclamationTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-primary/20 dark:border-primary/20 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-0 left-0 h-1 w-full bg-primary/50"></div>
            <CardContent className="p-5 flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-primary/80 mb-1">Active Incidents</p>
                <h4 className="text-3xl font-bold font-heading">{totalMetrics.incidents}</h4>
              </div>
              <div className="bg-primary/10 p-3 rounded-full shadow-sm">
                <FaServer className="h-6 w-6 text-primary/80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-4 border border-border/50 bg-card/30 backdrop-blur-sm rounded-lg">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-primary hover:bg-primary/90" : "hover:border-primary/50 hover:text-primary"}
          >
            All Servers
          </Button>
          <Button
            variant={filter === "healthy" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("healthy")}
            className={filter === "healthy" 
              ? "bg-green-500/80 hover:bg-green-500/70 text-white" 
              : "border-green-200 dark:border-green-800/50 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"}
          >
            Healthy
          </Button>
          <Button
            variant={filter === "warning" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("warning")}
            className={filter === "warning" 
              ? "bg-yellow-500/80 hover:bg-yellow-500/70 text-white" 
              : "border-yellow-200 dark:border-yellow-800/50 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"}
          >
            Warning
          </Button>
          <Button
            variant={filter === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("critical")}
            className={filter === "critical" 
              ? "bg-red-500/80 hover:bg-red-500/70 text-white" 
              : "border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"}
          >
            Critical
          </Button>
          <Button
            variant={filter === "offline" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("offline")}
            className={filter === "offline" 
              ? "bg-slate-500/80 hover:bg-slate-500/70 text-white" 
              : "border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/20"}
          >
            Offline
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isSimulating ? "default" : "outline"}
            size="sm"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-2 ${
              isSimulating 
                ? 'bg-primary hover:bg-primary/90' 
                : 'border-primary/30 text-primary hover:border-primary hover:bg-primary/5'
            }`}
          >
            <FaSync className={`h-3 w-3 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? "Stop Simulation" : "Start Simulation"}
          </Button>
        </div>
      </div>      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {filteredServers.map(server => (
          <Card 
            key={server.id} 
            className={`cursor-pointer transition-all duration-300 relative overflow-hidden backdrop-blur-sm
              ${activeServer?.id === server.id 
                ? 'border-primary/50 shadow-lg ring-1 ring-primary/30 bg-card' 
                : 'hover:border-primary/30 hover:shadow-md hover:bg-card/80 bg-card/50'
              }`}
            onClick={() => handleServerClick(server)}
          >
            {/* Status indicator line on top */}
            <div 
              className={`absolute top-0 left-0 h-1 w-full
                ${server.status === 'healthy' ? 'bg-green-500/70' : 
                  server.status === 'warning' ? 'bg-yellow-500/70' : 
                  server.status === 'critical' ? 'bg-red-500/70' : 
                  'bg-slate-500/70'}`} 
            />
            
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-full ${
                    server.status === 'healthy' ? 'bg-green-100 dark:bg-green-900/50' : 
                    server.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/50' : 
                    server.status === 'critical' ? 'bg-red-100 dark:bg-red-900/50' : 
                    'bg-slate-100 dark:bg-slate-900/50'
                  }`}>
                    <StatusDot status={server.status} />
                  </div>
                  <h4 className="font-semibold font-heading">{server.name}</h4>
                </div>
                <Badge variant={statusBadgeVariant[server.status] as any} className={`
                  ${server.status === 'healthy' ? 'bg-green-100/50 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700/50' : 
                    server.status === 'warning' ? 'bg-yellow-100/50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700/50' : 
                    server.status === 'critical' ? 'bg-red-100/50 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700/50' : 
                    'bg-slate-100/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/50'
                  }`}>
                  {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium">CPU</span>
                    <span className={`font-semibold ${
                      server.cpu > 80 ? 'text-red-600 dark:text-red-400' :
                      server.cpu > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-green-600 dark:text-green-400'
                    }`}>{Math.round(server.cpu)}%</span>
                  </div>
                  <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        server.cpu > 80 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        server.cpu > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                        'bg-gradient-to-r from-green-500 to-green-400'
                      }`}
                      style={{ width: `${server.cpu}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium">Memory</span>
                    <span className={`font-semibold ${
                      server.memory > 80 ? 'text-red-600 dark:text-red-400' :
                      server.memory > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-green-600 dark:text-green-400'
                    }`}>{Math.round(server.memory)}%</span>
                  </div>
                  <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        server.memory > 80 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        server.memory > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                        'bg-gradient-to-r from-green-500 to-green-400'
                      }`}
                      style={{ width: `${server.memory}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium">Disk</span>
                    <span className={`font-semibold ${
                      server.disk > 80 ? 'text-red-600 dark:text-red-400' :
                      server.disk > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-green-600 dark:text-green-400'
                    }`}>{Math.round(server.disk)}%</span>
                  </div>
                  <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        server.disk > 80 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        server.disk > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                        'bg-gradient-to-r from-green-500 to-green-400'
                      }`}
                      style={{ width: `${server.disk}%` }}
                    />
                  </div>
                </div>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-border/40">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground font-medium">Type:</span>
                    <span className="font-semibold">{server.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground font-medium">Response:</span>
                    <span className={`font-semibold ${
                      server.responseTime > 100 ? 'text-red-600 dark:text-red-400' :
                      server.responseTime > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-green-600 dark:text-green-400'
                    }`}>{Math.round(server.responseTime)} ms</span>
                  </div>
                </div>
                
                {server.incidents && server.incidents.filter(i => i.status !== "resolved").length > 0 && (
                  <div className="pt-3 border-t border-red-200/50 dark:border-red-800/50 mt-3 bg-red-50/50 dark:bg-red-900/20 -mx-5 -mb-5 px-5 pb-4 rounded-b-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-2 flex items-center gap-1.5">
                      <FaExclamationTriangle className="h-3.5 w-3.5" />
                      <span>Active Incidents</span>
                    </p>
                    <ul className="space-y-1.5">
                      {server.incidents
                        .filter(incident => incident.status !== "resolved")
                        .map(incident => (
                          <li 
                            key={incident.id} 
                            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-red-100/50 dark:hover:bg-red-900/30 p-1.5 px-2 rounded-md transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIncidentClick(incident);
                            }}
                          >
                            <span className={`inline-block w-2 h-2 rounded-full ${severityColors[incident.severity]}`} />
                            <span className="truncate font-medium text-red-800 dark:text-red-300">{incident.title}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>      <div className="border border-border/50 backdrop-blur-sm bg-card/30 rounded-xl p-5 mb-8">
        <h4 className="font-medium font-heading text-lg mb-4 flex items-center gap-2">
          <span className="inline-block p-1.5 rounded-full bg-primary/10">
            <FaServer className="h-4 w-4 text-primary" />
          </span>
          Simulate Infrastructure Incidents
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button 
            variant="outline"
            onClick={() => triggeFlagituation('resourceExhaustion')}
            className="border-yellow-200/70 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100/70 dark:hover:bg-yellow-800/30"
          >
            Resource Exhaustion
          </Button>
          <Button 
            variant="outline"
            onClick={() => triggeFlagituation('databaseOverload')}
            className="border-red-200/70 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/20 text-red-800 dark:text-red-300 hover:bg-red-100/70 dark:hover:bg-red-800/30"
          >
            Database Overload 
          </Button>
          <Button 
            variant="outline"
            onClick={() => triggeFlagituation('networkLatency')}
            className="border-blue-200/70 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 hover:bg-blue-100/70 dark:hover:bg-blue-800/30"
          >
            Network Latency
          </Button>
          <Button 
            variant="outline"
            onClick={() => triggeFlagituation('diskFailure')}
            className="border-purple-200/70 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 hover:bg-purple-100/70 dark:hover:bg-purple-800/30"
          >
            Disk Failure
          </Button>
        </div>
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline"
            onClick={resolveAllIncidents}
            className="border-green-200/70 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-100/70 dark:hover:bg-green-800/30 flex items-center gap-1.5"
          >
            <FaCheckCircle className="h-3.5 w-3.5" /> Resolve All Issues
          </Button>
        </div>
      </div>      {activeServer && (
        <FadeIn direction="up">
          <Card className="mb-8 border-primary/20 relative overflow-hidden">
            {/* Status indicator line on top */}
            <div 
              className={`absolute top-0 left-0 h-1.5 w-full
                ${activeServer.status === 'healthy' ? 'bg-green-500/70' : 
                  activeServer.status === 'warning' ? 'bg-yellow-500/70' : 
                  activeServer.status === 'critical' ? 'bg-red-500/70' : 
                  'bg-slate-500/70'}`} 
            />
            
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
            
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-full ${
                    activeServer.status === 'healthy' ? 'bg-green-100 dark:bg-green-900/50' : 
                    activeServer.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/50' : 
                    activeServer.status === 'critical' ? 'bg-red-100 dark:bg-red-900/50' : 
                    'bg-slate-100 dark:bg-slate-900/50'
                  }`}>
                    <StatusDot status={activeServer.status} />
                  </div>
                  <h3 className="text-2xl font-bold font-heading">{activeServer.name}</h3>
                </div>
                <Badge 
                  variant={statusBadgeVariant[activeServer.status] as any}
                  className={`px-3 py-1 text-sm font-medium
                    ${activeServer.status === 'healthy' ? 'bg-green-100/50 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700/50' : 
                      activeServer.status === 'warning' ? 'bg-yellow-100/50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700/50' : 
                      activeServer.status === 'critical' ? 'bg-red-100/50 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700/50' : 
                      'bg-slate-100/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/50'
                    }`}>
                  {activeServer.status.charAt(0).toUpperCase() + activeServer.status.slice(1)}
                </Badge>
              </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-lg font-heading mb-4 pb-1 border-b border-border/40 flex items-center gap-2">
                    <span className="text-primary/70">System Metrics</span>
                  </h4>
                  
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">CPU Usage</span>
                        <span className={`font-semibold ${
                          activeServer.cpu > 80 ? 'text-red-600 dark:text-red-400' :
                          activeServer.cpu > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                          'text-green-600 dark:text-green-400'
                        }`}>{Math.round(activeServer.cpu)}%</span>
                      </div>
                      <div className="w-full bg-muted/60 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeServer.cpu > 80 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                            activeServer.cpu > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                            'bg-gradient-to-r from-green-500 to-green-400'
                          }`}
                          style={{ width: `${activeServer.cpu}%` }}
                        />
                      </div>
                      
                      {/* CPU Usage Scale */}
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Memory Usage</span>
                        <span className={`font-semibold ${
                          activeServer.memory > 80 ? 'text-red-600 dark:text-red-400' :
                          activeServer.memory > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                          'text-green-600 dark:text-green-400'
                        }`}>{Math.round(activeServer.memory)}%</span>
                      </div>
                      <div className="w-full bg-muted/60 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeServer.memory > 80 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                            activeServer.memory > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                            'bg-gradient-to-r from-green-500 to-green-400'
                          }`}
                          style={{ width: `${activeServer.memory}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Disk Usage</span>
                        <span className={`font-semibold ${
                          activeServer.disk > 80 ? 'text-red-600 dark:text-red-400' :
                          activeServer.disk > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                          'text-green-600 dark:text-green-400'
                        }`}>{Math.round(activeServer.disk)}%</span>
                      </div>
                      <div className="w-full bg-muted/60 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeServer.disk > 80 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                            activeServer.disk > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                            'bg-gradient-to-r from-green-500 to-green-400'
                          }`}
                          style={{ width: `${activeServer.disk}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Network Utilization</span>
                        <span className={`font-semibold ${
                          activeServer.network > 80 ? 'text-red-600 dark:text-red-400' :
                          activeServer.network > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                          'text-green-600 dark:text-green-400'
                        }`}>{Math.round(activeServer.network)}%</span>
                      </div>
                      <div className="w-full bg-muted/60 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeServer.network > 80 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                            activeServer.network > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                            'bg-gradient-to-r from-green-500 to-green-400'
                          }`}
                          style={{ width: `${activeServer.network}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="border border-border/50 rounded-lg p-3 bg-card/50">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Response Time</p>
                      <p className={`text-xl font-semibold mt-1 ${
                        activeServer.responseTime > 100 ? 'text-red-600 dark:text-red-400' :
                        activeServer.responseTime > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-green-600 dark:text-green-400'
                      }`}>{Math.round(activeServer.responseTime)} ms</p>
                    </div>
                    <div className="border border-border/50 rounded-lg p-3 bg-card/50">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Uptime</p>
                      <p className="text-xl font-semibold mt-1">{activeServer.uptime}</p>
                    </div>
                  </div>
                </div>                <div>
                  <h4 className="font-semibold text-lg font-heading mb-4 pb-1 border-b border-border/40 flex items-center gap-2">
                    <span className="text-primary/70">Incident History</span>
                  </h4>
                  
                  {activeServer.incidents && activeServer.incidents.length > 0 ? (
                    <div className="space-y-4">
                      {activeServer.incidents.map(incident => (
                        <div 
                          key={incident.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                            incident.status === "active" ? "border-red-300/70 dark:border-red-800/70 bg-red-50/50 dark:bg-red-900/20" :
                            incident.status === "investigating" ? "border-yellow-300/70 dark:border-yellow-800/70 bg-yellow-50/50 dark:bg-yellow-900/20" :
                            "border-green-300/70 dark:border-green-800/70 bg-green-50/50 dark:bg-green-900/20"
                          }`}
                          onClick={() => handleIncidentClick(incident)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`inline-block w-2.5 h-2.5 rounded-full ${severityColors[incident.severity]}`} />
                              <h5 className="font-medium font-heading">{incident.title}</h5>
                            </div>
                            <Badge variant={
                              incident.status === "active" ? "destructive" :
                              incident.status === "investigating" ? "outline" :
                              "default"
                            } className={`${
                              incident.status === "active" ? "bg-red-100/70 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700" :
                              incident.status === "investigating" ? "bg-yellow-100/70 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700" :
                              "bg-green-100/70 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
                            }`}>
                              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {incident.description.length > 100 
                              ? `${incident.description.substring(0, 100)}...` 
                              : incident.description}
                          </p>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30 text-xs">
                            <span className="font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
                              Severity: {incident.severity.toUpperCase()}
                            </span>
                            <span className="text-muted-foreground">
                              {new Date(incident.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center border border-border/30 rounded-lg p-8 bg-card/50">
                      <FaCheckCircle className="h-6 w-6 text-green-500 mb-2" />
                      <p className="text-muted-foreground">No incidents reported</p>
                      <p className="text-xs text-muted-foreground mt-1">Server is operating normally</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {isIncidentModalOpen && activeIncident && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${severityColors[activeIncident.severity]}`} />
                <h3 className="font-semibold text-lg">{activeIncident.title}</h3>
              </div>
              <Badge variant={
                activeIncident.status === "active" ? "destructive" :
                activeIncident.status === "investigating" ? "outline" :
                "default"
              }>
                {activeIncident.status.charAt(0).toUpperCase() + activeIncident.status.slice(1)}
              </Badge>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="mb-4">
                <h4 className="text-sm text-muted-foreground mb-1">Description</h4>
                <p>{activeIncident.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Severity</h4>
                  <p className="font-medium">{activeIncident.severity.toUpperCase()}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Time Reported</h4>
                  <p className="font-medium">{new Date(activeIncident.timestamp).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="border rounded p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Recommended Actions</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Check detailed system logs for error messages</li>
                  <li>Verify resource allocation and service health</li>
                  <li>Implement automated recovery procedure</li>
                  <li>Update status in incident management system</li>
                  <li>Notify stakeholders if resolution time exceeds 15 minutes</li>
                </ul>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsIncidentModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setServers(prevServers => 
                  prevServers.map(server => ({
                    ...server,
                    incidents: (server.incidents || []).map(incident => {
                      if (incident.id === activeIncident.id) {
                        return { ...incident, status: "resolved" };
                      }
                      return incident;
                    })
                  }))
                );
                setIsIncidentModalOpen(false);
              }}>
                Mark as Resolved
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground">
        <p>This is a simulated infrastructure dashboard. Click on servers to view detailed information, 
        simulate incidents, and practice incident response scenarios. Click "Start Simulation" to see metrics change in real-time.</p>
      </div>
    </section>
  );
};

export default LiveDashboard;
