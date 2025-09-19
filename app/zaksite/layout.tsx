
import Header from "./components/header";
import Sidebar from "./components/sidebar";

export default function ZaksiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
      
      <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
