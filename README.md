# Casa Alves Service

Core service responsável pela API da loja Casa Alves. Centraliza as regras de negócio, persistência de dados e integrações externas.

## Tecnologias

- **Node.js** com **TypeScript**
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **Drizzle ORM** - ORM para PostgreSQL
- **JWT** - Autenticação com JSON Web Tokens
- **Bcrypt** - Hash de senhas

## Variáveis de Ambiente

```env
- DATABASE_URL  // URL de conexão com o banco de dados PostgreSQL
- JWT_SECRET    // Chave secreta para assinatura dos tokens JWT
- PORT          // Porta em que o servidor irá rodar (padrão: 3000)
```

## Scripts

```bash
npm run dev         # Executa em modo desenvolvimento
npm run build       # Compila o projeto
npm start           # Executa em produção
npm run db:push     # Sincroniza o schema com o banco
npm run db:generate # Gera migrations
```

## Hospedagem

- Serviço hospedado na [Render](https://dashboard.render.com/)
    - https://casaalves-service.onrender.com/health
- Banco de dados PostgreSQL hospedado na [Neeon](https://console.neon.tech/app/)