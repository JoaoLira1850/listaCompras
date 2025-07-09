'use server'
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

export default async function CriarLista(formData:FormData){

    
    const lista = formData.get('lista') as string

    await prisma.listaCompras.create({
        data:{
            lista,
        },
    })
    console.log("LISTA FOI CRIADA")
}



export async function Criar_Produto(formData:FormData){

    const lista = Number(formData.get("titulo"))
    const produto = formData.get("Produto") as string
    const Quantidade = Number(formData.get("Quant"))
    const preco = Number(formData.get("preco"))
    
    await prisma.listaProdutos.create({
        data:{
            lista,
            produto,
            Quantidade,
            preco,
        },
    })

}


export async function Comprado(num: number, com: number){

    const id = num
    const Comprado = com

    await prisma.listaProdutos.updateMany({

        where:{
            id,
            
        },
        data:{

            Comprado,

        },

    })
}

/*
const Comprado = ({num,com}) =>{

}
*/