import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  // // Replace the uri string with your connection string.
  const uri = "mongodb+srv://svmore456:svmore456@cluster0.a49w601.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const products = await inventory.find(query).toArray();

    return NextResponse.json({ success: true, products });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function POST(request) {
  // // Replace the uri string with your connection string.
  let body = await request.json();
  const uri = "mongodb+srv://svmore456:svmore456@cluster0.a49w601.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    // Query for a movie that has the title 'Back to the Future'
    // const query = {};
    const product = await inventory.insertOne(body);

    return NextResponse.json({ product, ok: true });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
