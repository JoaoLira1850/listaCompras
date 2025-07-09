'use client'
import Modal from '@/componentes/modal'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'  
import list from '@/action/service/list-service'
import { useRouter } from 'next/navigation'

export default function Tela_inicial() {
    const [isModal, setModel] = useState(false)
    const [listas, setListas] = useState<{ id: number, lista: string }[]>([])
    const router = useRouter()
    
    
    useEffect(() => {
        async function carregarLista() {
            const resposta = await fetch('/api/lista')
            const dados = await resposta.json()
            setListas(dados)
        }
        carregarLista()
    }, [])

    function idclik(id: number, lista: String) {
        router.push(`/tela_lista?id=${id}&lista=${lista}`)
    }

    // função para deletar a lista 

    async function excluirLista(id: number) {

        const res = await fetch("/api/lista",{
            method: "DELETE",
            headers:{
                "Content-Type":"aplication/json",   
            },
            body:JSON.stringify({id}),
        })

        setListas((prev)=> prev.filter((lista) => lista.id !== id));

        
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-cyan-400">
            <div className="w-[420px] h-[720px] relative bg-white border-2 border-black/20 rounded-2xl p-8 shadow-md">
                <div className='mb-4'>
                    <h1 className="text-2xl font-semibold text-black">Minhas Listas</h1>
                </div>

                <div className="bg-purple-700 border-2 border-black/20 rounded-2xl p-5 flex flex-col gap-3 items-center overflow-y-auto overflow-x-hidden max-h-[550px] h-[550px]">
                    {listas.map((lista) => (
                        <div key={lista.id} className="flex bg-gray-300 border-2 border-black/20 rounded-2xl p-4 mx-auto items-center justify-between w-[300px]">
                            <div className="text-base">
                                <label className = 'text-black'onClick={() => idclik(lista.id, lista.lista)}>{lista.lista}</label>
                            </div>   
                            <div className="flex flex-col gap-2 items-end">
                                <button 
                                    className="bg-black text-white rounded-2xl px-3 py-1 text-sm w-full"
                                    onClick={()=>excluirLista(lista.id)}
                                >
                                Excluir
                                </button>
                                <button className="bg-black text-white rounded-2xl px-3 py-1 text-sm w-full">Editar</button>
                            </div>                 
                        </div>
                    ))} 
                </div>

                <div className='absolute bottom-[150px] right-[55px]'>
                    <button className='border-2 border-black/20 bg-green-700/50 rounded-xl px-5 py-2 text-white/50' onClick={() => setModel(true)}>
                        Nova Lista
                    </button>
                </div> 
               
                <div>
                    <Modal isOpen={isModal} onClose={() => setModel(false)}>
                        <form action={list} className="flex flex-col items-center">
                            <div>
                                <input id="lista" name="lista" type="text" className="border-2 border-black/20 rounded-2xl p-2 m-2 text-center text-black" placeholder="Titulo da Lista" />
                            </div>
                            <button type="submit" className="bg-green-600 text-white rounded-xl px-5 py-2">
                                Salvar Lista
                            </button>
                        </form>
                    </Modal>
                </div>         

                <div className='bg-gray-300 border-2 border-black/20 rounded-2xl p-3 flex justify-between w-full mt-2'>
                    <label htmlFor="lista" className='text-black'>Listas</label>
                   <Link href = "/tela_produtos"><label htmlFor="produto" className='text-black' >Produtos</label></Link> 
                </div>
            </div>
        </div>
    )
}
