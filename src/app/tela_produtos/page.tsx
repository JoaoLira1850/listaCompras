'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import Modal from '@/componentes/modal'

// --- Ícones como Componentes ---
const IconBox = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 10l8 4m0 0l8-4m-8 4v-4" />
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

// --- Interfaces ---
interface ProdutoSupermercado {
    id: number,
    categoria: string,
    produto: string
}

interface GrupoDeProdutos {
    [categoria: string]: ProdutoSupermercado[]
}

// --- Componente Principal ---
export default function TelaProdutos() {
    const [listProd, setListaProd] = useState<ProdutoSupermercado[]>([]);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProdutoSupermercado | null>(null);

    const buscarProdutos = async () => {
        try {
            const res = await fetch("/api/lista_super");
            if (res.ok) {
                const data = await res.json();
                setListaProd(data);
            }
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };

    useEffect(() => {
        buscarProdutos();
    }, []);

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newProduct = {
            categoria: formData.get('categoria') as string,
            produto: formData.get('produto') as string,
        };
        try {
            const res = await fetch('/api/lista_super', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            if (res.ok) {
                setCreateModalOpen(false);
                buscarProdutos();
            }
        } catch (error) {
            console.error("Erro ao criar produto:", error);
        }
    };

    const handleEditClick = (product: ProdutoSupermercado) => {
        setEditingProduct(product);
        setEditModalOpen(true);
    };

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingProduct) return;
        const formData = new FormData(event.currentTarget);
        const updatedProduct = {
            id: editingProduct.id,
            categoria: formData.get('categoria') as string,
            produto: formData.get('produto') as string,
        };
        try {
            const res = await fetch('/api/lista_super', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });
            if (res.ok) {
                setEditModalOpen(false);
                buscarProdutos();
            }
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
        try {
            const res = await fetch(`/api/lista_super?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setListaProd(prev => prev.filter(p => p.id !== id));
            } else {
                const errorData = await res.json();
                alert(`Erro: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
        }
    };

    const produtosAgrupados = useMemo(() => {
        return listProd.reduce((acc, produto) => {
            const categoria = produto.categoria;
            if (!acc[categoria]) acc[categoria] = [];
            acc[categoria].push(produto);
            return acc;
        }, {} as GrupoDeProdutos);
    }, [listProd]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-100 font-sans">
            <div className="bg-white rounded-3xl p-6 w-[420px] h-[720px] flex flex-col shadow-2xl">
                
                {/* --- Cabeçalho --- */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <IconBox />
                    <h1 className="text-3xl font-bold text-slate-800">Gerenciar Produtos</h1>
                </div>

                {/* --- Área de Listagem --- */}
                <div className="flex-grow space-y-4 overflow-y-auto pr-2 -mr-2">
                    {Object.keys(produtosAgrupados).length > 0 ? (
                        Object.keys(produtosAgrupados).sort().map(categoria => (
                            <div key={categoria}>
                                <h2 className="font-bold text-lg text-indigo-700 border-b-2 border-indigo-200 pb-1 mb-3">{categoria}</h2>
                                <div className="space-y-2">
                                    {produtosAgrupados[categoria].map((list) => (
                                        <div key={list.id} className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                                            <span className="text-slate-700 font-medium">{list.produto}</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditClick(list)} className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"><IconPencil /></button>
                                                <button onClick={() => handleDelete(list.id)} className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition-colors"><IconTrash /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-slate-500 pt-20">
                            <p>Nenhum produto cadastrado.</p>
                            <p className="text-sm">Clique em 'Adicionar' para começar!</p>
                        </div>
                    )}
                </div>

                {/* --- Barra de Ações Inferior --- */}
                <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                    <Link href="/tela_inicial" className="w-1/3">
                        <button className="w-full bg-slate-200 text-slate-800 py-3 px-4 rounded-xl font-semibold hover:bg-slate-300 transition-colors">Voltar</button>
                    </Link>
                    <button onClick={() => setCreateModalOpen(true)} className="w-2/3 bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">Adicionar Produto</button>
                </div>
            </div>

            {/* --- Modais --- */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)}>
                <form onSubmit={handleCreate} className="flex flex-col gap-4 p-4">
                    <h2 className="text-2xl font-bold text-slate-800 text-center">Novo Produto</h2>
                    <input name="categoria" type="text" placeholder="Categoria (ex: Laticínios)" className="w-full border-2 border-slate-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-indigo-500" required />
                    <input name="produto" type="text" placeholder="Nome do Produto (ex: Leite Integral)" className="w-full border-2 border-slate-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-indigo-500" required />
                    <button type="submit" className="w-full bg-indigo-600 text-white rounded-xl px-5 py-3 font-semibold hover:bg-indigo-700">Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
                {editingProduct && (
                    <form onSubmit={handleUpdate} className="flex flex-col gap-4 p-4">
                        <h2 className="text-2xl font-bold text-slate-800 text-center">Editar Produto</h2>
                        <input name="categoria" type="text" defaultValue={editingProduct.categoria} className="w-full border-2 border-slate-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-blue-500" required />
                        <input name="produto" type="text" defaultValue={editingProduct.produto} className="w-full border-2 border-slate-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-blue-500" required />
                        <button type="submit" className="w-full bg-blue-600 text-white rounded-xl px-5 py-3 font-semibold hover:bg-blue-700">Salvar Alterações</button>
                    </form>
                )}
            </Modal>
        </div>
    )
}
