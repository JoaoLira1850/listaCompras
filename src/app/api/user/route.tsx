import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function GET() {

    const user = await prisma.usuario.findMany()

    return Response.json({user});
    console.log(user)
}
