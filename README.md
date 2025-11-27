# Comida di Buteco - Frontend

Frontend da plataforma Comida di Buteco - Interface web para planejamento de rotas gastronômicas em Belo Horizonte.

## 📋 Pré-requisitos

### Instalar Node.js

**Node.js 18+** é necessário para executar o projeto.

#### Opção 1: Instalador Oficial

- Download: [https://nodejs.org/](https://nodejs.org/) (recomendado: versão LTS)

#### Opção 2: Via nvm (Node Version Manager)

```bash
# Linux/macOS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Windows: https://github.com/coreybutler/nvm-windows
```

**Documentação oficial do Node.js**: [https://nodejs.org/docs/](https://nodejs.org/docs/)

## 🚀 Início Rápido

### Passo a Passo Completo

#### 1. Clone o repositório

```bash
git clone https://github.com/gabriellivalelia/comp-evol-tp1-frontend
cd comp-evol-tp1-frontend
```

#### 2. Instalar dependências

```bash
npm install
```

#### 3. Configurar variáveis de ambiente

O projeto pode utilizar um arquivo `.env` na raiz para definir a URL da API backend.

- `VITE_API_URL` é usado pelo frontend para apontar para a API do backend. Por padrão:

```
VITE_API_URL=http://localhost:5000
```

Como usar:

```bash
cp .env.example .env
```

**Nota**: Certifique-se de que o backend está rodando na porta 5000.

#### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em: `http://localhost:5173`

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento (Vite)
```

## 🌐 Integração com Backend

O frontend consome a API REST do backend Comida di Buteco:

**Base URL (desenvolvimento)**: `http://localhost:5000`

## 📖 Links Úteis

- **Documentação do React**: [https://react.dev/](https://react.dev/)
- **Documentação do Vite**: [https://vitejs.dev/](https://vitejs.dev/)
- **Documentação do React Router**: [https://reactrouter.com/](https://reactrouter.com/)
- **Documentação do Zustand**: [https://zustand-demo.pmnd.rs/](https://zustand-demo.pmnd.rs/)
- **Documentação do Material UI**: [https://mui.com/](https://mui.com/)

## 📄 Licença

Este projeto é parte do trabalho acadêmico da disciplina de Computação Evolucionária - UFMG 2025.2
