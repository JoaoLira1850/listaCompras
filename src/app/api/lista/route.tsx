import { NextResponse, type NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function GET() {
    try {
        const listas = await prisma.listaCompras.findMany();
        return NextResponse.json(listas, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar listas:", error);
        return NextResponse.json({ error: 'Falha ao buscar as listas.' }, { status: 500 });
    }
}


export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, lista: newName } = body;

        
        if (!id || !newName) {
            return NextResponse.json({ error: 'ID e novo nome da lista são obrigatórios.' }, { status: 400 });
        }

        const updatedList = await prisma.listaCompras.update({
            where: { id: Number(id) },
            data: {
                lista: String(newName),
            },
        });

        return NextResponse.json(updatedList, { status: 200 });

    } catch (error) {
        console.error("Erro no PATCH:", error);
        return NextResponse.json({ error: 'Falha ao atualizar a lista.' }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'O ID da lista é obrigatório.' }, { status: 400 });
    }

    const listaId = Number(id);

    try {
        
        await prisma.$transaction([
            
            prisma.listaProdutos.deleteMany({
                where: { lista: listaId },
            }),
            
            prisma.listaCompras.delete({
                where: { id: listaId },
            }),
        ]);

        return new NextResponse(null, { status: 204 }); 

    } catch (error) {
        console.error("Erro no DELETE:", error);
        return NextResponse.json({ error: 'Falha ao excluir a lista e seus produtos.' }, { status: 500 });
    }
}
