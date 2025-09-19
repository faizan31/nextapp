"use client"
import React, { useState ,useEffect } from 'react'
import Link from 'next/link'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel } from "@/components/ui/select";


interface Optionfyear{
mmonth:number;
fyear:number;
frequency: string;
displayvalue:string;

}

interface FieldOptionyearfrom {
    value:string,
    frequency:string;
    onChange : (Value:string)=>void   
}
export default function yearFromTo({value,onChange}: FieldOptionyearfrom){

    const [years, setOptionFyear] = useState<Optionfyear[]>([]);
    useEffect(()=>{
     async function fetchYearFrom() {
     // const[setoption, setOptionFyear] = useState<Option[]>([])
      try{
       const result =  await fetch("/api/optionfyear")
        const data = await result.json()
        setOptionFyear(data)
        

      }catch{}
      
     }
     fetchYearFrom();
    },[]);

    

        return(

           <Select onValueChange={onChange} value={value}>
           <SelectTrigger className="w-[10%]">
             <SelectValue placeholder="Select From" />
           </SelectTrigger>
           <SelectContent>
           {years.length > 0 ? (
               years.map((yearval,index) => (
                
                 <SelectItem  key={`${yearval.mmonth}-${yearval.fyear}`} value={`${yearval.mmonth}s${yearval.fyear}`}>
                 {yearval.displayvalue}
               </SelectItem>
               ))
             ) : (
               <SelectItem value="loading" disabled>Loading...</SelectItem>
             )}
           </SelectContent>
         </Select>

           


                
        );
}

   
    