"use client";
import React, { useState ,useEffect } from 'react'

import { Button  } from "@/components/ui/button";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import FieldSelect from './FieldSelect';

import { BarChart3 } from "lucide-react";
import { getUniqueHeaders, transformDataToRows } from '../utils/tableHelpers';
import ChartModal from "./ChartModal";

// interface
interface FormData {
  fielOption: string;
  selectedOption: string;
  fromValue: string;
  toValue: string;
  frequency: string;

}


export default function Layout() {

   // defualt value set
  const [formData, setformData]= useState<FormData>({

      fielOption:"FSA01" ,
      selectedOption: "qt_q",
      fromValue: "",
      toValue: "",
      frequency:"",
      

      });

     

      
    const[btnvalue,setbtnvalue] =useState<string | null>(null)
    const[typebtnvalue,set_typebtnvalue] =useState<string | null>(null)
    const[clbtnvalue,set_clbtnvalue] =useState<string | null>(null)
    const[tableData,setTableData]=useState<any[]>([])
    const[submittedValue , setsubmittedValue] = useState<FormData[]>([]);


        interface Optionfyear{
      mmonth:number;
      fyear:number;
      frequency: string;
      displayvalue:string;
      value:string;
      
  
    //onChange : (Value:string)=>void  
      
      }
      
      const [samePeriodChecked, setSamePeriodChecked] = useState(false);
     const [ytdChecked, setYtdChecked] = useState(false);
    //const [frequency, setFrequency] = useState(""); // Stores selected frequency
    const [years, setYears] = useState<Optionfyear[]>([]); 
    //const [selectedYear, setSelectedYear] = useState(""); 
    const [datebtnvalue, setDateBtnValue] = useState<string>(""); 
    //const [yearsFrom, setYearsFrom] = useState<any[]>([]);
     // const [yearsTo, setYearsTo] = useState<any[]>([]);
    //const [selectedRowdata , setSelectedRowData] = useState(null)
   // const [showChart, setShowChart] = useState(false);
    
  
  const [popupOpen, setPopupOpen] = useState(false);
  const [rowData, setRowData] = useState<any | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [frequencyName, setfrequencyName] = useState<string | null>(null);
   const [unit, setUnit] = useState<string>("PKR Million");

    
    /*const handlesubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      
      setsubmittedValue([...submittedValue, formData]);
      
     // if (submittedValue.length === 0) return;
     // const latestSubmission = submittedValue[submittedValue.length - 1];
      async function fetchData() {
        const res = await fetch(`api/tabledata?field=${formData.fielOption}&frequency=${formData.selectedOption}&from=${formData.fromValue}&to=${formData.toValue}&st=${typebtnvalue}`);
       
        const data = await res.json();
        setTableData(data); // You can use a new state to store actual table content
        
      }
    
    
      fetchData();


      
      /*setformData({
        inputValue: "",
        selectedOption: "",
        fromOption: "2024",
        toOption: "2025",
      });*/
   // };*/


   // call frequency change function
   const handleFrequencyChange = (value:string) => {
    setDateBtnValue("")
    //const value = e.target.value;  
  //const label = e.target.options[e.target.selectedIndex].text;
  setformData({ ...formData, selectedOption: value});
  
  setTableData([]);

};

  // submit button function

    const submitData = async (data: typeof formData,btnValue?: string) => {
      
  setsubmittedValue((prev) => [...prev, data]);
    //let typebtnvalue =  "st";
   const finalValue = btnValue ?? typebtnvalue ?? "st";

   const yearFrom = data.fromValue?.split("s") || "";
  const  yearTo = data.toValue?.split("s") || "";

  //const [yearFrom] = data.fromValue?.split("s") || "";
  //const [yearTo] = data.toValue?.split("s") || "";
  
  if(yearFrom > yearTo){
    alert('[To] date cannot be older than [From] date.')
    return
  }


  const res = await fetch(
    `api/tabledata?field=${data.fielOption}&frequency=${data.selectedOption}&from=${data.fromValue}&to=${data.toValue}&st=${finalValue}&samytd=${samePeriodChecked}&chkytd=${ytdChecked}`
  );

  const result = await res.json();
  setTableData(result);
   set_typebtnvalue(finalValue);
 

};

const handlesubmit = (e: React.FormEvent) => {
  e.preventDefault();
 // set_typebtnvalue("st");
 let hd_frequency = "";
  switch (formData.selectedOption) {
    case "yr_y":
      hd_frequency = "Yearly";
      break;
    case "hy_h":
      hd_frequency = "Half Yearly";
      break;
    case "qt_q":
      hd_frequency = "Quarterly";
      break;
    case "nm_n":
      hd_frequency = "Nine Month";
      break;
  }

  setfrequencyName(hd_frequency);

if (typebtnvalue === "st") {
    setUnit("PKR Million");
  } else if (typebtnvalue === "gd") {
    setUnit("% GDP");
  } else if (typebtnvalue === "pp") {
    switch (formData.selectedOption) {
      case "qt_q":
        setUnit("QoQ (%)");
        break;
      case "hy_h":
        setUnit("HoH (%)");
        break;
        case "nm_n":
        setUnit("");
        break;
        case "yr_y":
        setUnit("YoY (%)");
        break;
      
    }
  }
  
  
  submitData(formData); 
};


    useEffect(() => {
    
      const frequency = formData.selectedOption
      //let fromvalue = formData.fromvalue
      //console.log("from changed to:", formData.fromValue);
      async function fetchYears() {
        if (!frequency) return; 
  
        try {
          const res = await fetch(`/api/optionfyear?frequency=${frequency}`);
          const data = await res.json();
          setYears(data); // Update state with fetched data
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      fetchYears();

    },  [formData.selectedOption, submittedValue]);


const chartButtonClick = async (row: any) => {
/*  alert(row.description);
  alert(row.acode);
  alert(row.sname);*/

    setRowData(row);
    setPopupOpen(true);
    setLoading(true);

    try {
      const res = await fetch(
        `/api/popupchart?pname=${row.description}&pcode=${row.acode}&sname=${row.sname}&st=${typebtnvalue}&frequency=${formData.selectedOption}&from=${formData.fromValue}&to=${formData.toValue}&samytd=${samePeriodChecked}&chkytd=${ytdChecked}`
      );
      const data = await res.json();
      setChartData(data);
    } catch (err) {
      console.error("Chart API error:", err);
    } finally {
      setLoading(false);
    }
  };

   

  // datebutton click work function
  const handleButtonClick = (yearback: number) => {
 
  if (years.length === 0) return;

  setDateBtnValue(`${yearback}Y`);

  
   const latestIndex = years.length - 1;

   const latest = years[latestIndex];

    let stepPerYear = 1; 
    let hd_frequency=''
    switch (formData.selectedOption) {
    case "yr_y":
      stepPerYear = (yearback - 1) * 1;
      hd_frequency ="Yearly";
      break;
     case "hy_h":
      stepPerYear = (yearback * 2) - 1;
      hd_frequency ="Half Yearly";
      break;
     case "qt_q":
      stepPerYear = (yearback * 4) - 1;
      hd_frequency ="Quarterly";
      break;
     default:
      stepPerYear = (yearback - 1); 
      hd_frequency ="Nine Month";
  }

    setfrequencyName(hd_frequency);
  const fromIndex = Math.max(latestIndex - stepPerYear, 0);
  const fromPeriod  = years[fromIndex];
  
// let newFrom = `${fromPeriod.mmonth}s${fromPeriod.fyear}`;
  
let newFrom = `${fromPeriod.mmonth}s${fromPeriod.fyear}`;
let newTo = `${latest.mmonth}s${latest.fyear}`;

    
  if (samePeriodChecked) {
  /*const currentTo = years[latestIndex]; 
  const samePeriod = currentTo.mmonth;  
  const targetYear = currentTo.fyear - (yearback - 1); 

  newFrom = `${samePeriod}s${targetYear}`;*/

  const [period, year] = formData.toValue.split("s"); // e.g. "1s2024" → ["1", "2024"]
  const targetYear = parseInt(year) - (yearback - 1);
  newFrom = `${period}s${targetYear}`;
  newTo = formData.toValue; 
}

  const newFormData = {
    ...formData,
    fromValue: newFrom,
    toValue: newTo,
  };

  /*const newFormData = {
    ...formData,
    fromValue: `${fromPeriod.mmonth}s${fromPeriod.fyear}`,
    toValue: `${latest.mmonth}s${latest.fyear}`,
  };*/

  setformData(newFormData);
  submitData(newFormData);
 

};

// old code string show in url 
  /*const downloadExcel = () => {

      window.open(
        `api/exportTableExcel?field=${formData.fielOption}&frequency=${formData.selectedOption}&from=${formData.fromValue}&to=${formData.toValue}&st=${typebtnvalue}&samytd=${samePeriodChecked}&chkytd=${ytdChecked}&hdname=${frequencyName}&unit=${unit}`
      );
    };*/


const downloadExcel = async () => {
  const res = await fetch(
    `/api/exportTableExcel?field=${formData.fielOption}&frequency=${formData.selectedOption}&from=${formData.fromValue}&to=${formData.toValue}&st=${typebtnvalue}&samytd=${samePeriodChecked}&chkytd=${ytdChecked}&hdname=${frequencyName}&unit=${unit}`
  );

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "Fiscal.xls"; 
  a.click();

  window.URL.revokeObjectURL(url);
};
       let spname=""
    if (samePeriodChecked){
         spname= " (Same Period) "
       }

  return (

    
    <div className='w-[99%]  text-gray-500 ml-3  items-center justify-between shadow-md'>
      <div className="w-full bg-[#eef1f5] p-4">
  <form onSubmit={handlesubmit}
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4"
  >
    {/* Field Option */}
    <div className="col-span-1 lg:col-span-4">
      <FieldSelect
        value={formData.fielOption} onChange={(value) => {
          setformData({ ...formData, fielOption: value });
          setTableData([]);
        }}
      />
    </div>

    {/* Stock Button */}
    <div className="col-span-1 lg:col-span-1">
      <button
        type="button"
        className={`w-full px-3 py-1 rounded text-gray-500 hover:bg-orange-400 hover:text-white transition
          ${btnvalue === "st" ? "bg-orange-500 text-white" : "bg-gray-300 hover:bg-gray-400"}`}
        onClick={() => setbtnvalue("st")}
      >
        Stock
      </button>
    </div>

    {/* Flow Button */}
    <div className="col-span-1 lg:col-span-1">
      <button
        type="button"
        className={`w-full px-3 py-1 rounded text-gray-500 hover:bg-orange-400 hover:text-white transition
          ${btnvalue === "fl" ? "bg-orange-500 text-white" : "bg-gray-300 hover:bg-gray-400"}`}
        onClick={() => setbtnvalue("fl")}
      >
        Flow
      </button>
    </div>

    {/* Frequency Select */}
    <div className="col-span-1 lg:col-span-2">
      <Select
        onValueChange={handleFrequencyChange}
        value={formData.selectedOption}
        disabled={samePeriodChecked || ytdChecked}
      >
        <SelectTrigger >
          <SelectValue placeholder="Select Frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="qt_q">Quarterly</SelectItem>
          <SelectItem value="hy_h">Half Yearly</SelectItem>
          <SelectItem value="nm_n">Nine Month</SelectItem>
          <SelectItem value="yr_y">Yearly</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* From Select */}
    <div className="col-span-1 lg:col-span-1">
      <Select
        onValueChange={(value) => {
          setformData((prev) => ({ ...prev, fromValue: value }));
          setTableData([]);
          setDateBtnValue("");
        }}
        value={formData.fromValue}
        disabled={samePeriodChecked || ytdChecked}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select From" />
        </SelectTrigger>
        <SelectContent>
          {years.length > 0 ? (
            years.map((yearval) => (
              <SelectItem
                key={`${yearval.mmonth}-${yearval.fyear}`}
                value={`${yearval.mmonth}s${yearval.fyear}`}
              >
                {yearval.displayvalue}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>

    {/* To Select */}
    <div className="col-span-1 lg:col-span-1">
      <Select
        onValueChange={(value) => {
          setformData((prev) => ({ ...prev, toValue: value }));
          setTableData([]);
          setDateBtnValue("");
        }}
        value={formData.toValue} 
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select To" />
        </SelectTrigger>
        <SelectContent>
          {years.length > 0 ? (
            years.map((yearval) => (
              <SelectItem
                key={`${yearval.mmonth}-${yearval.fyear}`}
                value={`${yearval.mmonth}s${yearval.fyear}`}
              >
                {yearval.displayvalue}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>

    {/* Submit Button */}
    <div className="col-span-1 lg:col-span-1">
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </div>

    {/* Base Year */}
    <div className="col-span-1 lg:col-span-4 flex items-center gap-2">
      <div className="col-span-1 lg:col-span-1">
          <select
        name="baseyear"
        id="baseyear"
        className="w-full border rounded px-2 py-1"
      >
        <option value="Select Table">Base Year</option>
      </select>
      </div>
      <div className="flex border-b  bg-[#eef1f5] w-fit rounded-sm overflow-hidden h-[26px] border-l">
        
          <button type="button" className={`flex items-center px-2 py-1  shadow-md border-t-[3px]  w-[46px] text-[12px]  font-[Roboto] border-[1px] border-solid border-[#dbdbdb] border-r-0 
      hover:border-t-[#f9732a] hover:text-[#f9732a] transition-all duration-300 ease-in-out 
              ${typebtnvalue === "st" ? "border-t-[#f9732a] text-[#f9732a]" : "bg-[#eef1f5]"}`} 
              onClick={() => {set_typebtnvalue("st");setUnit("PKR Million");setTableData([]);}}>Value</button>

              <button type="button" className={`flex items-center px-2 py-1  shadow-md border-t-[3px]  w-[46px] text-[12px]  font-[Roboto] border-[1px] border-solid border-[#dbdbdb] border-r-0 
      hover:border-t-[#f9732a] hover:text-[#f9732a] transition-all duration-300 ease-in-out 
              ${typebtnvalue === "gd" ? "border-t-[#f9732a] text-[#f9732a]" : "bg-[#eef1f5]"}`} 
              onClick={() => {set_typebtnvalue("gd");setUnit("GDP(%)");setTableData([]);}}>%GDP</button>

              <button type="button" className={`flex items-center px-2 py-1  shadow-md border-t-[3px]  w-[46px] text-[12px]  font-[Roboto] border-[1px] border-solid border-[#dbdbdb] border-r-0 
      hover:border-t-[#f9732a] hover:text-[#f9732a] transition-all duration-300 ease-in-out 
              ${typebtnvalue === "yy" ? "border-t-[#f9732a] text-[#f9732a]" : "bg-[#eef1f5]"}`} 
              onClick={() => {set_typebtnvalue("yy");setUnit("YoY(%)");setTableData([]);}}>%Y/Y</button>
              <button type="button" className={`flex items-center px-2 py-1  shadow-md border-t-[3px]  w-[46px] text-[12px]  font-[Roboto] border-[1px] border-solid border-[#dbdbdb] border-r-0 
      hover:border-t-[#f9732a] hover:text-[#f9732a] transition-all duration-300 ease-in-out 
              ${typebtnvalue === "pp" ? "border-t-[#f9732a] text-[#f9732a]" : "bg-[#eef1f5]"}`} 
              onClick={() => {set_typebtnvalue("pp");setTableData([]); 
                    switch (formData.selectedOption) {
                  case "qt_q":
                    setUnit("QoQ (%)");
                    break;
                  case "hy_h":
                    setUnit("HoH (%)"); 
                    break;
                    case "nm_n":
                      setUnit("");
                      break;
                  case "yr_y":
                    setUnit("YoY (%)"); 
                    break;

                 
                }
                      }}>%P/P</button>
                       <button type="button" className={`flex items-center px-2 py-1  shadow-md border-t-[3px]  w-[46px] text-[12px]  font-[Roboto] border-[1px] border-solid border-[#dbdbdb]
      hover:border-t-[#f9732a] hover:text-[#f9732a] transition-all duration-300 ease-in-out 
              ${typebtnvalue === "fy" ? "border-t-[#f9732a] text-[#f9732a]" : "bg-[#eef1f5]"}`} 
              onClick={() => set_typebtnvalue("fy")}>%F/Y</button>
      </div>
      
    </div>
    

     <div className="col-span-1 lg:col-span-1">

    <button type="button" className={`w-full px-3 py-1 bg-gray-100 rounded 
            text-gray-500 hover:bg-orange-400 hover:text-white transition-all duration-300 ease-in-out 
            ${clbtnvalue === "cl" ? "bg-orange-500 text-white" : "bg-gray-300 hover:bg-gray-400"}`} 
            onClick={() => set_clbtnvalue("cl")}>Closing</button>

    </div>

       <div className="col-span-1 lg:col-span-1">

    <button className={`w-full px-3 py-1 bg-gray-300 rounded 
            
            text-gray-500 hover:bg-orange-400 hover:text-white transition-all duration-300 ease-in-out 
            ${clbtnvalue === "ag" ? "bg-orange-500 text-white" : "bg-gray-300 hover:bg-gray-400"}`} 
            onClick={() => set_clbtnvalue("ag") }>Average</button>

    </div>

    {/* SP / YTD Checkboxes */}
    <div className="col-span-1 lg:col-span-2 flex gap-4 bg-white px-3 py-2 rounded text-sm w-[110px] ml-[31px] border-[1px] border-solid border-[#dbdbdb] ">
      <label className="flex items-center gap-1 text-[12px]">
        <input
          type="checkbox"
          checked={samePeriodChecked}
          onChange={(e) => {
            const checked = e.target.checked;
            if (checked && ["yr_y", "nm_n"].includes(formData.selectedOption)) {
              alert("This option is not available for this frequency");
              return;
            }
            setTableData([]);
            if (checked) setYtdChecked(false);
            setSamePeriodChecked(checked);
          }}
        />
        SP
      </label>
      <label className="flex items-center gap-1 text-[12px]">
        <input
          type="checkbox"
          checked={ytdChecked}
          onChange={(e) => {
            const checked = e.target.checked;
            if (checked && formData.selectedOption !== "qt_q") {
              alert("This option is not available for this frequency");
              return;
            }
            if (checked) setSamePeriodChecked(false);
            setYtdChecked(checked);
          }}
        />
        YTD
      </label>
    </div>

    {/* Date Range Buttons */}
    <div className="flex border-b  bg-[#eef1f5] w-fit rounded-sm overflow-hidden h-[26px] border-l ">
      <button className={`flex items-center px-2 py-1  shadow-md border-t-[3px]  w-[39px] text-[12px]  font-[Roboto] border-[1px] border-solid border-[#dbdbdb] border-r-0 
      hover:border-t-[#f9732a] hover:text-[#f9732a] transition-all duration-300 ease-in-out 
              ${datebtnvalue === "1Y" ? "border-t-[#f9732a] text-[#f9732a]" : "bg-[#eef1f5]"}`} 
              onClick={() => handleButtonClick(1)}>1Y</button>
              <button className={`flex items-center px-2 py-1  shadow-md border-t-[3px] border-[1px]  border-solid border-[#dbdbdb]  w-[39px] text-[12px]  font-[Roboto] border-r-0
              text-gray-500 hover:border-t-[#f9732a] hover:text-[#f9732a] transition-all duration-300 ease-in-out 
              ${datebtnvalue === "3Y" ? "border-t-[#f9732a] text-[#f9732a]"  : "bg-[#eef1f5] "}`} 
              onClick={() => handleButtonClick(3)}>3Y</button>
              <button className={`flex items-center px-2 py-1 shadow-md border-t-[3px] border-[1px] border-solid border-[#dbdbdb]  w-[39px] text-[12px]  font-[Roboto] border-r-0
              
              text-gray-500 hover:border-t-[#f9732a] hover:text-[#f9732a] transition-all duration-300 ease-in-out 
              ${datebtnvalue === "5Y" ? "border-t-[#f9732a] text-[#f9732a]"  : "bg-[#eef1f5]"}`} 
              onClick={() => handleButtonClick(5)}>5Y</button>
              <button className={`flex items-center px-2 py-1  shadow-md border-t-[3px] border-[1px] border-solid border-[#dbdbdb]  w-[39px] text-[12px]  font-[Roboto] border-r-0
              
              text-gray-500 hover:border-t-[#f9732a] hover:text-[#f9732a] transition-all duration-300 ease-in-out 
              ${datebtnvalue === "10Y" ? "border-t-[#f9732a] text-[#f9732a]"  : "bg-[#eef1f5] "}`} 
              onClick={() => handleButtonClick(10)}>10Y</button>
              <button className={`flex items-center px-2 py-1  shadow-md border-t-[3px] border-[1px] border-solid border-[#dbdbdb]  w-[39px] text-[12px]  font-[Roboto]
              
              text-gray-500 hover:border-t-[#f9732a] hover:text-[#f9732a] transition-all duration-300 ease-in-out 
              ${datebtnvalue === "20Y" ? "border-t-[#f9732a] text-[#f9732a]"  : "bg-[#eef1f5]"}`} 
              onClick={() => handleButtonClick(20)}>20Y</button>
    </div>
  </form>
</div>


       
      <div className="p-4 max-w-[1230px] w-full">
         {tableData.length > 0 && (
         <div className="flex-1 justify-between items-center gap-2 mb-2 flex ">
          <img src="/images/Excel.png" alt="Download Excel"
          className="w-5 h-5 cursor-pointer hover:opacity-80" onClick={() => downloadExcel()}/>
          <div className='items-center'>{unit}
            </div>
         </div>
        
         
         )}

         {tableData.length > 0 && (

            <div className="overflow-hidden">
              <div className="overflow-auto" style={{ maxHeight: 'calc(95vh - 200px)' }}>
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                  <thead className="bg-gray-100 sticky top-0 z-20 text-[#0a60a3] ">
                    <tr>
                      <th className="border px-4 py-2 text-left bg-gray-100 sticky left-0  z-20 min-w-[370px] font-medium">Description</th>
                      {getUniqueHeaders(tableData,formData.selectedOption).map((header) => (
                        <th key={header} className="border px-4 py-2 text-right  top-0 bg-gray-100 min-w-[120px] font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transformDataToRows(tableData).map((row,index) => (
                      <tr key={row.acode || row.description} className="hover:bg-gray-50">
                        <td className="border px-4 py-2 text-left sticky left-0  z-10 bg-white min-w-[200px]">
                        <button    onClick={() => chartButtonClick(row)}>
                        <BarChart3 className="w-4 h-4 text-orange-500 hover:text-blue-500 mr-1" />
                        </button>
                          
                          {row.description}
                        </td>
                        {getUniqueHeaders(tableData).map((header) => (
                          <td   key={`${index}-${header}`}
                            className="border px-4 py-2 text-right min-w-[120px]">
                            {row[header] ?? '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          
        )}
      </div>
      {rowData && (
        <ChartModal
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          title={rowData.description}
          acode={rowData.acode}
          sname={rowData.sname}
          typebtnvalue={typebtnvalue}
          data={chartData}
          loading={loading}
          frequencyName={frequencyName}
          unit={unit}
          frequency={formData.selectedOption}
          from={formData.fromValue}
          to={formData.toValue}
          samytd={samePeriodChecked}
          spname = {spname}
          
          
          
          
        />
      )}
    
  </div>
  

  

  
)}
  

    
    
