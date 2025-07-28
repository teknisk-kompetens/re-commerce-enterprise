export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ message: "Auth API - Emergency Mode" });
}
