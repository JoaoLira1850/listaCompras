import { NextResponse, type NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para lidar com requisições GET (Buscar produtos de uma lista)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Este 'id' é o ID da lista de compras

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

        // Adiciona o campo 'valorProd' calculado a cada produto antes de enviar a resposta
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

// Função para lidar com requisições PATCH (Editar um produto)
export async function PATCH(request: NextRequest) {
    // Extrai os parâmetros de busca da URL (ex: ?id=123)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'O ID do produto é obrigatório.' }, { status: 400 });
    }

    try {
        const productId = Number(id);
        const body = await request.json(); // Pega o corpo da requisição
        const { produto, Quantidade, preco } = body;

        // Validação básica dos dados recebidos
        if (!produto || Quantidade === undefined || preco === undefined) {
            return NextResponse.json({ error: 'Dados incompletos para atualização.' }, { status: 400 });
        }

        const updatedProduct = await prisma.listaProdutos.update({
            where: { id: productId },
            data: {
                produto: String(produto),
                Quantidade: Number(Quantidade),
                preco: parseFloat(preco),
                // A linha 'valorProd' foi removida pois não existe no schema do BD.
                // O valor é calculado na função GET.
            },
        });

        return NextResponse.json(updatedProduct, { status: 200 });

    } catch (error) {
        console.error("Erro no PATCH:", error);
        return NextResponse.json({ error: 'Falha ao atualizar o produto.' }, { status: 500 });
    }
}

// Função para lidar com requisições PUT (Marcar como comprado/desmarcar)
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

        // Alterna o estado de 'Comprado' (se for 1 vira 0, se for 0 vira 1)
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

// Função para lidar com requisições DELETE (Excluir um produto)
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
        // Retorna uma resposta de sucesso sem conteúdo
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Erro no DELETE:", error);
        return NextResponse.json({ error: 'Falha ao excluir o produto.' }, { status: 500 });
    }
}
