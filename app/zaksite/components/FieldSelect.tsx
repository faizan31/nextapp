"use client";
import React, { useState ,useEffect } from 'react'


import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

  interface Option {
    tcode: string;
    tdrplabel: string;
  }

  interface FieldOptionSelectProps {
    value: string;
    onChange: (value: string) => void;
  }

 

  export default function FieldSelect({value,onChange}: FieldOptionSelectProps){
     const[options, setOptions] = useState<Option[]>([])
        useEffect(() => {
        async function fetchOptions() {
          try {
           
            const res  = await fetch("/api/options");
             
            const data =  await res.json();
            //console.log(data)
            setOptions(data);
          } catch (error) {
            console.error("Error fetching options:", error);
          }
        }
        fetchOptions();
      }, []);

return(
<Select
onValueChange={onChange} value={value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Field" />
      </SelectTrigger>
      <SelectContent className="w-full text-xs">
      {options.length > 0 ? (
      options.map((option,index) => (

        <SelectItem  key={index}  value={option.tcode}>{option.tdrplabel} </SelectItem>
          ))
        ) : (
          <SelectItem value="loading" disabled>
            Loading...
          </SelectItem>
        )}
      </SelectContent>
    </Select>




);

  }
