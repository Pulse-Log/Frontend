import React, { createContext, FC, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "../../config";

interface JoinStack {
  projectId: string;
  userId: string;
  sId: string;
}

interface JoinProject {
  projectId: string;
  userId: string;
}

interface EditInterface {
  projectId: string;
  userId: string;
  status: "pause" | "restart";
}

interface SocketUtils {
  joinStack: (object: JoinStack) => void;
  leaveStack: () => void;
  joinProject: (object: JoinProject) => void;
  editInterface: (object: EditInterface) => void;
  status: string;
  infoLogs: string[];
  socket: Socket | null;
  bufferedLogs: any[];
  stackStatus: Map<string, Map<string, Set<string>>> | null;
  lpsUpdate: Map<string, number> | null;
}

interface SocketProviderProps {
  children?: ReactNode;
}

export const SocketContext = createContext<SocketUtils | undefined>(undefined);


export const useSocketState = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('socket context must be initialized');
  }
  return context;
};

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<string>("Offline");
  const [infoLogs, setInfoLogs] = useState<string[]>([]);
  const [bufferedLogs, setBufferedLogs] = useState<any[]>([]);
  const [stackStatus, setStackStatus] = useState<Map<string, Map<string, Set<string>>> | null>(null);
  const [lpsUpdate, setLpsUpdate] = useState<Map<string,number> | null>(null);
  const logBufferRef = useRef<any[]>([]);

  useEffect(() => {
    const newSocket = io(`${API_BASE_URL}/logs`, {
      transports: ['websocket'],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinStack: SocketUtils["joinStack"] = useCallback((object: JoinStack) => {
    setBufferedLogs([]);
    if (socket) {
      socket.emit('joinStack', object);
    }
  }, [socket]);

  const leaveStack = useCallback(() => {
    setBufferedLogs([]);
    if (socket) {
      socket.emit('leaveStack');
    }
  }, [socket]);

  const joinProject: SocketUtils["joinProject"] = useCallback((object: JoinProject) => {
    setInfoLogs([]);
    if (socket) {
      socket.emit('joinProject', object);
    }
  }, [socket]);

  const editInterface: SocketUtils["editInterface"] = useCallback((object: EditInterface) => {
    if (socket) {
      socket.emit('editInterface', object);
    }
  }, [socket]);

  function reconstructNestedMapSet(data: Record<string, Record<string, string[]>>): Map<string, Map<string, Set<string>>> {
    const result = new Map<string, Map<string, Set<string>>>();
  
    for (const [outerKey, outerValue] of Object.entries(data)) {
      const innerMap = new Map<string, Set<string>>();
      
      for (const [innerKey, innerValue] of Object.entries(outerValue)) {
        innerMap.set(innerKey, new Set(innerValue));
      }
      
      result.set(outerKey, innerMap);
    }
  
    return result;
  }

  useEffect(() => {
    if (socket) {
      socket.on('newLog', (log) => {
        logBufferRef.current.push(log);
      });
      // socket.on('newLog', (log) => {
      //   console.log('New log received:', log);
      //   setLog(log);
      //   // Handle the new log message here
      //   // setNewLogs(prevLogs => {
      //   //   // Check if the new log is different from the last log
      //   //   if (prevLogs.length === 0 || prevLogs[prevLogs.length - 1] !== log) {
      //   //     return [...prevLogs, log];
      //   //   }
      //   //   return prevLogs;  // Return unchanged if the new log is the same as the last one
      //   // });
      // });

      socket.on('project_info_log', (log:string) => {
        console.log('Project info log received:', log);
        setInfoLogs(prevLogs => {
          // Check if the new log is different from the last log
          if (prevLogs.length === 0 || prevLogs[prevLogs.length - 1] !== log) {
            return [...prevLogs, log];
          }
          return prevLogs;  // Return unchanged if the new log is the same as the last one
        });
      });

      socket.on('stackStatus', (status:any)=>{
        console.log("Received yessss");
        console.log(reconstructNestedMapSet(status));
        setStackStatus(reconstructNestedMapSet(status));
      })

      socket.on('lpsUpdate', (status:any)=>{
        console.log("Received lps update ");
        setLpsUpdate(new Map(Object.entries(status)));
      })

      socket.on('error', (error) => {
        console.error('Socket error:', error);
        // Handle the error here
      });

      socket.on('status', (newStatus) => {
        setStatus(newStatus);
        console.log('Project status updated:', newStatus);
      });
    }
  }, [socket]);

  useEffect(() => {
    console.log("Updated lpsUpdate:", lpsUpdate);
  }, [lpsUpdate]);

  useEffect(() => {
    const bufferInterval = setInterval(() => {
      if (logBufferRef.current.length > 0) {
        setBufferedLogs(logBufferRef.current);
        logBufferRef.current = [];
      }
    }, 500); // Update buffered logs every second

    return () => clearInterval(bufferInterval);
  }, []);

  return (
    <SocketContext.Provider value={{
      joinStack,
      leaveStack,
      joinProject,
      editInterface,
      status,
      infoLogs,
      socket,
      bufferedLogs,
      stackStatus,
      lpsUpdate
    }}>
      {children}
    </SocketContext.Provider>
  );
};