'use client'

import React from 'react';
import Link from 'next/link';
import { fazer_login } from '@/action/auth-action';

// --- Ícones como Componentes ---
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

// --- Componente da Página de Login ---
export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans p-4">
            <main className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <form action={fazer_login} className="space-y-6">
                    <h1 className="text-3xl font-bold text-slate-800 text-center">Bem-vindo!</h1>
                    
                    {/* Campo de Email */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <IconEmail />
                        </span>
                        <input
                            id='email'
                            name='email'
                            placeholder="E-mail"
                            type="email"
                            className="w-full pl-10 pr-3 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition placeholder:text-slate-400"
                            required
                        />
                    </div>

                    {/* Campo de Senha */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <IconLock />
                        </span>
                        <input
                            id='senha'
                            name='senha'
                            placeholder="Senha"
                            type="password"
                            className="w-full pl-10 pr-3 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition placeholder:text-slate-400"
                            required
                        />
                    </div>
                    
                    {/* Botão de Submit */}
                    <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
                        Entrar
                    </button>

                    {/* Link para alternar para Cadastro */}
                    <div className="text-center text-sm text-slate-600">
                        <p>Não tem uma conta?{' '}
                            <Link href="/cadastro" className="font-semibold text-indigo-600 hover:underline">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}
