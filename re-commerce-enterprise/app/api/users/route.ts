export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ message: "Users API - Emergency Mode" });
}
