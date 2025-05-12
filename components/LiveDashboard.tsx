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
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Infrastructure Dashboard
        </h2>
      </div>

      <FadeIn direction="up" delay={100}>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Live Infrastructure Dashboard</h3>
          <p className="text-muted-foreground">
            Experience a real-time view of a cloud infrastructure environment. Monitor server health, 
            view detailed metrics, and simulate incident response scenarios.
          </p>
        </div>
      </FadeIn>

      <FadeIn direction="up" delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className={`bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy</p>
                <h4 className="text-2xl font-bold">{totalMetrics.healthy}</h4>
              </div>
              <div className="bg-green-200 dark:bg-green-800 p-2 rounded-full">
                <FaCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className={`bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warning</p>
                <h4 className="text-2xl font-bold">{totalMetrics.warning}</h4>
              </div>
              <div className="bg-yellow-200 dark:bg-yellow-800 p-2 rounded-full">
                <FaExclamationTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className={`bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <h4 className="text-2xl font-bold">{totalMetrics.critical}</h4>
              </div>
              <div className="bg-red-200 dark:bg-red-800 p-2 rounded-full">
                <FaExclamationTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Incidents</p>
                <h4 className="text-2xl font-bold">{totalMetrics.incidents}</h4>
              </div>
              <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full">
                <FaServer className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Servers
          </Button>
          <Button
            variant={filter === "healthy" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("healthy")}
            className="text-green-600 dark:text-green-400"
          >
            Healthy
          </Button>
          <Button
            variant={filter === "warning" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("warning")}
            className="text-yellow-600 dark:text-yellow-400"
          >
            Warning
          </Button>
          <Button
            variant={filter === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("critical")}
            className="text-red-600 dark:text-red-400"
          >
            Critical
          </Button>
          <Button
            variant={filter === "offline" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("offline")}
            className="text-gray-600 dark:text-gray-400"
          >
            Offline
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-2 ${isSimulating ? 'bg-primary/10' : ''}`}
          >
            <FaSync className={`h-3 w-3 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? "Stop Simulation" : "Start Simulation"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredServers.map(server => (
          <Card 
            key={server.id} 
            className={`cursor-pointer hover:shadow-md transition-all ${
              activeServer?.id === server.id ? 'border-primary ring-1 ring-primary' : ''
            }`}
            onClick={() => handleServerClick(server)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusDot status={server.status} />
                  <h4 className="font-semibold">{server.name}</h4>
                </div>
                <Badge variant={statusBadgeVariant[server.status] as any}>
                  {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>CPU</span>
                    <span>{Math.round(server.cpu)}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        server.cpu > 80 ? 'bg-red-500' :
                        server.cpu > 60 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${server.cpu}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Memory</span>
                    <span>{Math.round(server.memory)}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        server.memory > 80 ? 'bg-red-500' :
                        server.memory > 60 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${server.memory}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Disk</span>
                    <span>{Math.round(server.disk)}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        server.disk > 80 ? 'bg-red-500' :
                        server.disk > 60 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${server.disk}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div>
                    <span className="text-muted-foreground">Type: </span>
                    <span>{server.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Response: </span>
                    <span>{Math.round(server.responseTime)} ms</span>
                  </div>
                </div>
                
                {server.incidents && server.incidents.filter(i => i.status !== "resolved").length > 0 && (
                  <div className="pt-2 border-t border-red-200 dark:border-red-800 mt-2">
                    <p className="text-red-500 dark:text-red-400 text-sm font-medium mb-1">Active Incidents:</p>
                    <ul className="space-y-1">
                      {server.incidents
                        .filter(incident => incident.status !== "resolved")
                        .map(incident => (
                          <li 
                            key={incident.id} 
                            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 p-1 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIncidentClick(incident);
                            }}
                          >
                            <span className={`inline-block w-2 h-2 rounded-full ${severityColors[incident.severity]}`} />
                            <span className="truncate">{incident.title}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <h4 className="font-medium mb-4">Simulate Infrastructure Incidents</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="outline"
            onClick={() => triggeFlagituation('resourceExhaustion')}
            className="border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300"
          >
            Resource Exhaustion
          </Button>
          <Button 
            variant="outline"
            onClick={() => triggeFlagituation('databaseOverload')}
            className="border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
          >
            Database Overload 
          </Button>
          <Button 
            variant="outline"
            onClick={() => triggeFlagituation('networkLatency')}
            className="border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300"
          >
            Network Latency
          </Button>
          <Button 
            variant="outline"
            onClick={() => triggeFlagituation('diskFailure')}
            className="border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300"
          >
            Disk Failure
          </Button>
        </div>
        <div className="mt-3 flex justify-end">
          <Button 
            variant="outline"
            onClick={resolveAllIncidents}
            className="border-green-200 dark:border-green-800 text-green-800 dark:text-green-300"
          >
            Resolve All Issues
          </Button>
        </div>
      </div>

      {activeServer && (
        <FadeIn direction="up">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <StatusDot status={activeServer.status} />
                  <h3 className="text-xl font-bold">{activeServer.name}</h3>
                </div>
                <Badge variant={statusBadgeVariant[activeServer.status] as any}>
                  {activeServer.status.charAt(0).toUpperCase() + activeServer.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 border-b pb-1">System Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>CPU Usage</span>
                        <span>{Math.round(activeServer.cpu)}%</span>
                      </div>
                      <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeServer.cpu > 80 ? 'bg-red-500' :
                            activeServer.cpu > 60 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${activeServer.cpu}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Memory Usage</span>
                        <span>{Math.round(activeServer.memory)}%</span>
                      </div>
                      <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeServer.memory > 80 ? 'bg-red-500' :
                            activeServer.memory > 60 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${activeServer.memory}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Disk Usage</span>
                        <span>{Math.round(activeServer.disk)}%</span>
                      </div>
                      <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeServer.disk > 80 ? 'bg-red-500' :
                            activeServer.disk > 60 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${activeServer.disk}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Network Utilization</span>
                        <span>{Math.round(activeServer.network)}%</span>
                      </div>
                      <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeServer.network > 80 ? 'bg-red-500' :
                            activeServer.network > 60 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${activeServer.network}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="border rounded p-2">
                      <p className="text-sm text-muted-foreground">Response Time</p>
                      <p className="text-lg font-semibold">{Math.round(activeServer.responseTime)} ms</p>
                    </div>
                    <div className="border rounded p-2">
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="text-lg font-semibold">{activeServer.uptime}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 border-b pb-1">Incident History</h4>
                  {activeServer.incidents && activeServer.incidents.length > 0 ? (
                    <div className="space-y-3">
                      {activeServer.incidents.map(incident => (
                        <div 
                          key={incident.id}
                          className={`border rounded p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                            incident.status === "active" ? "border-red-300 dark:border-red-800" :
                            incident.status === "investigating" ? "border-yellow-300 dark:border-yellow-800" :
                            "border-green-300 dark:border-green-800"
                          }`}
                          onClick={() => handleIncidentClick(incident)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium">{incident.title}</h5>
                            <Badge variant={
                              incident.status === "active" ? "destructive" :
                              incident.status === "investigating" ? "outline" :
                              "default"
                            }>
                              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {incident.description.length > 100 
                              ? `${incident.description.substring(0, 100)}...` 
                              : incident.description}
                          </p>
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>Severity: {incident.severity.toUpperCase()}</span>
                            <span>
                              {new Date(incident.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center border rounded p-4">
                      <p className="text-muted-foreground">No incidents reported</p>
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
