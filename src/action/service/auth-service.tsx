'use server'
// Aqui vamos utilizar um biblioteca chamada jose js ela cria um token JWT 
import * as jose from 'jose'
import { cookies } from 'next/headers'

export async function tokem_criptografado(token: string) {
    
    const secreto = new TextEncoder().encode(process.env.AUTH_SECRETA)
    const {payload} = await jose.jwtVerify(token,secreto)

    return payload

    
}

export async function criar_sessao(payload = {}) {

    const secreto = new TextEncoder().encode(process.env.AUTH_SECRETA)
    const sessao = await new jose.SignJWT(payload)
        .setProtectedHeader({
            alg:'HS256',
        })
        .setExpirationTime('1d')
        .sign(secreto)
    const{exp} = await tokem_criptografado(sessao)
    
    const cookiesStore = await cookies()
    cookiesStore.set('sessao',sessao,{
        expires:(exp as number)*1000,
        path:'/',
        httpOnly: true
    });
}




export async function estavalidado() {

    const sessaofinal = (await cookies()).get('sessao')
    
    if(sessaofinal ){
        const {value} = sessaofinal
        const { exp } = await tokem_criptografado(value)
        const currentDate = new Date().getTime()

        return ((exp as number)*1000) > currentDate
    }

    return false
}

export async function  destroisessao(){
    const cookieStore = await cookies();
    cookieStore.delete('sessao');
}


