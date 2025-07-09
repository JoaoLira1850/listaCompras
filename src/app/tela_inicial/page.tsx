'use client'
import Modal from '@/componentes/modal'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import listAction from '@/action/service/list-service'
import { useRouter } from 'next/navigation'

// --- Ícones como componentes para reutilização e clareza ---
const IconList = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const IconPencil = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
    </svg>
);

const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

// --- Componente Principal ---
interface Lista {
    id: number;
    lista: string;
}

export default function Tela_inicial() {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [listas, setListas] = useState<Lista[]>([]);
    const [editingList, setEditingList] = useState<Lista | null>(null);
    const router = useRouter();

    const carregarListas = async () => {
        try {
            const resposta = await fetch('/api/lista');
            if (resposta.ok) {
                const dados = await resposta.json();
                setListas(dados);
            } else {
                console.error("Falha ao carregar listas");
            }
        } catch (error) {
            console.error("Erro ao conectar com a API:", error);
        }
    };

    useEffect(() => {
        carregarListas();
    }, []);

    const handleNavigateToList = (id: number, lista: string) => {
        router.push(`/tela_lista?id=${id}&lista=${lista}`);
    }

    const handleEditClick = (lista: Lista) => {
        setEditingList(lista);
        setEditModalOpen(true);
    }

    const handleUpdateList = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingList) return;
        const formData = new FormData(event.currentTarget);
        const newListName = formData.get('lista') as string;

        try {
            const res = await fetch('/api/lista', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingList.id, lista: newListName }),
            });
            if (res.ok) {
                setListas(prev => prev.map(l => l.id === editingList.id ? { ...l, lista: newListName } : l));
                setEditModalOpen(false);
                setEditingList(null);
            } else {
                console.error("Falha ao atualizar a lista");
            }
        } catch (error) {
            console.error("Erro ao conectar com a API para atualizar:", error);
        }
    }

    const excluirLista = async (id: number) => {
        // Adicionando uma confirmação para segurança
        if (window.confirm("Tem certeza que deseja excluir esta lista e todos os seus produtos?")) {
            try {
                const res = await fetch(`/api/lista?id=${id}`, { method: "DELETE" });
                if (res.ok) {
                    setListas((prev) => prev.filter((lista) => lista.id !== id));
                } else {
                    console.error("Falha ao excluir a lista");
                }
            } catch (error) {
                console.error("Erro ao conectar com a API para excluir:", error);
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
            <div className="w-[420px] h-[720px] relative bg-white rounded-3xl p-6 shadow-2xl flex flex-col">

                {/* --- Cabeçalho --- */}
                <div className='flex items-center justify-center gap-3 mb-6'>
                    <IconList />
                    <h1 className="text-3xl font-bold text-slate-800">Minhas Listas</h1>
                </div>

                {/* --- Área de Listagem --- */}
                <div className="flex-grow space-y-3 overflow-y-auto pr-2 -mr-2">
                    {listas.length > 0 ? (
                        listas.map((lista) => (
                            <div key={lista.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all duration-300 hover:shadow-lg hover:border-purple-300">
                                <div className="text-lg font-medium text-slate-700 cursor-pointer flex-grow truncate" onClick={() => handleNavigateToList(lista.id, lista.lista)}>
                                    {lista.lista}
                                </div>
                                <div className="flex gap-2 items-center ml-4">
                                    <button onClick={() => handleEditClick(lista)} className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors">
                                        <IconPencil />
                                    </button>
                                    <button onClick={() => excluirLista(lista.id)} className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition-colors">
                                        <IconTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-slate-500 pt-20">
                            <p>Nenhuma lista encontrada.</p>
                            <p className="text-sm">Clique no '+' para criar uma nova!</p>
                        </div>
                    )}
                </div>

                {/* --- Botão Flutuante para Adicionar --- */}
                <div className='absolute bottom-24 right-6'>
                    <button
                        className='bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110'
                        onClick={() => setCreateModalOpen(true)}
                        aria-label="Criar nova lista"
                    >
                        <IconPlus />
                    </button>
                </div>

                {/* --- Modais --- */}
                <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)}>
                    <form action={listAction} onSubmit={() => setTimeout(carregarListas, 500)} className="flex flex-col items-center gap-4 p-4">
                        <h2 className="text-2xl font-bold text-slate-800">Criar Nova Lista</h2>
                        <input id="lista" name="lista" type="text" className="w-full border-2 border-slate-300 rounded-xl p-3 text-center text-black focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" placeholder="Ex: Compras da Semana" required />
                        <button type="submit" className="w-full bg-purple-600 text-white rounded-xl px-5 py-3 font-semibold hover:bg-purple-700 transition-colors">
                            Salvar Lista
                        </button>
                    </form>
                </Modal>

                <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
                    {editingList && (
                        <form onSubmit={handleUpdateList} className="flex flex-col items-center gap-4 p-4">
                            <h2 className="text-2xl font-bold text-slate-800">Editar Lista</h2>
                            <input name="lista" type="text" defaultValue={editingList.lista} className="w-full border-2 border-slate-300 rounded-xl p-3 text-center text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Novo título da Lista" required />
                            <button type="submit" className="w-full bg-blue-600 text-white rounded-xl px-5 py-3 font-semibold hover:bg-blue-700 transition-colors">
                                Salvar Alterações
                            </button>
                        </form>
                    )}
                </Modal>

                {/* --- Barra de Navegação Inferior --- */}
                <div className='absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 rounded-b-3xl'>
                    <div className="flex justify-around p-2">
                        <div className="flex flex-col items-center gap-1 text-purple-600">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5z" /></svg>
                            <span className='text-xs font-bold'>Listas</span>
                        </div>
                        <Link href="/tela_produtos" className="flex flex-col items-center gap-1 text-slate-500 hover:text-purple-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                            <span className='text-xs font-medium'>Produtos</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
