# Casa Alves Service

API REST para gerenciamento do sistema Casa Alves.

## Tecnologias

- **Node.js** com **TypeScript**
- **Express** - Framework web
- **PostgreSQL** - Banco de dados ([Neon](https://console.neon.tech/app/))
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