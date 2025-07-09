import { NextResponse, type NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); 

    if (!id) {
        return NextResponse.json({ error: 'O ID da lista é obrigatório.' }, { status: 400 });
    }

    try {
        const listaId = Number(id);
        const produtos = await prisma.listaProdutos.findMany({
            where: {
                lista: listaId,
            },
        });

        
        const produtosComValorTotal = produtos.map(p => ({
            ...p,
            valorProd: p.Quantidade * p.preco,
        }));

        return NextResponse.json(produtosComValorTotal, { status: 200 });

    } catch (error) {
        console.error("Erro no GET:", error);
        return NextResponse.json({ error: 'Falha ao buscar os produtos.' }, { status: 500 });
    }
}


export async function PATCH(request: NextRequest) {
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'O ID do produto é obrigatório.' }, { status: 400 });
    }

    try {
        const productId = Number(id);
        const body = await request.json(); 
        const { produto, Quantidade, preco } = body;

        
        if (!produto || Quantidade === undefined || preco === undefined) {
            return NextResponse.json({ error: 'Dados incompletos para atualização.' }, { status: 400 });
        }

        const updatedProduct = await prisma.listaProdutos.update({
            where: { id: productId },
            data: {
                produto: String(produto),
                Quantidade: Number(Quantidade),
                preco: parseFloat(preco),
                
            },
        });

        return NextResponse.json(updatedProduct, { status: 200 });

    } catch (error) {
        console.error("Erro no PATCH:", error);
        return NextResponse.json({ error: 'Falha ao atualizar o produto.' }, { status: 500 });
    }
}


export async function PUT(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'O ID do produto é obrigatório.' }, { status: 400 });
    }
    
    const productId = Number(id);

    try {
        const currentProduct = await prisma.listaProdutos.findUnique({
            where: { id: productId },
        });

        if (!currentProduct) {
            return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
        }

        
        const newCompradoState = currentProduct.Comprado === 1 ? 0 : 1;

        const product = await prisma.listaProdutos.update({
            where: { id: productId },
            data: { Comprado: newCompradoState },
        });

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        console.error("Erro no PUT:", error);
        return NextResponse.json({ error: 'Falha ao marcar como comprado.' }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'O ID do produto é obrigatório.' }, { status: 400 });
    }

    const productId = Number(id);

    try {
        await prisma.listaProdutos.delete({
            where: { id: productId },
        });
       
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Erro no DELETE:", error);
        return NextResponse.json({ error: 'Falha ao excluir o produto.' }, { status: 500 });
    }
}
