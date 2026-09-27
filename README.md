# FinChat — Finanças pessoais por conversa

Este projeto nasceu em um desafio da DIO sobre Vibe Coding. A proposta inicial era imaginar uma forma mais simples de registrar gastos e acompanhar a vida financeira: em vez de começar por formulários e planilhas, começar por uma conversa.

O protótipo foi desenvolvido com apoio de ferramentas generativas e acabou indo além do PRD inicial. Hoje existe uma aplicação frontend funcional em React e TypeScript.

Ainda não é um aplicativo financeiro completo, mas também não é mais apenas uma ideia no papel.

## O que funciona hoje

O FinChat tem:

- onboarding simples;
- chat para registrar despesas por frases como `gastei 50 reais no almoço`;
- classificação de gastos por categorias;
- consulta de gastos do mês e por categoria;
- dashboard com saldo, receitas, despesas e gráfico por categoria;
- criação e acompanhamento de metas financeiras;
- atalhos para perguntas comuns;
- interface responsiva pensada principalmente para celular.

O estado financeiro é compartilhado entre as telas usando React Context.

## O que o "assistente" realmente faz

Esta parte é importante.

O chat atual **não usa um modelo de IA** para interpretar as mensagens. Ele funciona com regras locais, palavras-chave e expressões regulares.

Quando alguém escreve algo como:

```text
gastei 35 reais no almoço
```

o programa tenta identificar o valor e a descrição. Depois classifica a despesa procurando palavras relacionadas a categorias como alimentação, transporte, lazer, saúde e moradia.

Perguntas como `quanto gastei esse mês?`, `onde gastei?` e `ver metas` também são tratadas por regras definidas no frontend.

Isso limita a flexibilidade da conversa, mas deixa claro o que o protótipo consegue fazer sem fingir que existe uma IA por trás quando ainda não existe.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui / Radix UI
- Framer Motion
- Recharts
- React Router
- React Context

## Como executar

Você precisa ter Node.js e npm instalados.

```bash
git clone https://github.com/azenhasoft/chat-financeiro-pessoal.git
cd chat-financeiro-pessoal
npm install
npm run dev
```

O Vite inicia o ambiente de desenvolvimento e mostra no terminal o endereço local da aplicação.

## Estado atual dos dados

Nesta versão, novas sessões começam sem transações e sem metas fictícias pré-carregadas.

Os dados ainda ficam apenas na memória da aplicação. Se a página for recarregada, transações, metas e nome do usuário são perdidos.

Isso é uma das principais coisas que quero resolver na próxima etapa.

O orçamento mensal de R$ 3.000 ainda existe como um valor fixo no código e também deverá se tornar configurável.

## Limitações

O projeto ainda não possui:

- persistência dos dados;
- backend ou banco de dados;
- autenticação;
- integração bancária;
- integração com um modelo de linguagem;
- configuração real do orçamento mensal;
- edição e exclusão de transações;
- testes automatizados.

A tela de configurações também ainda é apenas um placeholder.

As dicas apresentadas pelo chat são exemplos educativos predefinidos. Elas não analisam a situação financeira individual do usuário e não devem ser tratadas como aconselhamento financeiro profissional.

## Próximos passos

- [x] remover transações e metas fictícias da sessão inicial
- [x] fazer consultas de "este mês" considerarem a data das transações
- [x] deixar claro que o chat atual funciona por regras
- [ ] salvar dados localmente entre sessões
- [ ] permitir registrar receitas pelo chat
- [ ] permitir editar e excluir transações
- [ ] tornar o orçamento mensal configurável
- [ ] melhorar a criação e atualização de metas
- [ ] adicionar testes para interpretação e cálculos
- [ ] avaliar integração com um modelo de linguagem

Se eu adicionar IA ao chat, quero manter uma separação simples: o modelo pode ajudar a entender o que a pessoa quis dizer, mas valores, saldo e cálculos devem continuar sendo tratados pelo código da aplicação.

## Sobre o processo

O projeto começou como exercício de Vibe Coding, então ferramentas de IA fizeram parte da construção do protótipo desde o início.

Para mim, a parte mais interessante agora é justamente ir na direção contrária ao "gerar e esquecer": abrir o código, entender o que foi criado, corrigir o que não faz sentido e continuar desenvolvendo a partir dali.

É também por isso que mantenho este repositório. Ele registra não apenas o resultado de um desafio, mas o processo de transformar um protótipo assistido por IA em um projeto que eu consiga explicar e evoluir.
