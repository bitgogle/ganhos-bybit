# Ganhos Bybit - Plataforma de Investimentos

Plataforma completa de investimentos em criptomoedas com painel administrativo.

## 🌟 Funcionalidades Principais

### Para Usuários (Interface em Português):
- ✅ **Landing Page** atraente com informações sobre planos de investimento
- ✅ **Sistema de Cadastro** com aprovação administrativa
- ✅ **Dashboard Completo** com:
  - Visualização de saldo e estatísticas
  - Planos de investimento (R$ 200 a R$ 5.000)
  - Sistema de depósitos via PIX, Bybit UID e USDT
  - Sistema de saques com taxas configuráveis
  - Histórico completo de transações
  - Notificações em tempo real
- ✅ **Estados de Conta**:
  - Pendente de aprovação
  - Aprovada/Ativa
  - Rejeitada

### Para Administradores:
- ✅ **Painel Administrativo Completo**:
  - Dashboard com estatísticas em tempo real
  - Gestão de usuários (aprovar/rejeitar cadastros)
  - Gestão de transações (aprovar/rejeitar depósitos e saques)
  - Configurações da plataforma (PIX, Bybit UID, USDT)
  - Configuração de taxas de saque

## 🔐 Acesso Administrativo

Consulte o arquivo `ADMIN_SETUP.md` para instruções de configuração do administrador.

## 💳 Planos de Investimento

- Investimentos de R$ 200 a R$ 5.000 em incrementos de R$ 100
- Lucro: R$ 20 para cada R$ 100 investidos (a cada 3 horas)
- Duração personalizável: 1 a 7 dias
- 8 distribuições de lucro por dia

## 🎨 Design

- **Cores principais**: Preto (#0a0a0a) e Dourado (#f7931a)
- **Tema**: Dark mode elegante e profissional
- **Responsivo**: Totalmente adaptável para mobile, tablet e desktop
- **Animações**: Transições suaves e efeitos visuais modernos

## 📱 Páginas da Aplicação

1. **/** - Landing page pública
2. **/login** - Login de usuários e admin
3. **/register** - Cadastro de novos usuários
4. **/dashboard** - Dashboard do usuário (requer login)
5. **/pending-approval** - Página de aguardo de aprovação
6. **/rejected** - Página de cadastro rejeitado
7. **/admin** - Painel administrativo (requer login admin)
8. **/fee-payment/:id** - Página de pagamento de taxa

## 🔄 Fluxo de Usuário

1. **Cadastro**: Usuário se cadastra com dados pessoais
2. **Pendente**: Conta fica pendente de aprovação administrativa
3. **Aprovação**: Admin aprova ou rejeita o cadastro
4. **Dashboard**: Usuário acessa dashboard e visualiza planos
5. **Depósito**: Usuário solicita depósito via PIX/Bybit/USDT
6. **Aprovação de Depósito**: Admin aprova o depósito
7. **Investimento Ativo**: Saldo é creditado e começa a render
8. **Saque**: Usuário pode solicitar saque a qualquer momento
9. **Processamento**: Admin processa e aprova o saque

## 💾 Armazenamento de Dados

A aplicação utiliza **Supabase** para:
- Autenticação de usuários
- Banco de dados PostgreSQL
- Armazenamento de comprovantes
- Atualizações em tempo real

## 🛡️ Segurança

- Autenticação segura via Supabase Auth
- Controle de acesso baseado em roles (admin/user)
- Validação de dados com Zod
- Proteção de rotas sensíveis

## 📊 Tecnologias Utilizadas

- **React** - Framework UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn UI** - Componentes de UI
- **React Router** - Roteamento
- **React Context** - Gerenciamento de estado
- **Supabase** - Backend e autenticação
- **Lucide Icons** - Ícones
- **Vite** - Build tool

## 🚀 Como Testar

1. Acesse a landing page
2. Crie uma nova conta de usuário
3. Configure um admin (ver ADMIN_SETUP.md)
4. Faça login como admin para aprovar a conta
5. Volte ao login de usuário
6. Explore o dashboard e funcionalidades
7. Teste depósitos e saques
8. Aprove transações como admin

---

**Ganhos Bybit** - Plataforma de Investimentos em Criptomoedas
