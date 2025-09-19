import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  let connection;

  try {
    // Establish MySQL Connection
    connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: Number(process.env.DATABASE_PORT),
    });

    console.log("Database connected successfully!");

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
