import AutorizacaoSessao from "@/action/service/auth-service";
import { NextRequest, NextResponse } from "next/server";


export async function GET (red: NextRequest) {

    await AutorizacaoSessao.destroisessao();

    return NextResponse.redirect(new URL('/componentes/Tela_login',red.url))
    
    
}