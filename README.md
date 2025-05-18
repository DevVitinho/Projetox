# Serviços+ (ProjetoX)

Sistema de marketplace de serviços desenvolvido com Node.js, Express e MongoDB.

## 🚀 Funcionalidades

- Cadastro e autenticação de usuários e empresas
- Cadastro e gerenciamento de serviços
- Upload de imagens para serviços
- Busca e filtro de serviços
- Interface moderna e responsiva

## 🛠️ Tecnologias

- Node.js
- Express
- MongoDB
- EJS (Template Engine)
- Bootstrap 5
- Multer (Upload de arquivos)

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- MongoDB
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd ProjetoX
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na raiz do projeto
- Adicione as seguintes variáveis:
```env
PORT=3000
MONGODB_URI=sua_url_do_mongodb
SESSION_SECRET=sua_chave_secreta
```

4. Inicie o servidor:
```bash
npm run dev
```

O projeto estará rodando em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
ProjetoX/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── public/
│   ├── routes/
│   ├── services/
│   └── app.js
├── frontend/
│   ├── public/
│   │   ├── css/
│   │   └── js/
│   └── views/
└── index.js
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 