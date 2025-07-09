'use client'

import React from 'react';
import Link from 'next/link';
import { criarConta } from '@/action/auth-action';

// --- Ícones como Componentes ---
const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const IconEmail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const IconLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

// --- Componente da Página de Cadastro ---
export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans p-4">
            <main className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <form action={criarConta} className="space-y-4">
                    <h1 className="text-3xl font-bold text-slate-800 text-center">Crie sua Conta</h1>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><IconUser /></span>
                        <input id='nome' name='nome' type="text" placeholder="Nome completo" className="w-full pl-10 pr-3 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition placeholder:text-slate-400" required />
                    </div>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><IconEmail /></span>
                        <input id='email' name='email' type="email" placeholder="E-mail" className="w-full pl-10 pr-3 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition placeholder:text-slate-400" required />
                    </div>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><IconLock /></span>
                        <input id="password" name="password" type="password" placeholder="Senha" className="w-full pl-10 pr-3 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition placeholder:text-slate-400" required />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Campo de Data com Label */}
                        <div className="w-full">
                            <label htmlFor="data" className="block text-sm font-medium text-slate-600 mb-1">Data de Nascimento</label>
                            <input 
                                id='data' 
                                name='data' 
                                type="date" 
                                className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-700" 
                                required 
                            />
                        </div>
                        
                        {/* Campo de Sexo com Label */}
                        <div className="w-full">
                            <label htmlFor="sexo" className="block text-sm font-medium text-slate-600 mb-1">Sexo</label>
                            <select 
                                name="sexo" 
                                id="sexo" 
                                className="w-full px-3 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-700" 
                                required 
                                defaultValue=""
                            >
                                <option value="" disabled>Selecione</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Masculino">Masculino</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className='w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md'>
                        Registar
                    </button>

                    <div className="text-center text-sm text-slate-600">
                        <p>Já tem uma conta?{' '}
                            <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
                                Faça login
                            </Link>
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}
