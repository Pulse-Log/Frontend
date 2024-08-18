import React, { createContext, FC, ReactNode, useContext, useState } from 'react';

interface NavbarUtils {
  refetchNavbar: any;
  setNavbarFunction: any;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isPinned: boolean;
  togglePin: () => void;
}

interface NavbarProps {
  children?: ReactNode;
}

const NavbarContext = createContext<NavbarUtils | undefined>(undefined);

export const NavbarProvider: FC<NavbarProps> = ({ children }) => {
  const [refetchNavbar, setNavbarFunction] = useState(() => {});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const toggleSidebar = () => {
    if (!isPinned) {
      setIsSidebarOpen(prev => !prev);
    }
  };

  const togglePin = () => {
    setIsPinned(prev => !prev);
    setIsSidebarOpen(true);
  };

  return (
    <NavbarContext.Provider 
      value={{ 
        refetchNavbar, 
        setNavbarFunction, 
        isSidebarOpen, 
        toggleSidebar, 
        isPinned, 
        togglePin 
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}