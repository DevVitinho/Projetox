const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Função para encontrar serviços similares
async function findSimilarServices(searchTerm, category) {
    try {
        // Busca serviços que contenham o termo pesquisado no título ou descrição
        const services = await Service.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ],
            ...(category && { category: category })
        }).limit(5);

        return services.map(service => ({
            id: service._id,
            nome: service.title,
            descricao: service.description.substring(0, 100) + '...'
        }));
    } catch (error) {
        console.error('Erro ao buscar serviços similares:', error);
        return [];
    }
}

// Rota para processar mensagens do chatbot
router.post('/', async (req, res) => {
    try {
        const { mensagem, categoria } = req.body;
        
        // Extrai palavras-chave da mensagem
        const palavrasChave = mensagem.toLowerCase().split(' ');
        
        // Busca serviços similares
        const sugestoes = await findSimilarServices(mensagem, categoria);
        
        // Monta a resposta
        let resposta = '';
        if (sugestoes.length > 0) {
            resposta = `Encontrei ${sugestoes.length} serviços similares ao que você está procurando. Aqui estão algumas sugestões:`;
        } else {
            resposta = 'Não encontrei serviços exatamente como você descreveu, mas posso sugerir algumas alternativas:';
            // Busca serviços da mesma categoria
            const servicosCategoria = await findSimilarServices('', categoria);
            if (servicosCategoria.length > 0) {
                sugestoes.push(...servicosCategoria.slice(0, 3));
            }
        }

        res.json({
            resposta,
            sugestoes
        });
    } catch (error) {
        console.error('Erro no chatbot:', error);
        res.status(500).json({
            resposta: 'Desculpe, ocorreu um erro ao processar sua solicitação.',
            sugestoes: []
        });
    }
});

module.exports = router; 