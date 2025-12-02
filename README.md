# Ganhos Bybit - Plataforma de Investimentos em Criptomoedas

Uma plataforma completa de investimentos em criptomoedas com painel administrativo e dashboard de usuário.

## 🌟 Funcionalidades

### Para Usuários:
- Landing page com informações sobre planos de investimento
- Sistema de registro com aprovação administrativa
- Dashboard completo com visualização de saldo e estatísticas
- Planos de investimento de R$ 200 a R$ 5.000
- Sistema de depósitos via PIX, Bybit UID e USDT
- Sistema de saques com taxas configuráveis
- Histórico completo de transações
- Notificações em tempo real

### Para Administradores:
- Painel administrativo completo
- Dashboard com estatísticas em tempo real
- Gestão de usuários (aprovar/rejeitar/restringir)
- Gestão de transações (aprovar/rejeitar depósitos e saques)
- Configurações da plataforma (PIX, Bybit UID, USDT)
- Configuração de taxas de saque

## 📱 Como editar este código

### Usando seu IDE preferido

Clone o repositório e faça suas alterações localmente.

O único requisito é ter Node.js e npm instalados - [instale com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Siga estes passos:

```sh
# Passo 1: Clone o repositório
git clone <YOUR_GIT_URL>

# Passo 2: Navegue para o diretório do projeto
cd <YOUR_PROJECT_NAME>

# Passo 3: Instale as dependências
npm i

# Passo 4: Inicie o servidor de desenvolvimento
npm run dev
```

### Editar arquivo diretamente no GitHub

- Navegue até o(s) arquivo(s) desejado(s).
- Clique no botão "Edit" (ícone de lápis) no canto superior direito da visualização do arquivo.
- Faça suas alterações e confirme.

### Usar GitHub Codespaces

- Navegue até a página principal do seu repositório.
- Clique no botão "Code" (botão verde) perto do canto superior direito.
- Selecione a aba "Codespaces".
- Clique em "New codespace" para iniciar um novo ambiente Codespace.
- Edite arquivos diretamente no Codespace e confirme suas alterações quando terminar.

## 🛠️ Tecnologias utilizadas

Este projeto é construído com:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (autenticação e banco de dados)

## 🚀 Como fazer deploy

### Deploy no Vercel

Este projeto inclui um workflow de GitHub Actions para deploy automático no Vercel. Para configurar:

1. **Crie uma conta Vercel** em [vercel.com](https://vercel.com) se ainda não tiver uma.

2. **Vincule seu projeto ao Vercel**:
   - Vá para o dashboard do Vercel e clique em "Add New Project"
   - Importe este repositório GitHub
   - Configure as configurações do projeto (elas devem ser detectadas automaticamente de `vercel.json`)

3. **Configure Variáveis de Ambiente no Vercel**:
   Vá para as Configurações do seu projeto Vercel > Environment Variables e adicione:
   - `VITE_SUPABASE_URL` - Sua URL do Supabase
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Sua chave anon do Supabase
   - `VITE_SUPABASE_PROJECT_ID` - ID do seu projeto Supabase

4. **Obtenha suas credenciais do Vercel para GitHub Actions**:
   - **VERCEL_TOKEN**: Vá para Vercel Settings > Tokens > Create Token
   - **VERCEL_ORG_ID**: Encontrado em Vercel Settings > General > Your ID
   - **VERCEL_PROJECT_ID**: Encontrado em Settings do seu projeto > General > Project ID

5. **Adicione GitHub Secrets**:
   Vá para Settings > Secrets and variables > Actions do seu repositório GitHub, e adicione:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

6. **Deploy**: 
   - Faça push para a branch `main` para deploy automático
   - Ou vá para a aba Actions e dispare manualmente o workflow "Deploy to Vercel Production"

## 🌐 Conectar um domínio personalizado

Para conectar um domínio, navegue até o dashboard do Vercel > seu projeto > Settings > Domains e clique em Add Domain.
