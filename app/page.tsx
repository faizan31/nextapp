//import Image from "next/image";

import { SidebarProvider } from "./zaksite/components/SidebarContext";
import Sidebar from "./zaksite/components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </SidebarProvider>
    
  );
}