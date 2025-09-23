import { NextResponse } from "next/server";
//import mysql from "mysql2/promise";
import { getConnection } from "../../zaksite/utils/db"

export async function GET() {
  //let connection;
    let connection = await getConnection();

  try {
    
    // Execute Query
    const [rows] = await connection.execute(
      "SELECT tcode, tdrplabel, dispseq FROM ec_thead WHERE dispseq = 1 AND mcode = 'FSA' ORDER BY tdrpsort"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } 
}
