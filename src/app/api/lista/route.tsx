import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
/*
export async function GET(req: NextRequest) {

    
    try{
        const listas = await prisma.listaCompras.findMany()
        return Response.json({message:"ok",listas})

    }catch(err){
        return NextResponse.json({
            message:"Error",
            err
        },{
            status:500,
        })

    }
 
    
}
*/

export async function POST(req: Request){
    const {lista} = await req.json()
    
    try{

        const k = await prisma.listaCompras.create({
            data:{
                lista,
            },
        })
        return Response.json({message: "ok",lista})
    

    }catch(err){
        return NextResponse.json({

            message:"Error",err

        },{
            status:500,
        }
        )
    }
   

}

export async function DELETE(req:Request) {

    const {id} = await req.json()

    try{
        const lista = await prisma.listaCompras.delete({
            where:{
                id
            }
        })
        return Response.json({message: "ok",lista})
    }catch(err){

    return NextResponse.json({
        message: "Error",
        err,
    },{
        status:500,
    })

    }
    
}

export async function PUT(req: Request) {

    const {id,lista} = await req.json()

    try{
        const listas = await prisma.listaCompras.update({
            where:{
                id,

            },
            data:{
                lista,
            }
        })
        return Response.json({message:"ok",lista})
    }catch(err){
        return NextResponse.json({
            message:"Error",
            err
        },{
            status:500
        })
    }

}

export async function GET(req: NextRequest) {

    const lista = await prisma.listaCompras.findMany()

    return NextResponse.json(lista)

}