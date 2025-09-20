"use client";

import Link from "next/link";
import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Menu, Grid, Briefcase, LineChart, BarChart, Banknote, PieChart, HelpCircle, Lock, 
  FileText } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <aside className={`h-screen bg-gray-800 text-white transition-all ${isOpen ? "w-64" : "w-20"} duration-300`}>
    
      <div className="flex justify-between items-center p-4 bg-orange-700">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          <Menu />
        </button>
      </div>

    
      <nav className="p-4">
        
        <Link href="/zaksite" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded-md transition">
          <Grid />
          {isOpen && <span>Dashboard</span>}
        </Link>

        
        <Accordion type="single" collapsible className="mt-1">
          <AccordionItem value="companies">
            <AccordionTrigger className="flex items-left text-white">
            <Briefcase />{isOpen && <span className="ml-[-80px]">Companies</span>}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-8">
                <li><Link href="#" className="block py-1 text-gray-300 hover:text-white">Overview</Link></li>
                <li><Link href="#" className="block py-1 text-gray-300 hover:text-white">Charts</Link></li>
                <li><Link href="#" className="block py-1 text-gray-300 hover:text-white">Payout</Link></li>
                <li><Link href="#" className="block py-1 text-gray-300 hover:text-white">Notices</Link></li>
                <li><Link href="#" className="block py-1 text-gray-300 hover:text-white">Trade Data</Link></li>
                <li><Link href="#" className="block py-1 text-gray-300 hover:text-white">Capital</Link></li>
                <li><Link href="#" className="block py-1 text-gray-300 hover:text-white">Financials</Link></li>
                <li><Link href="#" className="block py-1 text-gray-300 hover:text-white">Organization</Link></li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        
        <Accordion type="single" collapsible className="mt-2">
          <AccordionItem value="stock-market">
            <AccordionTrigger className="flex items-left text-white">
              <LineChart />
              {isOpen && <span className="ml-[-60px]">Stock Market</span>}
            </AccordionTrigger>
            <AccordionContent>
            <ul className="ml-[38px]">
              <li><Link href="#" className="block py-1  text-gray-100 hover:text-white">Overview</Link></li>

              <li className="relative group">
                  <button className="block w-full py-1 text-left text-gray-100 hover:text-white">
                    Indices
                  </button>

                  {/* Hover Menu */}
                  <ul className="absolute left-full top-0 ml-2 hidden w-40 bg-gray-800 rounded-lg shadow-lg group-hover:block">
                    <li>
                      <button
                        className="block w-full py-1 px-3 text-gray-100 hover:bg-gray-700"
                        onClick={() => setSelectedItem("charts")}
                      >
                        Charts
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full py-1 px-3 text-gray-100 hover:bg-gray-700"
                        onClick={() => setSelectedItem("tables")}
                      >
                        Tables
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full py-1 px-3 text-gray-100 hover:bg-gray-700"
                        onClick={() => setSelectedItem("points")}
                      >
                        Points
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full py-1 px-3 text-gray-100 hover:bg-gray-700"
                        onClick={() => setSelectedItem("weights")}
                      >
                        Weights
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full py-1 px-3 text-gray-100 hover:bg-gray-700"
                        onClick={() => setSelectedItem("composition")}
                      >
                        Composition
                      </button>
                    </li>
                  </ul>
                </li>
                
                <div className="flex-1 p-6">
        {selectedItem === "charts" && <div className="text-white">📊 Charts Component</div>}
        {selectedItem === "tables" && <div className="text-white">📋 Tables Component</div>}
        {selectedItem === "points" && <div className="text-white">📌 Points Component</div>}
        {selectedItem === "weights" && <div className="text-white">⚖️ Weights Component</div>}
        {selectedItem === "composition" && <div className="text-white">🧩 Composition Component</div>}
      </div>
              

              <li><Link href="#" className="block py-1 text-gray-100 hover:text-white">Zak Indices</Link></li>
              <li><Link href="" className="block py-1 text-gray-100 hover:text-white"> FIPI/LIPP</Link></li>
            </ul>

            </AccordionContent>
          </AccordionItem>

          </Accordion>
          
          <Accordion type="single" collapsible className="mt-2">
          <AccordionItem value="economy">
            <AccordionTrigger className="flex items-left text-white">
              <BarChart />
              {isOpen && <span className="ml-[-95px]">Economy</span>}
            </AccordionTrigger>
          </AccordionItem>

          <AccordionItem value="sector-data">
            <AccordionTrigger className="flex items-left text-white">
              <PieChart />
              {isOpen && <span className="ml-[-75px]">Sector Data</span>}
            </AccordionTrigger>
          </AccordionItem>

          <AccordionItem value="commodities">
            <AccordionTrigger className="flex items-left text-white">
              <Banknote />
              {isOpen && <span className="ml-[-60px]">Commodities</span>}
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>

     
        <Link href="#" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded-md transition">
          <HelpCircle />
          {isOpen && <span>Support</span>}
        </Link>
        <Link href="#" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded-md transition">
          <Lock />
          {isOpen && <span>Privacy</span>}
        </Link>
        <Link href="#" className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded-md transition">
          <FileText />
          {isOpen && <span>Terms of Use</span>}
        </Link>
      </nav>
    </aside>
  );
}
