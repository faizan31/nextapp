
import Header from "./components/header";


export default function ZaksiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
     
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
      
      <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
