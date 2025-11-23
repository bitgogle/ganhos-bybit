# Ganhos Bybit - Plataforma de Investimentos

Plataforma completa de investimentos em criptomoedas com painel administrativo.

## 🌟 Funcionalidades Principais

### Para Usuários (Interface em Português):
- ✅ **Landing Page** atraente com informações sobre planos de investimento
- ✅ **Sistema de Cadastro** com aprovação administrativa
- ✅ **Dashboard Completo** com:
  - Visualização de saldo e estatísticas
  - Planos de investimento (Iniciante, Profissional, Premium)
  - Sistema de depósitos via PIX
  - Sistema de saques com taxas configuráveis
  - Histórico completo de transações
- ✅ **Estados de Conta**:
  - Pendente de aprovação
  - Aprovada/Ativa
  - Rejeitada

### Para Administradores (Interface em Inglês):
- ✅ **Painel Administrativo Completo**:
  - Dashboard com estatísticas em tempo real
  - Gestão de usuários (aprovar/rejeitar cadastros)
  - Gestão de transações (aprovar/rejeitar depósitos e saques)
  - Edição de saldos de usuários
  - Configurações da plataforma (PIX, taxas, limites)

## 🔐 Acesso Administrativo

**Email:** admin@bybit.com  
**Senha:** admin123

## 💳 Planos de Investimento

### Plano Iniciante
- Investimento: R$ 100 - R$ 999
- Retorno diário: 1.5%
- Retorno mensal: até 45%

### Plano Profissional
- Investimento: R$ 1.000 - R$ 4.999
- Retorno diário: 2.0%
- Retorno mensal: até 60%

### Plano Premium
- Investimento: R$ 5.000+
- Retorno diário: 2.5%
- Retorno mensal: até 75%

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

## 🔄 Fluxo de Usuário

1. **Cadastro**: Usuário se cadastra com dados pessoais
2. **Pendente**: Conta fica pendente de aprovação administrativa
3. **Aprovação**: Admin aprova ou rejeita o cadastro
4. **Dashboard**: Usuário acessa dashboard e visualiza planos
5. **Depósito**: Usuário solicita depósito via PIX
6. **Aprovação de Depósito**: Admin aprova o depósito
7. **Investimento Ativo**: Saldo é creditado e começa a render
8. **Saque**: Usuário pode solicitar saque a qualquer momento
9. **Processamento**: Admin processa e aprova o saque

## 💾 Armazenamento de Dados

A aplicação utiliza **localStorage** do navegador para armazenar:
- Lista de usuários cadastrados
- Transações realizadas
- Configurações da plataforma
- Sessão do usuário logado

**Nota**: Para produção, recomenda-se integrar com Lovable Cloud/Supabase para persistência de dados real.

## 🎯 Próximos Passos Recomendados

Para transformar em uma aplicação de produção:

1. **Ativar Lovable Cloud** para backend real
2. **Criar tabelas no banco de dados**:
   - users
   - transactions
   - platform_settings
3. **Implementar autenticação real** com Supabase Auth
4. **Adicionar upload de comprovantes** de depósito
5. **Integrar API de pagamentos** (PIX real)
6. **Adicionar notificações por email**
7. **Implementar sistema de 2FA** para segurança

## 🛡️ Segurança

⚠️ **IMPORTANTE**: Esta é uma aplicação de demonstração. Para uso em produção:

- Não use senhas em texto plano
- Implemente hash de senhas (bcrypt)
- Use autenticação JWT ou OAuth
- Adicione validação de dados robusta
- Implemente rate limiting
- Use HTTPS obrigatoriamente
- Adicione logs de auditoria
- Configure CORS adequadamente

## 📊 Tecnologias Utilizadas

- **React** - Framework UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn UI** - Componentes de UI
- **React Router** - Roteamento
- **React Context** - Gerenciamento de estado
- **Lucide Icons** - Ícones
- **Vite** - Build tool

## 🚀 Como Testar

1. Acesse a landing page
2. Crie uma nova conta de usuário
3. Faça login como admin para aprovar
4. Volte ao login de usuário
5. Explore o dashboard e funcionalidades
6. Teste depósitos e saques
7. Aprove transações como admin

---

**Desenvolvido com Lovable** 💛
