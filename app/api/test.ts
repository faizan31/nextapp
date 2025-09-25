import { NextResponse } from "next/server";
import { getConnection } from "../zaksite/utils/db"

export default async function GET(req: Request) {
  try {
    const connection = await getConnection();
    const rows = connection.query('SELECT NOW() AS currentTime');
     return NextResponse.json(rows);
  } catch (error) {
  
         return NextResponse.json(
        { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
  }
}
