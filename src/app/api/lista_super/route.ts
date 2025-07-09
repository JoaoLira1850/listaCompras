'use server'

import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"


export async function GET(){

    const res = await prisma.produtos_supermercado.findMany()

    return NextResponse.json(res)
    
}