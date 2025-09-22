import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req: Request) {
  //console.log("API route hit!");
 

  let connection;

  try {
    // Ensure we have a proper URL object

    //const url = new URL(req.url, `http://${req.headers.get('host') || 'localhost'}`);
    const { searchParams } = new URL(req.url);
  

    const acode = searchParams.get("pcode");
   
    const frequency = searchParams.get("frequency");
 
    const usedTableName = frequency?.split("_")[0] || "";
    

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const st = searchParams.get("st");
    const samytd = searchParams.get("samytd");

      const [monthFrom, yearFrom] = from?.split("s") || "";
     const [monthTo, yearTo] = to?.split("s") || "";

     let addperiod='';
				if (samytd ==="true") {
  addperiod = `and period=${monthTo}`;
}
          


    // Validate all required parameters
  /*  if (!field || !frequency || !from || !to || !st) {
      {const missingParams = [];
      if (!field) missingParams.push("field");
      if (!frequency) missingParams.push("frequency");
      if (!from) missingParams.push("from");
      if (!to) missingParams.push("to");
      if (!st) missingParams.push("st");
      
      console.warn(`Missing parameters: ${missingParams.join(", ")}`);
      return NextResponse.json(
        { error: `Missing required parameters: ${missingParams.join(", ")}` },
        { status: 400 }
      );}
    }*/

    // Database connection
    connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: Number(process.env.DATABASE_PORT),
    });

    console.log("Database connected successfully!");
    
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

  const query = 
    `select  ${period}, t1.acode,
    t1.pamount as pamount1
		from
		(select acode,(pamount) as pamount,mmonth,myear,period,fyear
		from (select acode,pamount,mmonth,myear,period,fyear 
				from ${tableName} where acode=? and fyear >= ? and fyear <=? and printcol!='N'
                order by fyear,period)gentable2 where not (fyear=? and period <?) 
                and not (fyear =? and period > ?) ${addperiod}  ) t1
	
		order by t1.fyear asc,t1.period asc`;
		

    //const values = [acode,yearFrom,yearTo, acode,];
     const values = [acode, yearFrom,yearTo,yearFrom,monthFrom,yearTo,monthTo];
   
    //const printQuery = mysql.format(query, values);
    //console.log("Executing SQL Query:\n", printQuery);
      

    const [rows]:any = await connection.execute(query,values);
    const valuedec = "N";
    const dataobject = (rows as any[]).map((row: any) => {
       // const dataobject = rows.map((row) => {    
  return {
    date: row.Period,  
    value1: valuedec === "N"
      ? Math.round(Number(row.pamount1) * 100) / 100   // 2 decimals
      : Math.round(Number(row.pamount1)),              
  };
});

return NextResponse.json(dataobject);


  } catch (error) {
  
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}