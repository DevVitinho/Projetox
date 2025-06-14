// Chatbot Widget - Serviços+
(function() {
  // Respostas automáticas
  const respostasAutomaticas = {
    saudacoes: [
      'Olá! Como posso ajudar você hoje?',
      'Oi! Estou aqui para ajudar você a encontrar os melhores serviços.',
      'Olá! Que bom ter você aqui. Como posso ajudar?'
    ],
    duvidas: {
      'como funciona': 'O Serviços+ é uma plataforma que conecta pessoas que precisam de serviços com profissionais qualificados. Você pode buscar serviços por categoria, avaliar profissionais e agendar serviços diretamente pela plataforma.',
      'como cadastrar': 'Para se cadastrar, clique no botão "Cadastre-se" no topo da página. Você pode se cadastrar como pessoa física (para contratar serviços) ou como empresa (para oferecer serviços).',
      'como contratar': 'Para contratar um serviço, primeiro faça login, depois busque o serviço desejado, escolha o profissional e clique em "Contratar". Você poderá conversar com o profissional e agendar o serviço.',
      'como oferecer': 'Para oferecer serviços, cadastre-se como empresa, complete seu perfil, adicione os serviços que oferece e defina seus preços. Depois é só aguardar os clientes!',
      'preços': 'Os preços variam de acordo com cada profissional e serviço. Você pode ver os valores na página de cada serviço.',
      'pagamento': 'O pagamento é feito de forma segura através da nossa plataforma. Você só paga quando o serviço for concluído e aprovado.',
      'categorias': 'Temos várias categorias de serviços: Eletricista, Encanador, Designer, Mecânico, e muitas outras. Use o chatbot para encontrar serviços específicos!'
    },
    despedida: [
      'Até logo! Volte sempre que precisar.',
      'Foi um prazer ajudar! Até a próxima.',
      'Obrigado por usar o Serviços+. Volte sempre!'
    ]
  };

  // Função para verificar se a mensagem contém palavras-chave
  function verificarPalavrasChave(mensagem) {
    mensagem = mensagem.toLowerCase();
    
    // Verifica saudações
    if (mensagem.match(/^(oi|olá|ola|hey|hi|hello)$/i)) {
      return respostasAutomaticas.saudacoes[Math.floor(Math.random() * respostasAutomaticas.saudacoes.length)];
    }

    // Verifica despedidas
    if (mensagem.match(/^(tchau|adeus|até logo|bye)$/i)) {
      return respostasAutomaticas.despedida[Math.floor(Math.random() * respostasAutomaticas.despedida.length)];
    }

    // Verifica dúvidas específicas
    for (let [palavraChave, resposta] of Object.entries(respostasAutomaticas.duvidas)) {
      if (mensagem.includes(palavraChave)) {
        return resposta;
      }
    }

    return null;
  }

  // Cria o botão flutuante
  const botao = document.createElement('button');
  botao.id = 'chatbot-fab';
  botao.title = 'Abrir chat de ajuda';
  botao.innerHTML = '<i class="fas fa-comments"></i>';

  // Cria a janela do chat
  const chat = document.createElement('div');
  chat.id = 'chatbot-window';
  chat.style.display = 'none';
  chat.innerHTML = `
    <div id="chatbot-header">
      <span><i class="fas fa-plus-circle"></i> Assistente Serviços+</span>
      <span class="close-btn" id="chatbot-close">&times;</span>
    </div>
    <div id="chatbot-messages"></div>
    <form id="chatbot-form" autocomplete="off">
      <input id="chatbot-input" type="text" placeholder="Digite o serviço que procura ou faça uma pergunta..." autocomplete="off" />
      <button id="chatbot-send" type="submit"><i class="fas fa-paper-plane"></i></button>
    </form>
  `;

  document.body.appendChild(botao);
  document.body.appendChild(chat);

  // Funções de abrir/fechar
  botao.onclick = () => {
    chat.style.display = chat.style.display === 'none' ? 'flex' : 'none';
    if (chat.style.display === 'flex') {
      setTimeout(() => input.focus(), 200);
    }
  };
  chat.querySelector('#chatbot-close').onclick = () => {
    chat.style.display = 'none';
  };

  const mensagens = chat.querySelector('#chatbot-messages');
  const form = chat.querySelector('#chatbot-form');
  const input = chat.querySelector('#chatbot-input');

  // Adiciona mensagem ao chat
  function addMsg(msg, autor) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chatbot-msg ' + autor;
    // Avatar
    let avatar = '';
    if (autor === 'bot') {
      avatar = `<div class='chatbot-avatar'><i class="fas fa-robot"></i></div>`;
    } else {
      avatar = `<div class='chatbot-avatar' style='background:var(--accent-blue);'><i class="fas fa-user"></i></div>`;
    }
    msgDiv.innerHTML =
      (autor === 'bot' ? avatar : '') +
      `<div class='chatbot-bubble'>${msg}</div>` +
      (autor === 'user' ? avatar : '');
    mensagens.appendChild(msgDiv);
    mensagens.scrollTop = mensagens.scrollHeight;
  }

  // Mensagem de boas-vindas
  if (!localStorage.getItem('chatbot-welcome')) {
    addMsg('Olá! Sou o assistente do Serviços+. Posso ajudar você a encontrar serviços ou responder dúvidas sobre nossa plataforma. Como posso ajudar?', 'bot');
    localStorage.setItem('chatbot-welcome', '1');
  }

  // Envio de mensagem
  form.onsubmit = async (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;
    addMsg(texto, 'user');
    input.value = '';
    addMsg('<i>Processando...</i>', 'bot');

    try {
      // Verifica se é uma pergunta comum
      const respostaAutomatica = verificarPalavrasChave(texto);
      if (respostaAutomatica) {
        mensagens.lastChild.querySelector('.chatbot-bubble').innerHTML = respostaAutomatica;
        return;
      }

      // Se não for uma pergunta comum, busca serviços
      const categoria = document.getElementById('category')?.value || '';
      const resp = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: texto, categoria })
      });
      const data = await resp.json();
      mensagens.lastChild.querySelector('.chatbot-bubble').innerHTML = data.resposta;
      
      if (data.sugestoes && data.sugestoes.length > 0) {
        data.sugestoes.forEach(s => {
          const sugestaoDiv = document.createElement('div');
          sugestaoDiv.className = 'chatbot-sugestao';
          sugestaoDiv.innerHTML = `
            <div class="sugestao-titulo">${s.nome}</div>
            <div class="sugestao-desc">${s.descricao}</div>
            <a href="/services/${s.id}" class="sugestao-link" target="_blank">Ver serviço</a>
          `;
          mensagens.appendChild(sugestaoDiv);
        });
      } else {
        addMsg('Não encontrei serviços similares. Você pode tentar descrever o serviço de outra forma ou fazer uma pergunta sobre nossa plataforma.', 'bot');
      }
    } catch {
      mensagens.lastChild.querySelector('.chatbot-bubble').innerHTML = 'Desculpe, ocorreu um erro. Tente novamente ou faça uma pergunta sobre nossa plataforma.';
    }
  };
})(); 