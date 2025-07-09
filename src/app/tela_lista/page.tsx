'use client'

import Link from 'next/link'
import Popup from '@/componentes/popup' // Usando seu componente Popup
import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Criar_Produto } from '@/action/service/list-service'

// --- Ícones como Componentes React para clareza e reutilização ---
const IconChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
interface Produto {
    id: number;
    lista: number;
    produto: string;
    Quantidade: string;
    preco: number;
    valorProd: number;
    Comprado: number;
}

interface SupProdLista {
    id: number;
    categoria: string;
    produto: string;
}

// --- Componente Principal ---
export default function Tela_lista() {
    const [isAddPopupOpen, setAddPopupOpen] = useState(false);
    const [isEditPopupOpen, setEditPopupOpen] = useState(false);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
    const [total, setTotal] = useState(0);
    const [cont, setCont] = useState(0);
    const [supProd, setSuperProd] = useState<SupProdLista[]>([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const lista = searchParams.get('lista');

    const fetchData = async () => {
        if (!id) return;
        try {
            const [produtosRes, totalRes, contRes, supProdRes] = await Promise.all([
                fetch(`/api/produtos?id=${id}`),
                fetch(`/api/listAll?id=${id}`),
                fetch(`/api/contprod?id=${id}`),
                fetch("/api/lista_super")
            ]);
            const produtosJSON = await produtosRes.json();
            const totalJSON = await totalRes.json();
            const contJSON = await contRes.json();
            const supProdJSON = await supProdRes.json();

            setProdutos(produtosJSON);
            setTotal(totalJSON.valorTotal || 0);
            setCont(contJSON.quantidadeProdutos || 0);
            setSuperProd(supProdJSON);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const formatarMoeda = (valor: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

    const handleEditClick = (produto: Produto) => {
        setEditingProduct(produto);
        setEditPopupOpen(true);
    };

    const handleUpdateProduct = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingProduct) return;
        const formData = new FormData(event.currentTarget);
        const updatedData = {
            produto: formData.get('produto') as string,
            Quantidade: formData.get('Quantidade') as string,
            preco: parseFloat(formData.get('preco') as string),
        };
        try {
            const res = await fetch(`/api/produtos?id=${editingProduct.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            if (res.ok) {
                await fetchData();
                setEditPopupOpen(false);
                setEditingProduct(null);
            }
        } catch (error) {
            console.error("Erro ao atualizar o produto:", error);
        }
    };

    const excluirProduto = async (id: number) => {
        if (window.confirm("Tem certeza que deseja excluir este produto?")) {
            try {
                await fetch(`/api/produtos?id=${id}`, { method: "DELETE" });
                await fetchData();
            } catch (error) {
                console.error("Erro ao excluir produto:", error);
            }
        }
    };

    const comprarProduto = async (id: number) => {
        try {
            await fetch(`/api/produtos?id=${id}`, { method: "PUT" });
            // Otimistic update para uma resposta visual mais rápida
            setProdutos(prev => prev.map(p => p.id === id ? { ...p, Comprado: p.Comprado ? 0 : 1 } : p));
            // Re-busca em segundo plano para garantir consistência
            fetchData();
        } catch (error) {
            console.error("Erro ao comprar o produto", error);
        }
    };

    const produtosFiltrados = useMemo(() => {
        return supProd.filter((sup) => sup.categoria === categoriaSelecionada);
    }, [supProd, categoriaSelecionada]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
            <div className="w-[420px] h-[720px] relative bg-white rounded-3xl p-6 shadow-2xl flex flex-col">
                
                {/* --- Cabeçalho --- */}
                <div className="flex items-center mb-4">
                    <Link href="/tela_inicial" className="p-2 rounded-full hover:bg-slate-100">
                        <IconChevronLeft />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800 text-center flex-grow truncate px-4">{lista || 'Minha Lista'}</h1>
                </div>

                {/* --- Resumo da Lista --- */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-purple-100 text-purple-800 p-4 rounded-2xl text-center">
                        <p className="text-sm font-semibold">Valor Total</p>
                        <p className="text-2xl font-bold">{formatarMoeda(total)}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 p-4 rounded-2xl text-center">
                        <p className="text-sm font-semibold">Itens na Lista</p>
                        <p className="text-2xl font-bold">{cont}</p>
                    </div>
                </div>

                {/* --- Área de Listagem de Produtos --- */}
                <div className="flex-grow space-y-3 overflow-y-auto pr-2 -mr-2">
                    {produtos.length > 0 ? produtos.map((produto) => (
                        <div key={produto.id} className={`border rounded-2xl p-3 flex items-center gap-4 transition-all duration-300 ${produto.Comprado ? 'bg-green-50 border-green-300' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
                            <button onClick={() => comprarProduto(produto.id)} className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${produto.Comprado ? 'bg-green-500 text-white' : 'border-2 border-slate-300 text-transparent'}`}>
                                <IconCheck />
                            </button>
                            <div className="flex-grow grid grid-cols-3 items-center gap-2 text-sm">
                                <div className="flex flex-col col-span-1 truncate">
                                    <span className="font-semibold text-slate-700">{produto.produto}</span>
                                    <span className="text-slate-500 text-xs">Produto</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="font-medium text-slate-600">{produto.Quantidade}</span>
                                    <span className="text-slate-500 text-xs">Quant.</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium text-slate-600">{formatarMoeda(produto.valorProd)}</span>
                                    <span className="text-slate-500 text-xs">Valor</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 ml-2">
                                <button onClick={() => handleEditClick(produto)} className="p-1.5 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"><IconPencil /></button>
                                <button onClick={() => excluirProduto(produto.id)} className="p-1.5 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition-colors"><IconTrash /></button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-slate-500 pt-20">
                            <p>Nenhum produto na lista.</p>
                            <p className="text-sm">Clique em 'Adicionar Produto' para começar!</p>
                        </div>
                    )}
                </div>
                
                {/* --- Barra de Ações Inferior --- */}
                <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                    <Link href="/tela_inicial" className="w-1/3">
                        <button className="w-full bg-slate-200 text-slate-800 py-3 px-4 rounded-xl font-semibold hover:bg-slate-300 transition-colors">
                            Voltar
                        </button>
                    </Link>
                    <button onClick={() => setAddPopupOpen(true)} className="w-2/3 bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                        Adicionar Produto
                    </button>
                </div>

                {/* --- Modais --- */}
                <Popup isOpen={isAddPopupOpen} onClose={() => setAddPopupOpen(false)}>
                    <form action={Criar_Produto} onSubmit={() => setTimeout(fetchData, 500)} className="flex flex-col gap-4 p-4">
                        <h2 className="text-2xl font-bold text-slate-800 text-center">Adicionar Produto</h2>
                        <input type="hidden" name="titulo" defaultValue={id || ''} />
                        <select name="categoria" className="w-full border-2 border-slate-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-purple-500" onChange={(e) => setCategoriaSelecionada(e.target.value)} required>
                            <option value="">Selecione a Categoria</option>
                            {[...new Set(supProd.map(sup => sup.categoria))].map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                        </select>
                        <select name="Produto" className="w-full border-2 border-slate-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-purple-500" disabled={!categoriaSelecionada} required>
                            <option value="">Selecione o Produto</option>
                            {produtosFiltrados.map((sup) => <option key={sup.id} value={sup.produto}>{sup.produto}</option>)}
                        </select>
                        <input type="number" name="Quant" placeholder="Quantidade" className="w-full border-2 border-slate-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-purple-500" required />
                        <input type="number" step="0.01" name="preco" placeholder="Preço Unitário" className="w-full border-2 border-slate-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-purple-500" required />
                        <button type="submit" className="w-full bg-purple-600 text-white rounded-xl px-5 py-3 font-semibold hover:bg-purple-700">Adicionar à Lista</button>
                    </form>
                </Popup>

                <Popup isOpen={isEditPopupOpen} onClose={() => setEditPopupOpen(false)}>
                    {editingProduct && (
                        <form onSubmit={handleUpdateProduct} className="flex flex-col gap-4 p-4">
                            <h2 className="text-2xl font-bold text-slate-800 text-center">Editar Produto</h2>
                            <input type="text" name="produto" defaultValue={editingProduct.produto} className="w-full border-2 border-slate-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-blue-500" required />
                            <input type="number" name="Quantidade" defaultValue={editingProduct.Quantidade} className="w-full border-2 border-slate-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-blue-500" required />
                            <input type="number" step="0.01" name="preco" defaultValue={editingProduct.preco} className="w-full border-2 border-slate-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-blue-500" required />
                            <button type="submit" className="w-full bg-blue-600 text-white rounded-xl px-5 py-3 font-semibold hover:bg-blue-700">Salvar Alterações</button>
                        </form>
                    )}
                </Popup>
            </div>
        </div>
    );
}
