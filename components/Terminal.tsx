"use client";

import React, { useEffect, useState, useRef, KeyboardEvent } from "react";
import { FadeIn } from "./ui/animations";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FaTerminal, FaTimes, FaExpand, FaMinus, FaCopy } from "react-icons/fa";

interface CommandHistory {
  command: string;
  output: string;
  isError?: boolean;
}

// Define command handlers and documentation
interface CommandInfo {
  handler: (args: string[]) => string;
  description: string;
  usage: string;
  examples?: string[];
}

const Terminal = (): React.ReactNode => {
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "",
      output: "Welcome to Anup's Terminal! Type 'help' to see available commands.",
    },
  ]);
  const [position, setPosition] = useState<number>(history.length);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define system information
  const sysInfo = {
    hostname: "anup-server",
    kernel: "Linux 5.15.0-76-generic",
    uptime: "23 days, 4 hours, 12 minutes",
    cpu: "AMD Ryzen 9 5950X (32) @ 3.400GHz",
    memory: "64GB (12% used)",
    disks: [
      { name: "/dev/sda1", mountPoint: "/", size: "512GB", used: "128GB", avail: "384GB", usePercent: "25%" },
      { name: "/dev/sdb1", mountPoint: "/data", size: "2TB", used: "850GB", avail: "1.15TB", usePercent: "42%" },
    ],
    network: [
      { interface: "eth0", ip: "192.168.1.100", mac: "00:1A:2B:3C:4D:5E", status: "UP" },
      { interface: "eth1", ip: "10.0.0.15", mac: "00:5E:4D:3C:2B:1A", status: "UP" },
    ],
    services: [
      { name: "nginx", status: "active", since: "2023-04-01" },
      { name: "docker", status: "active", since: "2023-04-01" },
      { name: "postgresql", status: "active", since: "2023-04-01" },
      { name: "mongodb", status: "active", since: "2023-04-01" },
      { name: "redis", status: "active", since: "2023-04-01" },
    ],
    containers: [
      { id: "abc123", image: "nginx:latest", status: "Running", ports: "80->80/tcp" },
      { id: "def456", image: "postgres:13", status: "Running", ports: "5432->5432/tcp" },
      { id: "ghi789", image: "redis:alpine", status: "Running", ports: "6379->6379/tcp" },
      { id: "jkl012", image: "node:14", status: "Running", ports: "3000->3000/tcp" },
    ],
    virtualization: [
      { name: "web-01", status: "running", os: "Ubuntu 22.04", vcpus: 4, ram: "8GB" },
      { name: "db-01", status: "running", os: "Ubuntu 22.04", vcpus: 8, ram: "16GB" },
      { name: "cache-01", status: "running", os: "Alpine Linux", vcpus: 2, ram: "4GB" },
    ],
  };

  // Define available commands
  const commands: Record<string, CommandInfo> = {
    help: {
      handler: () => {
        return `Available commands:
  help                      - Show this help message
  clear                     - Clear the terminal
  ls [path]                 - List directory contents
  cat <file>                - Display file contents
  sysinfo                   - Display system information
  uptime                    - Show system uptime
  ps                        - List running processes
  df                        - Show disk usage
  free                      - Show memory usage
  ifconfig                  - Display network interfaces
  docker ps                 - List running containers
  vim <file>                - Edit a file (simulated)
  systemctl status [service] - Check service status
  cd <directory>            - Change directory
  hostname                  - Display hostname
  uname -a                  - Show system information
  vm list                   - List virtual machines
  whoami                    - Show current user
  exit                      - Exit the terminal

Type 'help <command>' for more information on a specific command`;
      },
      description: "Display help information about available commands",
      usage: "help [command]",
      examples: ["help", "help ls"],
    },
    clear: {
      handler: () => {
        setHistory([]);
        return "";
      },
      description: "Clear the terminal screen",
      usage: "clear",
    },
    ls: {
      handler: (args) => {
        const path = args[0] || "/home/anup";
        
        const files: Record<string, string[]> = {
          "/": ["bin", "boot", "dev", "etc", "home", "lib", "media", "mnt", "opt", "proc", "root", "run", "sbin", "srv", "sys", "tmp", "usr", "var"],
          "/home": ["anup"],
          "/home/anup": ["Documents", "Downloads", "projects", ".bashrc", ".vimrc", "notes.txt"],
          "/home/anup/projects": ["docker-compose.yml", "infrastructure", "monitoring", "scripts"],
          "/home/anup/Documents": ["resume.pdf", "certifications", "books"],
          "/etc": ["passwd", "shadow", "hostname", "hosts", "resolv.conf", "fstab", "ssh", "nginx"],
          "/var/log": ["auth.log", "syslog", "nginx", "docker", "mysql"],
        };

        if (path in files) {
          return files[path].map((file: string) => {
            // Add colors and indicators for directories
            if (!file.includes('.') && !['etc', 'var'].includes(file)) {
              return `<span style="color: #3498db; font-weight: bold;">${file}/</span>`;
            } else if (file.endsWith('.sh') || file.endsWith('.bash')) {
              return `<span style="color: #2ecc71;">${file}*</span>`;
            } else {
              return `<span style="color: #ecf0f1;">${file}</span>`;
            }
          }).join('    ');
        } else {
          return `ls: cannot access '${path}': No such file or directory`;
        }
      },
      description: "List directory contents",
      usage: "ls [path]",
      examples: ["ls", "ls /home/anup", "ls /etc"],
    },
    cat: {
      handler: (args) => {
        if (!args.length) {
          return "cat: missing file operand\nTry 'help cat' for more information";
        }

        const file = args[0];
        const fileContents: Record<string, string> = {
          "/home/anup/.bashrc": "# ~/.bashrc: executed by bash for non-login shells\n# see /usr/share/doc/bash/examples/startup-files\n\n# don't put duplicate lines in the history\nHISTCONTROL=ignoreboth\nHISTSIZE=1000\nHISTFILESIZE=2000",
          "/home/anup/.vimrc": "\" Vim configuration file\nsyntax on\nset number\nset tabstop=4\nset shiftwidth=4\nset expandtab\nset autoindent\nset smartindent\nset showmatch",
          "/home/anup/notes.txt": "# System Administration Notes\n\n## Server Maintenance Checklist\n- Update system packages weekly\n- Check disk usage and clean up logs monthly\n- Review security patches and apply as needed\n- Backup configuration files before major changes\n- Update documentation after system modifications",
          "/home/anup/projects/docker-compose.yml": "version: '3.8'\n\nservices:\n  web:\n    image: nginx:alpine\n    ports:\n      - \"80:80\"\n    volumes:\n      - ./web:/usr/share/nginx/html"
        };

        if (file in fileContents) {
          return fileContents[file];
        } else {
          return `cat: ${file}: No such file or directory`;
        }
      },
      description: "Display file contents",
      usage: "cat <file>",
      examples: ["cat /home/anup/notes.txt", "cat /home/anup/.bashrc"]
    },
    sysinfo: {
      handler: () => {
        return "System Information:\n" +
          "Hostname:      " + sysInfo.hostname + "\n" +
          "Kernel:        " + sysInfo.kernel + "\n" +
          "Uptime:        " + sysInfo.uptime + "\n" +
          "CPU:           " + sysInfo.cpu + "\n" +
          "Memory:        " + sysInfo.memory + "\n\n" +
          "Disk Information:\n" +
          sysInfo.disks.map(disk => 
            `${disk.name.padEnd(15)}${disk.size.padEnd(8)}${disk.used.padEnd(8)}${disk.avail.padEnd(8)}${disk.usePercent.padEnd(8)}${disk.mountPoint}`
          ).join('\n') + "\n\n" +
          "Network Information:\n" +
          sysInfo.network.map(net => 
            `${net.interface.padEnd(12)}${net.ip.padEnd(16)}${net.mac.padEnd(20)}${net.status}`
          ).join('\n') + "\n\n" +
          "Service Status:\n" +
          sysInfo.services.map(svc => 
            `${svc.name.padEnd(15)}${svc.status.padEnd(10)}since ${svc.since}`
          ).join('\n');
      },
      description: "Display system information",
      usage: "sysinfo",
    },
    uptime: {
      handler: () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return ` ${hours}:${minutes}:00 up ${sysInfo.uptime}, 2 users, load average: 0.45, 0.62, 0.58`;
      },
      description: "Tell how long the system has been running",
      usage: "uptime",
    },
    ps: {
      handler: (args) => {
        if (args.includes('-aux') || args.includes('-ef')) {
          return "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\n" +
                 "root         1  0.0  0.0 171860  8012 ?        Ss   Apr01   0:24 /sbin/init\n" +
                 "root         2  0.0  0.0      0     0 ?        S    Apr01   0:00 [kthreadd]\n" +
                 "root         3  0.0  0.0      0     0 ?        I<   Apr01   0:00 [rcu_gp]\n" +
                 "root       936  0.0  0.0 235800  6956 ?        Ssl  Apr01   0:04 /usr/sbin/rsyslogd -n\n" +
                 "root      1157  0.0  0.0 234188  8100 ?        Ss   Apr01   0:00 /usr/sbin/nginx -g daemon on; master_process on;\n" +
                 "www-data  1213  0.0  0.0 234888  5008 ?        S    Apr01   0:00 /usr/sbin/nginx -g daemon on; master_process on;\n" +
                 "anup      1528  0.0  0.0  12028  7048 pts/0    Ss   07:22   0:00 -bash\n" +
                 "root      1647  0.0  0.0 697848 10432 ?        Ssl  Apr01   1:54 /usr/bin/containerd\n" +
                 "root      1826  0.0  0.0 1160488 59328 ?       Ssl  Apr01   6:14 /usr/bin/dockerd -H fd://\n" +
                 "postgres  2013  0.0  0.1 226388 35168 ?        Ss   Apr01   0:42 postgres: 14/main: checkpointer\n" +
                 "mongodb   2234  0.3  1.2 1647728 205380 ?      Sl   Apr01  85:23 /usr/bin/mongod --config /etc/mongod.conf\n" +
                 "redis     2341  0.1  0.0  63628  7688 ?        Ssl  Apr01  19:32 redis-server 127.0.0.1:6379\n" +
                 "anup      3721  0.0  0.0  10472  3328 pts/0    R+   15:08   0:00 ps aux";
        } else {
          return "  PID TTY          TIME CMD\n" +
                 " 1528 pts/0    00:00:00 bash\n" +
                 " 3721 pts/0    00:00:00 ps";
        }
      },
      description: "List running processes",
      usage: "ps [options]",
      examples: ["ps", "ps -aux", "ps -ef"],
    },
    df: {
      handler: (args) => {
        let output = "Filesystem     Size    Used    Avail   Use%    Mounted on\n";
        
        if (args.includes('-h') || args.includes('--human-readable')) {
          output += sysInfo.disks.map(disk => 
            `${disk.name.padEnd(15)}${disk.size.padEnd(8)}${disk.used.padEnd(8)}${disk.avail.padEnd(8)}${disk.usePercent.padEnd(8)}${disk.mountPoint}`
          ).join('\n');
          return output;
        } else {
          return output + sysInfo.disks.map(disk => 
            `${disk.name.padEnd(15)}${disk.size.replace(/GB|TB/g, '').padEnd(8)}${disk.used.replace(/GB|TB/g, '').padEnd(8)}${disk.avail.replace(/GB|TB/g, '').padEnd(8)}${disk.usePercent.padEnd(8)}${disk.mountPoint}`
          ).join('\n');
        }
      },
      description: "Show disk usage",
      usage: "df [-h]",
      examples: ["df", "df -h"],
    },
    free: {
      handler: (args) => {
        if (args.includes('-h') || args.includes('--human')) {
          return "              total        used        free      shared  buff/cache   available\n" +
                "Mem:           64.0G        7.7G        48.0G       1.0G       8.3G        54.0G\n" +
                "Swap:           4.0G        0.0G        4.0G";
        } else {
          return "              total        used        free      shared  buff/cache   available\n" +
                "Mem:        67108864     8077312    50331648     1048576     8699904    56623104\n" +
                "Swap:        4194304           0     4194304";
        }
      },
      description: "Show memory usage",
      usage: "free [-h|--human]",
      examples: ["free", "free -h"],
    },
    ifconfig: {
      handler: () => {
        return "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n" +
              "        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255\n" +
              "        inet6 fe80::21a:2bff:fe3c:4d5e  prefixlen 64  scopeid 0x20<link>\n" +
              "        ether 00:1A:2B:3C:4D:5E  txqueuelen 1000  (Ethernet)\n" +
              "        RX packets 15212248  bytes 18047950796 (18.0 GB)\n" +
              "        RX errors 0  dropped 0  overruns 0  frame 0\n" +
              "        TX packets 8492568  bytes 1645776776 (1.6 GB)\n" +
              "        TX errors 0  dropped 0 overruns 0  carrier 0 collisions 0\n\n" +
              "eth1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n" +
              "        inet 10.0.0.15  netmask 255.255.255.0  broadcast 10.0.0.255\n" +
              "        inet6 fe80::5eff:4dff:fe3c:2b1a  prefixlen 64  scopeid 0x20<link>\n" +
              "        ether 00:5E:4D:3C:2B:1A  txqueuelen 1000  (Ethernet)\n" +
              "        RX packets 126850  bytes 18748960 (18.7 MB)\n" +
              "        RX errors 0  dropped 0  overruns 0  frame 0\n" +
              "        TX packets 95048  bytes 16811289 (16.8 MB)\n" +
              "        TX errors 0  dropped 0 overruns 0  carrier 0 collisions 0\n\n" +
              "lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n" +
              "        inet 127.0.0.1  netmask 255.0.0.0\n" +
              "        inet6 ::1  prefixlen 128  scopeid 0x10<host>\n" +
              "        loop  txqueuelen 1000  (Local Loopback)\n" +
              "        RX packets 1298756  bytes 114293320 (114.2 MB)\n" +
              "        RX errors 0  dropped 0  overruns 0  frame 0\n" +
              "        TX packets 1298756  bytes 114293320 (114.2 MB)\n" +
              "        TX errors 0  dropped 0 overruns 0  carrier 0 collisions 0";
      },
      description: "Display network interfaces",
      usage: "ifconfig",
    },
    docker: {
      handler: (args) => {
        if (args[0] === "ps") {
          return "CONTAINER ID   IMAGE            COMMAND                  CREATED          STATUS          PORTS                    NAMES\n" +
                "abc123def456   nginx:latest     \"/docker-entrypoint.…\"   2 days ago       Up 2 days        0.0.0.0:80->80/tcp       web-server\n" +
                "def456ghi789   postgres:13      \"docker-entrypoint.s…\"   2 days ago       Up 2 days        0.0.0.0:5432->5432/tcp   database\n" +
                "ghi789jkl012   redis:alpine     \"docker-entrypoint.s…\"   2 days ago       Up 2 days        0.0.0.0:6379->6379/tcp   cache\n" +
                "jkl012mno345   node:14          \"docker-entrypoint.s…\"   2 days ago       Up 2 days        0.0.0.0:3000->3000/tcp   api";
        } else if (args[0] === "images") {
          return "REPOSITORY      TAG       IMAGE ID       CREATED         SIZE\n" +
                "nginx          latest    ad4c705f24d3   2 weeks ago    133MB\n" +
                "postgres       13        f51c55a33969   3 weeks ago    315MB\n" +
                "redis          alpine    e79bfe8c0d69   4 weeks ago    32.4MB\n" +
                "node           14        82f9a5d7c35c   4 weeks ago    944MB\n" +
                "ubuntu         latest    27941809078c   5 weeks ago    77.8MB";
        } else if (args.length === 0) {
          return "Usage:  docker [OPTIONS] COMMAND\n\n" +
                "A self-sufficient runtime for containers\n\n" +
                "Common Commands:\n" +
                "  run         Create and run a new container from an image\n" +
                "  exec        Execute a command in a running container\n" +
                "  ps          List containers\n" +
                "  build       Build an image from a Dockerfile\n" +
                "  pull        Download an image from a registry\n" +
                "  push        Upload an image to a registry\n" +
                "  images      List images\n" +
                "  login       Log in to a registry\n" +
                "  logout      Log out from a registry\n" +
                "  search      Search Docker Hub for images\n" +
                "  version     Show the Docker version information\n" +
                "  info        Display system-wide information";
        } else {
          return "docker: '" + args.join(' ') + "' is not a docker command.\n" +
                "See 'docker --help'";
        }
      },
      description: "Interact with Docker containers and images",
      usage: "docker [COMMAND]",
      examples: ["docker ps", "docker images"],
    },
    vim: {
      handler: (args) => {
        if (args.length === 0) {
          return "vim: No file specified";
        }
        
        return "Opening " + args[0] + " for editing...\n\n" +
              "[vim interface simulation]\n" +
              ":q! to exit without saving\n" +
              ":wq to save and exit";
      },
      description: "Edit a file (simulated)",
      usage: "vim <file>",
      examples: ["vim /home/anup/notes.txt"],
    },
    systemctl: {
      handler: (args) => {
        if (args[0] !== "status") {
          return "systemctl: command requires a service name. Try 'systemctl status [service]'";
        }
        
        const service = args[1];
        const serviceData: Record<string, { status: string, description: string }> = {
          "nginx": {
            status: "active (running)",
            description: "A high performance web server and reverse proxy server"
          },
          "docker": {
            status: "active (running)",
            description: "Docker Application Container Engine"
          },
          "postgresql": {
            status: "active (running)",
            description: "PostgreSQL RDBMS server"
          },
          "mongodb": {
            status: "active (running)",
            description: "MongoDB Database Server"
          },
          "redis": {
            status: "active (running)",
            description: "Redis In-Memory Data Store"
          },
        };
        
        if (service && service in serviceData) {
          const data = serviceData[service];
          return "● " + service + ".service - " + data.description + "\n" +
                "   Loaded: loaded (/lib/systemd/system/" + service + ".service; enabled; vendor preset: enabled)\n" +
                "   Active: " + data.status + " since Mon 2023-04-01 08:15:37 UTC; 23 days ago\n" +
                "     Docs: https://www." + service + ".org/docs/\n" +
                " Main PID: 1157 (" + service + ")\n" +
                "    Tasks: 2\n" +
                "   Memory: 9.8M\n" +
                "   CGroup: /system.slice/" + service + ".service\n" +
                "           ├─1157 " + service + " main process\n" +
                "           └─1213 " + service + " worker process";
        } else if (!service) {
          return "systemctl: command requires a service name. Try 'systemctl status [service]'";
        } else {
          return "Unit " + service + ".service could not be found.";
        }
      },
      description: "Check service status",
      usage: "systemctl status [service]",
      examples: ["systemctl status nginx", "systemctl status docker"],
    },
    cd: {
      handler: (args) => {
        return "(Directory changed to " + (args[0] || "/home/anup") + ")\n" +
              "Note: Directory changes are simulated and do not persist between commands.";
      },
      description: "Change directory",
      usage: "cd <directory>",
      examples: ["cd /home/anup", "cd /etc"],
    },
    hostname: {
      handler: () => {
        return sysInfo.hostname;
      },
      description: "Display hostname",
      usage: "hostname",
    },
    uname: {
      handler: (args) => {
        if (args.includes("-a")) {
          return "Linux " + sysInfo.hostname + " 5.15.0-76-generic #83-Ubuntu SMP Thu Jun 15 19:16:32 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux";
        } else {
          return "Linux";
        }
      },
      description: "Show system information",
      usage: "uname [-a]",
      examples: ["uname", "uname -a"],
    },
    vm: {
      handler: (args) => {
        if (args[0] === "list") {
          return "NAME       STATUS    OS              VCPUS    RAM\n" +
                "web-01     running   Ubuntu 22.04     4       8GB\n" +
                "db-01      running   Ubuntu 22.04     8       16GB\n" +
                "cache-01   running   Alpine Linux     2       4GB";
        } else {
          return "Usage: vm list";
        }
      },
      description: "List virtual machines",
      usage: "vm list",
    },
    whoami: {
      handler: () => {
        return "anup";
      },
      description: "Show current user",
      usage: "whoami",
    },
    exit: {
      handler: () => {
        setIsMinimized(true);
        return "Terminal session ended";
      },
      description: "Exit the terminal",
      usage: "exit",
    },
  };

  const runCommand = (cmd: string): void => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;
    
    setCommandHistory((prev) => [...prev, trimmedCmd]);
    setHistoryIndex(commandHistory.length);
    
    const args = trimmedCmd.split(/\s+/);
    const command = args.shift()?.toLowerCase();
    
    let output = "";
    let isError = false;
    
    setIsLoading(true);
    
    // Simulating a delay to make it feel more like a real terminal
    setTimeout(() => {
      if (command && command in commands) {
        try {
          output = commands[command].handler(args);
        } catch (err) {
          output = `An error occurred while executing the command: ${err}`;
          isError = true;
        }
      } else if (command) {
        output = `${command}: command not found`;
        isError = true;
      }
        if (command !== "clear") {
        setHistory((prev: CommandHistory[]) => [
          ...prev,
          { command: trimmedCmd, output, isError },
        ]);
      }
        setInput("");
      setIsLoading(false);
      setPosition(history.length + 1);
      
      // Scroll to bottom
      if (terminalRef.current) {
        setTimeout(() => {
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
          // Re-focus the input field after command execution
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      }
    }, 100);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(commandHistory.length);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple tab completion for commands
      const partialCmd = input.split(/\s+/)[0];
      if (partialCmd && !input.includes(" ")) {
        const matches = Object.keys(commands).filter(cmd => 
          cmd.startsWith(partialCmd)
        );
        
        if (matches.length === 1) {
          setInput(matches[0] + " ");
        }
      }    } else if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      setHistory((prev: CommandHistory[]) => [
        ...prev,
        { command: input, output: "^C", isError: false }
      ]);
      setInput("");
    } else if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setHistory([]);
    }
  };
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // Focus the input after toggling fullscreen
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  // Focus the input when clicking anywhere in the terminal
  const handleTerminalClick = (e: React.MouseEvent) => {
    // Prevent event propagation to stop parent elements from handling the event
    e.stopPropagation();
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };  // Handle ESC key for fullscreen exit
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  useEffect(() => {
    // Auto-focus on input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);  // When command history changes, scroll to the bottom of the terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  // Maintain focus when fullscreen state changes
  useEffect(() => {
    if (inputRef.current && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isFullscreen, isMinimized]);
  
  // Additional focus handler to ensure terminal input stays focused
  useEffect(() => {
    const refocusInput = () => {
      if (inputRef.current && document.activeElement !== inputRef.current && !isMinimized) {
        inputRef.current.focus();
      }
    };
    
    // Refocus after any user interaction with the terminal
    const terminalElement = terminalRef.current;
    if (terminalElement) {
      terminalElement.addEventListener('click', refocusInput);
      terminalElement.addEventListener('touchend', refocusInput);
    }
    
    return () => {
      if (terminalElement) {
        terminalElement.removeEventListener('click', refocusInput);
        terminalElement.removeEventListener('touchend', refocusInput);
      }
    };
  }, [isMinimized]);
  if (isMinimized) {
    return (
      <section id="terminal-demo" className="scroll-mt-16">
        <div className="sticky top-0 z-20 -mx-6 mb-8 w-screen bg-background/80 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary lg:sr-only">
            Terminal Demo
          </h2>
        </div>
        <FadeIn direction="up" delay={100}>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-3 font-heading">Interactive Terminal</h3>
            <p className="text-muted-foreground">
              Experience a simulated Linux environment where you can execute common system administration commands.
            </p>
          </div>
          <Button 
            onClick={toggleMinimize} 
            className="flex items-center gap-2 relative overflow-hidden group"
            variant="default"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <FaTerminal className="relative z-10" /> 
            <span className="relative z-10">Launch Terminal</span>
          </Button>
        </FadeIn>
      </section>
    );
  }
  return (
    <section id="terminal-demo" className="scroll-mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-8 w-screen bg-background/80 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary lg:sr-only">
          Terminal Demo
        </h2>
      </div>
        <FadeIn direction="up" delay={100}>
        <div className={isFullscreen ? 'terminal-fullscreen' : ''}>
          <Card className="terminal-window border">
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 pointer-events-none"></div>
            
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 pl-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="font-mono text-sm ml-2 text-gray-300">anup@anup-server:~</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-700/50">
                  <FaMinus className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-700/50">
                  <FaExpand className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => runCommand("clear")} className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-700/50">
                  <FaTimes className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="terminal-body">              <div 
                ref={terminalRef} 
                className="terminal-content" 
                onClick={handleTerminalClick}
                onMouseDown={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
              >
                {history.map((item: CommandHistory, idx: number) => (
                  <div key={idx} className="mb-2 group">
                    {item.command && (
                      <div className="flex items-center gap-2">                        <span className="terminal-prompt">anup@anup-server:~$</span>
                        <span className="flex-1">{item.command}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:bg-gray-800/50 text-gray-400"
                          onClick={() => copyToClipboard(item.command)}
                        >
                          <FaCopy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {item.output && (
                      <div 
                        className={`mt-1 whitespace-pre-wrap ${item.isError ? 'text-red-400' : 'text-emerald-50/90'}`}
                        dangerouslySetInnerHTML={{ __html: item.output }}
                      ></div>
                    )}
                  </div>
                ))}                <div className="flex items-center gap-2">
                  <span className="terminal-prompt">anup@anup-server:~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none outline-none flex-1 text-white caret-green-500"
                    disabled={isLoading}
                    spellCheck="false"
                    autoCapitalize="none"
                    autoComplete="off"
                  />
                  {isLoading && <span className="animate-pulse text-green-500">■</span>}
                </div>              </div>
            </div>
          </Card>
          
          {isFullscreen && (
            <div className="absolute bottom-4 right-4">
              <Button onClick={toggleFullscreen} variant="secondary">
                Exit Fullscreen
              </Button>
            </div>
          )}
        </div>
        
        {!isFullscreen && (
          <div className="mt-4 p-3 rounded-lg bg-black/5 border border-border/40 text-muted-foreground text-sm">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-medium">Try commands:</span>
              {['ls', 'cat /home/anup/notes.txt', 'docker ps', 'sysinfo', 'help'].map((cmd) => (
                <code key={cmd} className="px-2 py-1 bg-primary/10 rounded text-xs font-mono text-primary">{cmd}</code>
              ))}
            </div>
          </div>
        )}
      </FadeIn>
    </section>
  );
};

export default Terminal;
