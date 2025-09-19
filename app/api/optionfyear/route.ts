import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req: Request) {
  let connection;

  try {
    const { searchParams } = new URL(req.url);
    const frequency = searchParams.get("frequency");
    const usedTableName = frequency?.split("_").pop() || "";
    //console.log(usedTableName )

    
    connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: Number(process.env.DATABASE_PORT),
    });

    console.log("Database connected successfully!");
    let sel_qry = '';
   if(usedTableName == 'y'){
    sel_qry= `select displayvalue,1 as mmonth,fyear from dropdownfiscal where period=?
    order by fyear,mmonth`;

   }else{
       sel_qry= `select displayvalue,substr(displayvalue,1,1) as mmonth,fyear from dropdownfiscal where period=?
      order by fyear,mmonth`;
   }

 
      const values = [usedTableName];
         
      const [rows] = await connection.execute(sel_qry,values);
      // console.log("Executing SQL Query:\n", sel_qry);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } 
}
