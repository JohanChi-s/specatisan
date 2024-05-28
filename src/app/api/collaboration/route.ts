import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";

const JWT_SECRET = process.env.TIPTAP_COLLAB_SECRET as string;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { userId, email } = await req.json();

    // Define the payload object to be encoded in the JWT
    const payload = {
      userId,
      email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Optional: Set expiration time (1 hour)
    };

    // Sign the JWT with the payload and secret
    const jwt = jsonwebtoken.sign(payload, JWT_SECRET);

    // Return the signed JWT as a JSON response
    return new Response(JSON.stringify({ token: jwt }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handle any errors that occur during the signing process
    return new Response(JSON.stringify({ error: "Failed to generate token" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
