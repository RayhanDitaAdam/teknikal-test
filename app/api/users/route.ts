import { NextRequest, NextResponse } from "next/server";
import { prisma, createLog } from "@/lib/db";

export async function GET() {
  const users = await prisma.user.findMany({
    where: { role: { in: ["driver", "approver", "admin"] } },
    orderBy: { nama: "asc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nama, email, role } = body;

  if (!nama || !email || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: { nama, email, role },
  });

  await createLog("system", "CREATE_USER", `User ${nama} (${role}) berhasil ditambahkan`);

  return NextResponse.json(user, { status: 201 });
}