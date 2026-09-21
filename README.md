# PilatesLib

Biblioteca digital de exercícios de Pilates, estruturada com lógica clínica para apoiar o estudo e o raciocínio clínico de estudantes e profissionais de Fisioterapia/Pilates — construída do zero, da documentação ao deploy.

Diferente de uma lista simples de exercícios com vídeos, cada exercício possui uma ficha técnica completa: execução, respiração, cues, erros comuns, indicações, precauções, contraindicações, músculos e articulações envolvidos, além de relações de progressão e regressão com outros exercícios.

> ⚠️ **Aviso importante:** esta ferramenta funciona como biblioteca de estudo e apoio ao raciocínio clínico. Ela **não realiza diagnóstico** e **não substitui a avaliação de um profissional de fisioterapia**.

## Screenshots

<!-- Adicione capturas de tela do projeto abaixo. Sugestões: Biblioteca com filtros aplicados, página de detalhe de um exercício, formulário de cadastro na área administrativa, e a visualização mobile com o menu aberto. -->

| Biblioteca | Detalhe do exercício |
|---|---|
| _(screenshot aqui)_ | _(screenshot aqui)_ |

| Área administrativa | Mobile |
|---|---|
| _(screenshot aqui)_ | _(screenshot aqui)_ |

## Sobre o projeto

Este projeto nasceu de uma necessidade real: como estudante de Fisioterapia e de Ciência da Computação, eu queria uma ferramenta de estudo organizada com lógica clínica — não apenas uma lista de vídeos. Antes de escrever qualquer código, defini uma documentação completa (visão do produto, arquitetura, modelo de dados, casos de uso, requisitos funcionais e não funcionais) para guiar o desenvolvimento com decisões técnicas justificadas, não improvisadas.

## Funcionalidades

- **Busca e filtros combinados** — por texto, nível, equipamento, objetivo e região corporal, sincronizados com a URL (permitindo compartilhar/salvar uma busca específica)
- **Ficha clínica completa** — execução, cues, erros comuns, indicações, precauções, contraindicações, músculos e articulações
- **Progressões e regressões** — exercícios relacionados entre si, com inferência automática de direção (se A é progressão de B, o sistema já sabe que B é regressão de A, sem duplicar dados)
- **Upload de imagens** — com conversão automática para WebP no navegador (canvas API) antes do envio, reduzindo custo de armazenamento e tempo de carregamento
- **Autenticação e permissões** — administradores cadastram/editam/excluem conteúdo; usuários comuns pesquisam e visualizam, tudo reforçado por Row Level Security no banco
- **Gerenciamento de categorias** — equipamento, objetivo, região corporal, músculos e articulações, via interface própria, sem precisar mexer em SQL
- **Responsivo** — com prioridade mobile, incluindo menu hambúrguer

## Stack e decisões técnicas

| Camada | Tecnologia | Por quê |
|---|---|---|
| Front-end | React + TypeScript + Vite | Tipagem estática reduz bugs; Vite acelera o ciclo de desenvolvimento |
| Estilização | TailwindCSS v4 | Agilidade para uma interface limpa sem escrever CSS extenso |
| Roteamento | React Router | Navegação client-side entre biblioteca, detalhe e área administrativa |
| Dados/cache | TanStack React Query | Cache, invalidação e sincronização de dados assíncronos com o Supabase |
| Back-end / Banco de dados | Supabase (PostgreSQL, Auth, Storage) | Banco relacional gerenciado, autenticação e storage prontos, plano gratuito viável para um projeto inicial |
| Hospedagem | Netlify | Deploy contínuo integrado ao GitHub, gratuito |

A arquitetura evita um back-end tradicional: o Supabase gera uma API REST diretamente a partir do schema do PostgreSQL, com regras de acesso (RLS) aplicadas no próprio banco — reduzindo superfície de código customizado a manter.

## Rodando localmente

**Pré-requisitos:** Node.js instalado.

```bash
git clone <url-do-repositorio>
cd pilateslib
npm install
```

Crie um arquivo `.env` na raiz do projeto com as chaves do seu próprio projeto Supabase:

```
VITE_SUPABASE_URL=sua_project_url
VITE_SUPABASE_ANON_KEY=sua_publishable_key
```

Rode o projeto:

```bash
npm run dev
```

## Estrutura do banco de dados

O projeto usa PostgreSQL (via Supabase) com:
- Tabelas de taxonomia (`equipment`, `objectives`, `body_regions`, `muscles`, `joints`)
- Tabela principal `exercises`, com soft delete
- Tabelas de associação N:N (`exercise_muscles`, `exercise_joints`, `exercise_progressions` — esta última autorreferenciada, formando um grafo de progressão/regressão)
- Row Level Security (RLS) controlando acesso por papel (admin/usuário)
- Storage bucket para imagens dos exercícios, com políticas próprias de leitura/escrita

## Roadmap

- [ ] Sistema de favoritos
- [ ] Acessibilidade (contraste, textos alternativos, navegação por teclado)
- [ ] Estados de carregamento com mais polimento visual
- [ ] Migração do banco para a região São Paulo (redução de latência)

Funcionalidades futuras mais distantes: montagem de sequências de exercícios (apoio à decisão, não prescrição automática), módulo de avaliação e evolução do paciente, PWA/app.

## Aviso legal

Este projeto é uma biblioteca de estudo e apoio ao raciocínio clínico. Não realiza diagnóstico, não prescreve exercícios automaticamente e não substitui a avaliação individual de um profissional de fisioterapia qualificado.
