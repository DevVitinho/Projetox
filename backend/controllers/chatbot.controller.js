const Service = require('../models/Service');

// Função utilitária para respostas automáticas expandidas
function respostaAutomatica(pergunta) {
  const p = pergunta.toLowerCase();

  if (p.match(/(trocar|consertar|arrumar).*torneira/)) {
    return 'Para trocar uma torneira, feche o registro de água, desrosqueie a antiga, limpe a rosca e instale a nova com fita veda-rosca.';
  }
  if (p.match(/(ligar|instalar).*torneira/)) {
    return 'Para instalar uma torneira, encaixe a peça na rosca, use fita veda-rosca e aperte bem. Abra o registro para testar.';
  }
  if (p.match(/(ajuda|encontrar|achar|procurar|preciso).*servi[cç]o/)) {
    return 'Me diga o tipo de serviço que você procura (ex: eletricista, encanador, limpeza) e vou sugerir opções!';
  }
  if (p.match(/(eletricista|elétrica|energia|tomada|luz)/)) {
    return 'Para serviços elétricos, procure um profissional qualificado. Nunca tente mexer em fios energizados sem conhecimento.';
  }
  if (p.match(/(limpeza|faxina|diarista)/)) {
    return 'Para contratar serviços de limpeza, busque por "limpeza" ou "diarista" na busca de serviços.';
  }
  if (p.match(/(pintor|pintura)/)) {
    return 'Para pintar uma parede, proteja o chão, lixe a superfície, aplique massa corrida se necessário e pinte com rolo ou pincel.';
  }
  if (p.match(/(reforma|pedreiro|obra)/)) {
    return 'Para reformas, descreva o que precisa (ex: trocar piso, construir parede) e busque por "pedreiro" ou "reforma".';
  }
  if (p.match(/(manutenção|conserto|consertar)/)) {
    return 'Para manutenção, informe o que precisa consertar (ex: torneira, tomada, porta) para que eu sugira profissionais.';
  }
  if (p.match(/(como funciona|explica|explicar|tutorial|passo a passo)/)) {
    return 'Me pergunte sobre o serviço desejado, por exemplo: "Como trocar uma lâmpada?" ou "Como limpar ar-condicionado?"';
  }
  if (p.match(/(contato|telefone|whatsapp|email)/)) {
    return 'Os contatos dos profissionais aparecem ao clicar em "Ver detalhes" do serviço desejado.';
  }
  if (p.match(/(horário|disponibilidade|agenda)/)) {
    return 'Os horários e disponibilidade devem ser combinados diretamente com o profissional após encontrar o serviço.';
  }
  if (p.match(/(preço|valor|quanto custa|cobrança)/)) {
    return 'Os preços variam conforme o serviço. Veja o valor na lista de serviços ou combine diretamente com o profissional.';
  }
  if (p.match(/(cadastro|cadastrar|registrar)/)) {
    return 'Para se cadastrar, clique em "Registrar" no topo do site e preencha seus dados.';
  }
  if (p.match(/(login|entrar|acessar)/)) {
    return 'Clique em "Login" no topo do site para acessar sua conta.';
  }
  if (p.match(/(obrigado|valeu|agradecido|agradeço)/)) {
    return 'De nada! Se precisar de mais alguma coisa, é só perguntar.';
  }
  if (p.match(/(oi|olá|bom dia|boa tarde|boa noite)/)) {
    return 'Olá! Como posso te ajudar hoje?';
  }
  return 'Desculpe, não entendi sua pergunta. Tente ser mais específico ou pergunte sobre um serviço.';
}

// POST /api/chatbot
exports.chat = async (req, res) => {
  console.log('Requisição recebida no chatbot:', req.body);
  const { mensagem, categoria } = req.body;
  if (!mensagem) {
    return res.status(400).json({ resposta: 'Envie uma mensagem para o chatbot.' });
  }

  // Se a mensagem for para sugerir serviços do mesmo ramo
  if (categoria) {
    try {
      const similares = await Service.find({ category: categoria }).limit(3);
      if (similares.length > 0) {
        return res.json({
          resposta: 'Veja outros serviços do mesmo ramo:',
          sugestoes: similares.map(s => ({ nome: s.title, id: s._id, descricao: s.description }))
        });
      }
    } catch (e) {
      console.error('Erro ao buscar serviços similares:', e);
    }
  }

  // Só respostas automáticas
  try {
    const resposta = respostaAutomatica(mensagem);
    res.json({ resposta });
  } catch (err) {
    console.error('Erro ao gerar resposta automática:', err);
    res.status(500).json({ resposta: 'Erro interno no chatbot.' });
  }
}; 