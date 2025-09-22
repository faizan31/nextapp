import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

import { getUniqueHeaders, transformDataToRows } from "../../zaksite/utils/tableHelpers";


export async function GET(req: Request) {
//  console.log("API route hit!");  
 
  let connection;

  try {
    
    //const url = new URL(req.url, `http://${req.headers.get('host') || 'localhost'}`);
    const { searchParams } = new URL(req.url);
    const field = searchParams.get("field");
    const frequency = searchParams.get("frequency");
    console.log(frequency)
    const usedTableName = frequency?.split("_")[0] || "";
    

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const st = searchParams.get("st");
     const samytd = searchParams.get("samytd");
     const unit = searchParams.get("unit");
     const frequencyName = searchParams.get("hdname");
 
    const [monthFrom, yearFrom] = from?.split("s") || "";
     const [monthTo, yearTo] = to?.split("s") || "";

    // console.log({ monthFrom, yearFrom, monthTo, yearTo });
    //console.log("samytd value is:", samytd, typeof samytd);
       let addperiod='';
                if (samytd ==="true") {
     addperiod = `and period=${monthTo}`;
       }
          

    connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: Number(process.env.DATABASE_PORT),
    });

    
    
    const tableName = `ec_fs_${st}_${usedTableName}`;

            //console.log("Table name:", tableName);

    const query = 
    `select acode,aname,tlevel,pamount,myear,mmonth,tcode,period,fyear,printcol, newchrtlegend,subscrpt
     from (select m.acode,a.aname,a.tlevel,(pamount) as pamount,m.myear,m.mmonth,a.tcode,m.period,
     m.fyear,m.printcol,
      a.newchrtlegend,a.subscrpt from ${tableName} m, ec_acct a where m.acode=a.acode and a.tcode = ?
       and fyear >= ?  and fyear <= ? and printcol != 'N'
  order by acode,fyear,period )  gentable1 where not (fyear = ? and period < ?)
 and not (fyear >= ? and period > ?) ${addperiod}   order by acode,myear asc,mmonth asc`;



    const values = [field, yearFrom, yearTo, yearFrom,monthFrom,yearTo,monthTo];
   
    //const printQuery = mysql.format(query, values);
    // console.log("Executing SQL Query:\n", printQuery);
      

       const [rows]:any = await connection.execute(query,values);
        //const [rows] = await connection.query<Record<string, unknown>[]>(query);


    const [nt]:any = await connection.execute(
      "SELECT tdrplabel FROM ec_thead WHERE mcode = 'FSA' AND tcode = ?",
      [field]  
    );

   
    const finalHeading = (nt as any)[0].tdrplabel;
    const headers = getUniqueHeaders(rows as any[],frequency);

    const transformedRows = transformDataToRows(rows as any[]);
    //console.log(transformedRows)
    const fixedHeaders = headers.map((h: string) => {
      const q = h[0];
     const yearPart = h.slice(-2); 
      const yearNum = parseInt(yearPart, 10);

       // decide century dynamically
       const fullYcear = yearNum < 50 ? 2000 + yearNum : 1900 + yearNum;
       // console.log(yearPart + 'yearpart')
       let newKey = ""; 
       if(frequency !='yr_y'){
       newKey = `${q}-${fullYcear}`; 
       }else{
        newKey = `1-${fullYcear}`; 

       }
      //console.log("Header:", h, "=>", newKey);
      return newKey;
        });

    
    let output= finalHeading + "\n" + frequencyName + " | " + unit + "\n\n" + 
   
    `Description\t${headers.join("\t")}\n`;

    // `Description\t${headers.join("\t")}\n`;

      transformedRows.forEach((row:any)  => {
      const rowValues = [
        row.description,
        ...fixedHeaders.map((h: string) => row[h] ?? "-")
      ];
      
      output += rowValues.join("\t") + "\n";
    });

    
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