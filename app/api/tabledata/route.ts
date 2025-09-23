import { NextResponse } from "next/server";
//import mysql from "mysql2/promise";
import { getConnection } from "../../zaksite/utils/db"

export async function GET(req: Request) {
//  console.log("API route hit!");
  //console.log("Full request URL:", req.url);

  //let connection;
  const connection = await getConnection();

  try {
    // Ensure we have a proper URL object

    //const url = new URL(req.url, `http://${req.headers.get('host') || 'localhost'}`);
    const { searchParams } = new URL(req.url);
   
    
    // Debug: log all parameters
    //console.log("All search params:", Array.from(searchParams.entries()));

    const field = searchParams.get("field");
    const frequency = searchParams.get("frequency");
    const usedTableName = frequency?.split("_")[0] || "";
    

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const st = searchParams.get("st");
     const samytd = searchParams.get("samytd");
 
    const [monthFrom, yearFrom] = from?.split("s") || "";
     const [monthTo, yearTo] = to?.split("s") || "";

    // console.log({ monthFrom, yearFrom, monthTo, yearTo });
    //console.log("samytd value is:", samytd, typeof samytd);
     let addperiod='';
				if (samytd ==="true") {
  addperiod = `and period=${monthTo}`;
}
          


    

    // Validate all required parameters
    if (!field || !frequency || !from || !to || !st) {
      {/*const missingParams = [];
      if (!field) missingParams.push("field");
      if (!frequency) missingParams.push("frequency");
      if (!from) missingParams.push("from");
      if (!to) missingParams.push("to");
      if (!st) missingParams.push("st");
      
      console.warn(`Missing parameters: ${missingParams.join(", ")}`);
      return NextResponse.json(
        { error: `Missing required parameters: ${missingParams.join(", ")}` },
        { status: 400 }
      );*/}
    }

    // Database connection
      /*connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: Number(process.env.DATABASE_PORT),
       });*/

       console.log("Database connected successfully!");
    
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
      

        const [rows] = await connection.execute(query,values);
  
        return NextResponse.json(rows);

        } catch (error) {
  
         return NextResponse.json(
        { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
  }
}