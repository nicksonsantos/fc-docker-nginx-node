# Nginx como Proxy Reverso com Node.js

## Descrição
Projeto Docker + Docker Compose com:
- Nginx como proxy reverso (porta `8080`)
- Node.js (Express) como app
- MySQL como banco

Regras de negócio:
- A cada acesso em `http://localhost:8080`, o Node.js insere um nome na tabela `people`
- Retorna HTML com `<h1>Full Cycle Rocks!</h1>` e lista de nomes

## Estrutura
- `docker-compose.yml`
- `node/` (app Node.js)
- `nginx/nginx.conf`

## Execução
1. `docker compose up --build`
2. Acesse `http://localhost:8080`

> A primeira execução pode demorar alguns segundos para inicializar todos os containers.

## Observações
- Código auto-cria a tabela `people` no MySQL
- Não é necessário rodar `npm install` manualmente
- Volume obrigatório para o app Node.js: `./node:/usr/src/app`
