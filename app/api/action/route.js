import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  // // Replace the uri string with your connection string.
  let { action, slug, initialquantity } = await request.json();
  const uri = "<connection-uri>";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");
    const filter = { slug: slug };

    let finalquantity =
      action == "plus"
        ? parseInt(initialquantity) + 1
        : parseInt(initialquantity) - 1;
    const updateDoc = {
      $set: {
        quantity: finalquantity,
      },
    };
    const result = await inventory.updateOne(filter, updateDoc);

    return NextResponse.json({
      success: true,
      message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)}`,
    });
  } finally {
    await client.close();
  }
}
