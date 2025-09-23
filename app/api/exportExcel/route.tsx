
import { NextResponse } from "next/server";
//import mysql from "mysql2/promise";
import { getConnection } from "../../zaksite/utils/db"

  export async function GET(req: Request) {
  //let connection;
  let connection = await getConnection();

   const { searchParams } = new URL(req.url);
   const acode = searchParams.get("pcode");
     const pname = searchParams.get("pname");
     const sname = searchParams.get("sname");
     const frequency = searchParams.get("frequency");
     const usedTableName = frequency?.split("_")[0] || "";

        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const st = searchParams.get("st");
        const samytd = searchParams.get("samytd");
        const unit = searchParams.get("unit");
        const frequencyName = searchParams.get("frequencyName");

      const [monthFrom, yearFrom] = from?.split("s") || "";
     const [monthTo, yearTo] = to?.split("s") || "";

     let addperiod='';
		if (samytd ==="true") {
  addperiod = `and period=${monthTo}`;
}
          
  try {
   
   
    const tableName = `ec_fs_${st}_${usedTableName}`;
    //console.log("Table name:", tableName);

     let period=''
  switch (usedTableName)
{
case "qt":
  period = " concat(cast(t1.period as CHAR), 'QFY',cast(substr(t1.fyear,3,2) as CHAR)) as Period";
   break;
 case "hy":
  period = "concat(cast(t1.period as CHAR), 'HFY',cast(substr(t1.fyear,3,2) as CHAR)) as Period";
  break;
 case "nm":
  period = "concat(cast(t1.period as CHAR), 'MFY',cast(substr(t1.fyear,3,2) as CHAR)) as Period";
  break; 

 case "yr":
  period = "concat('FY',cast(substr(t1.fyear,3,2) as CHAR)) as Period";
   break;
   
  
}
      const query = `select  ${period}, t1.acode,
    t1.pamount as pamount1
		from
		(select acode,(pamount) as pamount,mmonth,myear,period,fyear
		from (select acode,pamount,mmonth,myear,period,fyear 
				from ${tableName} where acode=? and fyear >= ? and fyear <=? and printcol!='N'
                order by fyear,period)gentable2 where not (fyear=? and period <?) 
                and not (fyear =? and period > ?) ${addperiod}  ) t1
	
		order by t1.fyear asc,t1.period asc`;

         const values = [acode, yearFrom,yearTo,yearFrom,monthFrom,yearTo,monthTo];
    //const printQuery = mysql.format(query,values);
        //console.log("Executing SQL Query:\n", printQuery);

    const [rows] = await connection.execute(query,values); 
    
    
    //const valuedec = "N";
    
    


   const output =(pname) + " | " + sname + "\n" + 
    frequencyName + " | " + unit + "\n\n" + 
   "Period\tValue\n" +
   (rows as any[])
    .map((row) => `${row.Period}\t${row.pamount1}`)
    .join("\n");

    return new Response(output, {
      headers: {
        "Content-Type": "application/vnd.ms-excel",
        "Content-Disposition": `attachment; filename="report_${Date.now()}.xls"`,
      },
    });
  } catch (error) {
    
      return NextResponse.json(
        { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    } 
}
