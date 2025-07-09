'use client'


import React, { useEffect, useState } from 'react'  
import Link from 'next/link'

interface lista {
    id: number,
    categoria: string,
    produto: string
}

export default function TelaProdutos(){

    const [listProd,setListaProd] = useState<lista[]>([])


    useEffect(()=>{
        async function buscarProd() {

            const res = await fetch ("/api/lista_super")
            const data = await res.json()
            setListaProd(data)          
        }

        buscarProd()
    },[])

    

    return (
        <div className="flex justify-center items-center min-h-screen bg-cyan-400">
            <div className="bg-white border-2 border-black/20 rounded-2xl p-4 w-[420px] h-[720px] overflow-hidden">
                <div className="text-center p-3 border-2 border-black/20 rounded-2xl text-sm mb-4">
                    <p className="text-black font-semibold">Lista de Produtos</p>
                </div>

                <div className="overflow-y-auto max-h-[550px] pr-2">
                    {listProd.map((list) => (
                        <div
                            key={list.id}
                            className="border-2 border-black/20 rounded-2xl p-3 mb-3 flex justify-between items-start text-black"
                            >
                            <div className="flex flex-col text-sm max-w-[45%] break-words">
                                <span className="font-medium">Categoria</span>
                                <span>{list.categoria}</span>
                            </div>

                            <div className="flex flex-col text-sm max-w-[45%] break-words text-right">
                                <span className="font-medium">Produto</span>
                                <span>{list.produto}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-4">
                    <Link href="/tela_inicial">
                        <button className="bg-gray-700 text-white py-2 px-4 rounded-2xl">
                            Voltar
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )

      
}