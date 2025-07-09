import { NextResponse, type NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function GET() {
    try {
        const produtos = await prisma.produtos_supermercado.findMany({
            orderBy: [
                { categoria: 'asc' },
                { produto: 'asc' },
            ],
        });
        return NextResponse.json(produtos, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return NextResponse.json({ error: 'Falha ao buscar os produtos.' }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { categoria, produto } = body;

        if (!categoria || !produto) {
            return NextResponse.json({ error: 'Categoria e produto são obrigatórios.' }, { status: 400 });
        }

        const newProduct = await prisma.produtos_supermercado.create({
            data: {
                categoria,
                produto,
            },
        });

        return NextResponse.json(newProduct, { status: 201 }); // 201 Created

    } catch (error) {
        console.error("Erro ao criar produto:", error);
        return NextResponse.json({ error: 'Falha ao criar o produto.' }, { status: 500 });
    }
}


export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, categoria, produto } = body;

        if (!id || !categoria || !produto) {
            return NextResponse.json({ error: 'ID, categoria e produto são obrigatórios.' }, { status: 400 });
        }

        const updatedProduct = await prisma.produtos_supermercado.update({
            where: { id: Number(id) },
            data: {
                categoria,
                produto,
            },
        });

        return NextResponse.json(updatedProduct, { status: 200 });

    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        return NextResponse.json({ error: 'Falha ao atualizar o produto.' }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'O ID do produto é obrigatório.' }, { status: 400 });
    }

    try {
        await prisma.produtos_supermercado.delete({
            where: { id: Number(id) },
        });

        return new NextResponse(null, { status: 204 }); 

    } catch (error) {
        console.error("Erro ao excluir produto:", error);
       
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
             return NextResponse.json({ error: 'Este produto não pode ser excluído pois já está em uso em uma ou mais listas de compras.' }, { status: 409 }); // 409 Conflict
        }

        return NextResponse.json({ error: 'Falha ao excluir o produto.' }, { status: 500 });
    }
}
