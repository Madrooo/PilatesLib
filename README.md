# PilatesLib

Biblioteca digital de exercícios de Pilates, estruturada com lógica clínica para apoiar o estudo e o raciocínio clínico de estudantes e profissionais de Fisioterapia/Pilates.

Diferente de uma lista simples de exercícios com vídeos, cada exercício aqui possui uma ficha técnica completa: execução, respiração, cues, erros comuns, indicações, precauções, contraindicações, músculos e articulações envolvidos, além de relações de progressão e regressão com outros exercícios.

> ⚠️ **Aviso importante:** esta ferramenta funciona como biblioteca de estudo e apoio ao raciocínio clínico. Ela **não realiza diagnóstico** e **não substitui a avaliação de um profissional de fisioterapia**.

## Funcionalidades

- **Busca e filtros combinados** — por texto, nível, equipamento, objetivo e região corporal, sincronizados com a URL
- **Ficha clínica completa** — execução, cues, erros comuns, indicações, precauções, contraindicações, músculos e articulações
- **Progressões e regressões** — exercícios relacionados entre si, com inferência automática de direção (se A é progressão de B, o sistema já sabe que B é regressão de A)
- **Upload de imagens** — com conversão automática para WebP no navegador antes do envio
- **Autenticação e permissões** — administradores cadastram/editam/excluem conteúdo; usuários comuns pesquisam e visualizam
- **Gerenciamento de categorias** — equipamento, objetivo, região corporal, músculos e articulações, sem precisar mexer em SQL
- **Responsivo** — com prioridade mobile, incluindo menu hambúrguer

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | React + TypeScript + Vite |
| Estilização | TailwindCSS v4 |
| Roteamento | React Router |
| Dados/cache | TanStack React Query |
| Back-end / Banco de dados | Supabase (PostgreSQL, Auth, Storage) |
| Hospedagem | Netlify |

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
- Tabelas de associação N:N (`exercise_muscles`, `exercise_joints`, `exercise_progressions`)
- Row Level Security (RLS) controlando acesso por papel (admin/usuário)
- Storage bucket para imagens dos exercícios

## Roadmap

- [ ] Sistema de favoritos
- [ ] Acessibilidade (contraste, textos alternativos, navegação por teclado)
- [ ] Estados de carregamento com mais polimento visual
- [ ] Migração do banco para a região São Paulo (redução de latência)

Funcionalidades futuras mais distantes: montagem de sequências de exercícios (apoio à decisão, não prescrição automática), módulo de avaliação e evolução do paciente, PWA/app.

## Aviso legal

Este projeto é uma biblioteca de estudo e apoio ao raciocínio clínico. Não realiza diagnóstico, não prescreve exercícios automaticamente e não substitui a avaliação individual de um profissional de fisioterapia qualificado.
