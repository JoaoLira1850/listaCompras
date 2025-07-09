import { NextRequest, NextResponse } from "next/server";
import { estavalidado } from "./action/service/auth-service";

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico).*)'   
}

const rotasnext = ['/','/componentes/Tela_login','/componentes/Tela_cadastro','/user']

export async function middleware(req: NextRequest ){
    
    const pathname = req.nextUrl.pathname

    if(rotasnext.includes(pathname)){  
        return NextResponse.next();
    }
    
    const sessao = await estavalidado();// validar a sesao da JWT

    if (!sessao){
        return NextResponse.redirect(new URL('/componentes/Tela_login',req.url))
    }

    return NextResponse.next()
}