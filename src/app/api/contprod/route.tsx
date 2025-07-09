
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req:NextRequest){

    const {searchParams} = new URL(req.url)

    const id = searchParams.get('id')

    if(id){
        const item = await prisma.listaProdutos.findMany({
            where:{
                lista: Number(id),
            },
        })

        const itenProduto = item.map((item)=>({
            ...item,
            valorProd:item.Quantidade* item.preco,
        }))

        const quantidadeProdutos = itenProduto.length 
        
        
        return NextResponse.json({
            produtos:itenProduto,
            quantidadeProdutos:quantidadeProdutos
        })
    }else{
        return NextResponse.json({error:"Item Não encontrado"},{status:404})
    }


}



