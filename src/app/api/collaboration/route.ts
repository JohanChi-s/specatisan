import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";

const JWT_SECRET = process.env.TIPTAP_COLLAB_SECRET as string;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { userId, email } = await req.json();
    console.log("userId", userId);
    console.log("email", email);

    // Define the payload object to be encoded in the JWT
    const payload = {
      userId,
      email,
    };

    // Sign the JWT with the payload and secret
    const jwt = jsonwebtoken.sign(payload, JWT_SECRET);
    console.log("🚀 ~ POST ~ jwt:", jwt);

    // Return the signed JWT as a JSON response
    return new Response(JSON.stringify({ token: jwt }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    // Handle any errors that occur during the signing process
    return new Response(
      JSON.stringify({ error: `Failed to generate token ${error}` }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
