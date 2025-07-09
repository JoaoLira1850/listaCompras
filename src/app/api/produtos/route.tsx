import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET (req:NextRequest){

    const {searchParams} = new URL(req.url)
    const id = searchParams.get('id')
    
    

    if(id){
        const item = await prisma.listaProdutos.findMany({
            where:{
                lista: Number(id),
            },
        })

        const itenProduto = item.map((iten)=>({
            ...iten,
            valorProd:iten.Quantidade* iten.preco,
        }))
        
     
        return NextResponse.json(itenProduto)
    } else{
        return NextResponse.json({error:"Item Não encontrado"},{status:404})
    }

    
}

export async function DELETE(req:NextRequest) {

    const {id} = await req.json()

    try{
        const produto = await prisma.listaProdutos.delete({
            where:{
                id
            }
        })

        return Response.json({message: "ok lista deletada",produto})
    }catch(err){

        return NextResponse.json({
            message: "Error",
            err,
        },{
            status:500
        })

    }
    
}

export async function PUT(req:NextRequest) {

    const {id} = await req.json()

    try{
        const produto = await prisma.listaProdutos.update({
            where:{id},
            data:{Comprado: 1},
        })

        return NextResponse.json({message:"Produto Comprado",produto})
    }catch(err){
        return NextResponse.json({message: "Erro",err},{status:500})
    }
    
}