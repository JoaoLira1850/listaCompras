'use client'

import Link from 'next/link'
import Popup from '@/componentes/popup'
import React, { useEffect, useState } from 'react'  
import { Comprado, Criar_Produto } from '@/action/service/list-service'
import { useSearchParams } from 'next/navigation'
import { sourceMapsEnabled } from 'process'

interface lista {
    id: number,
    categoria: string,
    produto: string
}

export default function Tela_lista(){

    const [isPopup, setIspopup] = useState(false)
    const [produtos, setProdutos] = useState<{ id: number, lista: number, produto: string, Quantidade: string, preco: number, valorProd: number , Comprado: number}[]>([])
    const [total, setTotal] = useState(0)
    const [cont, setCont] = useState([])
    const [idProd, setIdProd] = useState(0)
    const [supProd,setSuperProd] = useState<lista []>([])

    const ispage = useSearchParams()
    const id = ispage.get('id')
    const lista = ispage.get('lista')

    useEffect(() => {
        async function BuscarPorID() {
            const produto = await fetch(`/api/produtos?id=${id}`)
            const produtoJSON = await produto.json()
            setProdutos(produtoJSON)
        }

        async function VendaTotal() {
            const produto = await fetch(`/api/listAll?id=${id}`)
            const produtoJSON = await produto.json()
            setTotal(produtoJSON.valorTotal)
        }

        async function QuantProd() {
            const produto = await fetch(`/api/contprod?id=${id}`)
            const produtoJSON = await produto.json()
            setCont(produtoJSON.quantidadeProdutos)
        }

        async function buscarProduto() {

            const produto = await fetch("/api/lista_super")
            const produtoJSON = await produto.json()
            setSuperProd(produtoJSON)
            
        }

        VendaTotal()
        BuscarPorID()
        QuantProd()
        buscarProduto()    
    }, [])

    function formatarMoeda(valor: number) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }


    // Função para excluir um produto 
    async function excluirProduto(id: number) {

        const res = await fetch(`/api/produtos?id=${id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"aplication/json",

            },
            body:JSON.stringify({id}),
        })

        console.log("Deu certo ")

        setProdutos((prev)=> prev.filter((produtos)=> produtos.id !== id))

        
    }

    // Funcão para comfirmar se o produto foi comprado---------------------------------------------

    async function comprarProduto(id: number) {
        
        try{
            const res = await fetch(`/api/produtos?id=${id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({id}),
            })

            setProdutos(prev => prev.map(p => p.id === id ? {...p,Comprado:1}:p))
        }catch(error){
            console.error("Erro ao comprar o produto",error)
        }
    }

    //--------------------------------------------------------------------------------------------
    // selecionar a lista de produtos por categoria 

    const [categoriaselecionada,SetCategoriaselecionada] = useState("")

    const produtosFiltrados = supProd.filter(
        (sup)=> sup.categoria === categoriaselecionada  
    )


    return (
        <div className="flex justify-center items-center min-h-screen bg-cyan-400">
            <div className="bg-white border-2 border-black/20 rounded-2xl p-3 w-[420px] h-[720px] relative">

                <div className="text-center p-4 border-2 border-black/20 rounded-2xl text-sm mb-2">
                    <label className='text-black'>{lista}</label>
                </div>

                <div className="border-2 border-black/20 rounded-2xl p-6 flex justify-center gap-12 mb-2">
                    <div className="flex flex-col items-center text-sm">
                        <label className='text-black'>Valores dos produtos</label>
                        <label className="bg-gray-700 text-white rounded-2xl py-2 px-4 mt-1">{formatarMoeda(total)}</label>
                    </div>

                    <div className="flex flex-col items-center text-sm">
                        <label className='text-black'>Quant de produtos</label>
                        <label className="bg-gray-700 text-white rounded-2xl py-2 px-4 mt-1">{cont}</label>
                    </div>
                </div>

                <div className="overflow-y-auto overflow-x-hidden max-h-[400px] mb-20">
                    {produtos.map((produto) => (
                        <div key={produto.id} 
                            className={`border-2 border-black/20 rounded-2xl p-3 mb-2 flex justify-between items-center text-black
                                ${produto.Comprado === 1 ? 'bg-green-200 border-green-400' : 'bg-white border-black/20'} text-black`}
                                >
                            <div className="flex flex-col text-sm">
                                <h1>Produto</h1>
                                <label>{produto.produto}</label>
                            </div>

                            <div className="flex flex-col text-sm ">
                                <h1>Quant</h1>
                                <label>{produto.Quantidade}</label>
                            </div>

                            <div className="flex flex-col text-sm">
                                <h1>Preço</h1>
                                <label>{formatarMoeda(produto.valorProd)}</label>
                            </div>

                            <div className="flex flex-col">
                                <button 
                                    className="bg-black/50 rounded-2xl p-1 m-1 text-xs text-white" 
                                    onClick={() => comprarProduto(produto.id)}
                                >
                                    Comprar
                                </button>
                                <button 
                                    className="bg-black/50 rounded-2xl p-1 m-1 text-xs text-white"
                                    

                                >
                                Editar
                                </button>
                                <button 
                                    className="bg-black/50 rounded-2xl p-1 m-1 text-xs text-white"
                                    onClick={()=> excluirProduto(produto.id)}
                                >Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-[150px] right-5">
                    <button onClick={() => setIspopup(true)} className="bg-black/50 text-white p-3 rounded-xl text-sm">
                        Adicionar Produtos
                    </button>
                </div>

                <Popup isOpen={isPopup} onClose={() => setIspopup(false)}>
                    <form action={Criar_Produto} className="flex flex-col gap-2 text-black">
                        <input type="number" className="absolute left-[-9999px]" placeholder="Titulo Lista" id="titulo" name="titulo" defaultValue={id || ''} />
                        <select 
                            name="categoria" 
                            id="categoria"
                            className="border-2 border-black/20 rounded-2xl p-2 text-center"
                            onChange={(e)=> SetCategoriaselecionada(e.target.value)}
                            >
                                {[...new Set(supProd.map(sup => sup.categoria))].map((categoria,index)=>(
                                    <option 
                                        value={categoria}
                                        key={index}
                                    >
                                        {categoria}
                                    </option>
                                ))}

                        </select>
                        <select 
                            name="Produto" 
                            id="Produto" 
                            className="border-2 border-black/20 rounded-2xl p-2 text-center"
                            disabled = {!categoriaselecionada}
                            >
                                {produtosFiltrados.map((sup)=>(
                                    <option
                                        value={sup.produto}
                                        key={sup.id}
                                    >
                                        {sup.produto}
                                    </option>
                                ))}

                            

                        </select>
                        <input type="number" placeholder="Quant" id="Quant" name="Quant" className="border-2 border-black/20 rounded-2xl p-2 text-center" />
                        <input type="number" step="any" placeholder="Preço Unit" id="preco" name="preco" className="border-2 border-black/20 rounded-2xl p-2 text-center" />
                        <button type="submit" className="bg-green-600 text-white rounded-xl px-5 py-2">Salvar Produto</button>
                    </form>
                </Popup>

                <div className="absolute bottom-5 right-10">
                    <button>
                        <Link href="/tela_inicial" className="bg-gray-700 text-white py-2 px-4 rounded-2xl">Voltar</Link>
                    </button>
                </div>

            </div>
        </div>
    )
}
