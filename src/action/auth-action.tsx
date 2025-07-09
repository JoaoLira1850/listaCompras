'use server'

import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'
import { redirect } from "next/navigation";
import { criar_sessao } from "./service/auth-service";




const prisma = new PrismaClient();


export async function criarConta(formData: FormData) {
    
    
    
    const nome = formData.get('nome') as string;
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const sexo = formData.get('sexo') as string
    const data = formData.get('data') as string
    
    const hashPassword = await bcrypt.hash(password,10);
    
    
    await prisma.usuario.create({
        data: {
    
            nome,
            email,
            password: hashPassword,
            sexo,
            dataCriada: new Date(data)
        },
    }); 

    redirect('/componentes/Tela_login')
    
}

export async function fazer_login(formData:FormData) {
    

    const email = formData.get ('email') as string
    const senha = formData.get ('senha') as string

    const user = await prisma.usuario.findFirst({
        where:{
            email,
            
        }
    });

    if (!user){
        console.log("Usuario não cadastrado")
        redirect('/componentes/Tela_login')
    }

    const acesso = await bcrypt.compare(senha, user?.password)

    if (!acesso){
        console.log('Erro na Senha ou Email')
        redirect('/componentes/Tela_login')

    }

    // sessão JWT

    await criar_sessao({nome: user.nome,email: user.email})

    redirect('/componentes/Tela_inicial')
    
}

