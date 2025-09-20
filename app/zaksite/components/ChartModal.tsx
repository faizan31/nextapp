"use client";

import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { useMemo } from "react";



type ChartModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  acode: string;
  sname: string | null;
  typebtnvalue: string | null;
  data: any[]; 
  loading: boolean;
  frequencyName:string | null;
  unit:string;
  frequency: string;
  from:string;
  to:string;
  samytd:boolean;
  spname:string;
};

export default function ChartModal({
  open,
  onClose,
  title,
  acode,
  sname,
  data,
  typebtnvalue,
  loading,
  frequencyName,
  unit,
  frequency,
  from,
  to,
  samytd,
  spname,

 }: ChartModalProps) {
  useEffect(() => {
    if (open && data.length > 0) {
       am4core.disposeAllCharts();
        am4core.addLicense("CH28809345");
      let chart = am4core.create("chartdiv_pop_new", am4charts.XYChart);
      chart.data = data;
       chart.fontSize=11;
       //chart.fontFamily="'Tahoma'"
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "date";
     // categoryAxis.title.text = "Date";
     categoryAxis.renderer.minGridDistance = 50;
     categoryAxis.renderer.grid.template.disabled = true;

     categoryAxis.renderer.grid.template.location = 0.5;
        categoryAxis.startLocation = 0.5;
        categoryAxis.endLocation = 0.5;
      	

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.fill = am4core.color("#3a3c3e");


      valueAxis.renderer.ticks.template.disabled = true;

      valueAxis.renderer.ticks.template.strokeOpacity = 1;

      



//valueAxis.tooltip.disabled = true;

//valueAxis.renderer.line.enabled = true;


valueAxis.cursorTooltipEnabled= false;
     let series;

     if (typebtnvalue == "st") {
      // Show bar chart
      series = chart.series.push(new am4charts.ColumnSeries());
      series.columns.template.width = am4core.percent(50);
    } else {
      // Show line chart
      series = chart.series.push(new am4charts.LineSeries());
      
    }

    series.dataFields.valueY = "value1";
    series.dataFields.categoryX = "date";
    series.tooltipText = "[bold]{value1}[/]";

    if (series instanceof am4charts.LineSeries) {
      series.strokeWidth = 1.5;
      var gradient = new am4core.LinearGradient();
        gradient.addColor(am4core.color("#5a9bd5"));
        gradient.addColor(am4core.color("white"));

        //gradient.rotation = 360
        series.fill=gradient;
        series.fillOpacity = .5;

        

    }
 
     // let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "value1";
      series.dataFields.categoryX = "date";
      series.strokeWidth = 1.5;
      series.tooltipText = "[bold]{value1}[/]";
      	series.stroke = am4core.color("#5a9bd5");
	     series.fill = am4core.color("#5a9bd5");

      chart.cursor = new am4charts.XYCursor();
      //chart.legend = new am4charts.Legend();
      chart.cursor.lineY.disabled = true;
      chart.cursor.lineX.disabled = true;

      

      // Add watermark
      var watermark = new am4core.Label();
      watermark.text = "Zakheera.com";
      watermark.align = "center"; // Center horizontally
      watermark.valign = "middle"; // Center vertically
      watermark.fontSize = 45;
      watermark.opacity = 0.05
      watermark.rotation = -45; // Apply rotation
      chart.plotContainer.children.push(watermark);

      var lastDate = categoryAxis.axisRanges.create();
    lastDate.category = chart.data[chart.data.length - 1]["date"];
     lastDate.label.align = "right";

    lastDate.label.dataItem.maxPosition = 1;
    categoryAxis.renderer.maxLabelPosition = 0.99;
     //lastDate.label.horizontalCenter = "center";
     
  


      return () => chart.dispose();
    }
  }, [open, data]);

   
      const stats = useMemo(() => {
        if (!data || data.length === 0) return null;

        const beg = data[0];
        const end = data[data.length - 1];

        let hi = data[0];
        let lo = data[0];
        let sum = 0;

        data.forEach((d) => {
          if (d.value1 > hi.value1) hi = d;
          if (d.value1 < lo.value1) lo = d;
          sum += d.value1;
        });

        const avg = sum / data.length;

        // Change % (End vs Beg)
        const changePct = ((end.value1 - beg.value1) / beg.value1) * 100;

        // CAGR = (End / Beg)^(1/n) - 1
        const years = data.length / 4; // 4 quarters = 1 year
        const cagr = Math.pow(end.value1 / beg.value1, 1 / years) - 1;

        return {
          beg,
          end,
          hi,
          lo,
          avg,
          changePct,
          cagr
        };
      }, [data]);

  if (!open) return null;
   const downloadExcel = () => {

    window.open(
      
     // `/api/exportExcel?acode=${acode}&sname=${sname}&st=${typebtnvalue}`,
      `/api/exportExcel?pname=${title}&pcode=${acode}&sname=${sname}&st=${typebtnvalue}&frequency=${frequency}&from=${from}&to=${to}&sname=${sname}&unit=${unit}&frequencyName=${frequencyName}&samytd=${samytd}`,
      
    );
  };

 

  return (
    
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[860px] shadow-lg relative">
          {/* Logo at top */}
          <div className="flex bg-[#f1f3f7] w-[860px] h-[36px] mt-[-24px] ">
           <img src="/images/logo.png" alt="Logo" className=" h-[20px] w-[93px] mt-[8px] ml-[12px]" />
          {/* Close button */}
            <button onClick={onClose} className="ml-auto text-red-600 transition-colors mr-3 text-[8px]" title="Close">  
              ✖
            </button>
        </div>
  

        {/* Header row with Title + Icons */}
    <div className="flex justify-between">
      
      <h2 className="text-[20px] text-[#0e60a4] font-['Roboto'] ml-[15px]">{title}</h2>
      {/*<span className="mr-[372px] text-[11px] text-[#e24000]"><sub >{sname}</sub></span>*/}

      <div className="flex items-center gap-2 mr-[10px]">
        {/* Excel icon (hover + click) */}
        <img src="/images/Excel.png" alt="Download Excel"
          className="w-5 h-5 cursor-pointer hover:opacity-80" onClick={() => downloadExcel()}/>

       
      </div>
    </div>
       {/* Subtitle */}
       
       
    <p className="text-[14px] text-[#e24000] font-['Roboto'] mb-3 ml-[15px]">
      {frequencyName} <span className="text-[#f9732b] text-[12px]">{spname}</span> | {unit}
    </p>
       {stats && (
        
          <div className="flex justify-between border-t border-gray-200 py-1 mb-3 text-[13px] font-['Roboto'] text-[#0e60a4] ml-[16px] pt-[5px]">
            <div className="flex flex-col items-end pr-[10px] mt-[5px]  flex-1 border-r border-gray-200" >
              <span className=""> Beg: {stats.beg.value1.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              <span className="text-[#e24000] text-[12px]">
                {stats.beg.date}
              </span>
            </div>
            <div className="flex flex-col items-end pr-[10px] mt-[5px] flex-1 border-r border-gray-200">
              <span>End: {stats.end.value1.toLocaleString("en-US", {minimumFractionDigits:2})}</span>
              <span className="text-[#e24000] text-[12px]">
                {stats.end.date}
              </span>
            </div>
            <div className="flex flex-col items-end pr-[10px] mt-[5px] flex-1 border-r border-gray-200">
              <span>Hi: {stats.hi.value1.toLocaleString("en-US", {minimumFractionDigits:2})}</span>
              <span className="text-[#e24000] text-[12px]">
                {stats.hi.date}
              </span>
            </div>
            <div className="flex flex-col items-end pr-[10px] mt-[5px] flex-1 border-r border-gray-200">
              <span>Lo: {stats.lo.value1.toLocaleString("en-US", {minimumFractionDigits:2})}</span>
              <span className="text-[#e24000] text-[12px]">
                {stats.lo.date}
              </span>
            </div>
            <div className="flex flex-col items-end pr-[10px] mt-[5px] flex-1 border-r border-gray-200">
              <span>Avg: {stats.avg.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-[#e24000] text-[12px]">---</span>
            </div>
            <div className="flex flex-col items-end pr-[10px] mt-[5px] flex-1 border-r border-gray-200">
              <span>Chg:  {stats.changePct.toFixed(2)}% </span>
               <span className="text-[#e24000] text-[12px]">
                 CAGR: {(stats.cagr * 100).toFixed(2)}%
              </span>
               
              
            </div>
            
          </div>
          
        )}

    {/* Content */}
    {loading ? (
      <p className="text-center">Loading chart...</p>
    ) : (
      <div id="chartdiv_pop_new" className="h-96 w-full" />
    )}
      </div>
    </div>
    
  );
}
