
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

        const valorTotal = itenProduto.reduce((total,produto)=> total + produto.valorProd,0)
        
        
        return NextResponse.json({
            produtos:itenProduto,
            valorTotal:valorTotal
        })
    }else{
        return NextResponse.json({error:"Item Não encontrado"},{status:404})
    }

    

}