// Chatbot Widget - ProjetoX
(function() {
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
      <span><i class="fas fa-robot"></i> Assistente ProjetoX</span>
      <span class="close-btn" id="chatbot-close">&times;</span>
    </div>
    <div id="chatbot-messages"></div>
    <form id="chatbot-form" autocomplete="off">
      <input id="chatbot-input" type="text" placeholder="Digite sua dúvida..." autocomplete="off" />
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
    addMsg('Olá! Sou o assistente do ProjetoX. Pergunte sobre serviços, cadastro, valores ou como realizar tarefas!', 'bot');
    localStorage.setItem('chatbot-welcome', '1');
  }

  // Envio de mensagem
  form.onsubmit = async (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;
    addMsg(texto, 'user');
    input.value = '';
    addMsg('<i>Digitando...</i>', 'bot');
    try {
      const categoria = document.getElementById('category')?.value || '';
      const resp = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: texto, categoria })
      });
      const data = await resp.json();
      mensagens.lastChild.querySelector('.chatbot-bubble').innerHTML = data.resposta;
      if (data.sugestoes) {
        data.sugestoes.forEach(s => {
          addMsg(`<b>${s.nome}</b>: ${s.descricao} <a href='/services/${s.id}' target='_blank'>Ver</a>`, 'bot');
        });
      }
    } catch {
      mensagens.lastChild.querySelector('.chatbot-bubble').innerHTML = 'Erro ao responder. Tente novamente.';
    }
  };
})(); 