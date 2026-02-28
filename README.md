# Clients API

API RESTful para gerenciamento de clientes.

---

## 📌 Objetivo

Implementar uma API RESTful com:

* Node.js
* MongoDB
* Docker
* Swagger/OpenAPI
* Boas práticas de arquitetura
* Versionamento estruturado
* Testes unitários

---

# 🚀 Tecnologias Utilizadas

* **Node.js 20**
* **NestJS**
* **MongoDB 7**
* **Mongoose**
* **Docker**
* **Docker Compose**
* **Jest**
* **Swagger (OpenAPI)**
* **nestjs-pino (logs estruturados)**

---

# 🏗 Arquitetura

Optei por **não aplicar Clean Architecture completa** (com camadas de domínio, use cases, interfaces de repositório, etc.) para este projeto.

 ### Motivo:

O escopo do desafio é relativamente simples (CRUD com regras de validação). Aplicar Clean Architecture completa adicionaria:

* Camadas extras
* Interfaces adicionais
* Complexidade estrutural desnecessária
* Aumento de boilerplate

Isso caracterizaria **overengineering** para o contexto do teste.

Em vez disso, utilizei a arquitetura modular padrão do NestJS, que já oferece:

* Separação clara de responsabilidades
* Testabilidade
* Escalabilidade
* Organização adequada para aplicações de médio porte

Caso o projeto evoluísse para um domínio mais complexo, com múltiplos agregados e regras de negócio sofisticadas, a adoção de Clean Architecture poderia ser considerada.

```
src/
 ├── app-config/        # Configuração e variáveis de ambiente
 ├── clients/           # Módulo principal de clientes
 ├── common/
 │     ├── filters/     # Filtros globais de exceção
 │     ├── pipes/       # Pipes customizados
 │     ├── validators/  # Validadores customizados
 │     └── types/       # Tipagens auxiliares
 └── main.ts
```

### Separação de responsabilidades:

* **Controller** → Camada HTTP
* **Service** → Regras de negócio
* **Schema** → Modelagem MongoDB
* **DTOs** → Validação e contrato da API
* **Filters** → Tratamento centralizado de erros
* **Pipes** → Validação de parâmetros
* **Config Module** → Gerenciamento de variáveis de ambiente

---

# 📦 Modelo de Cliente

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "document": "string (CPF)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

* `email` é único
* `document (CPF)` é único
* `createdAt` e `updatedAt` são gerados automaticamente

---

# 🔌 Rotas Disponíveis

| Método | Rota         | Descrição                     |
| ------ | ------------ | ----------------------------- |
| POST   | /clients     | Criar cliente                 |
| GET    | /clients     | Listar clientes com paginação |
| GET    | /clients/:id | Buscar por ID                 |
| PUT    | /clients/:id | Substituição completa         |
| PATCH  | /clients/:id | Atualização parcial           |
| DELETE | /clients/:id | Remover cliente               |

---

# 📘 Documentação Swagger

Após iniciar a aplicação:

```
http://localhost:3000/swagger
```

A documentação permite testar todas as rotas diretamente pela interface.

---

# ⚙️ Configuração de Variáveis de Ambiente

Antes de rodar o projeto, é necessário criar o arquivo `.env`.

Existe um arquivo de exemplo chamado `.env.example` na raiz do projeto.

## 📌 Passo obrigatório

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Depois, ajuste as variáveis se necessário.

As variáveis de ambiente são validadas na inicialização da aplicação utilizando **Joi**.
Caso alguma variável obrigatória não esteja definida, a aplicação não será iniciada.

---

# 🐳 Executando com Docker (Recomendado)

### 1️⃣ Build e start

```bash
docker-compose up --build
```

A aplicação estará disponível em:

```
http://localhost:3000
```

Swagger:

```
http://localhost:3000/swagger
```

---

# 💻 Executando Localmente (Sem Docker)

### 1️⃣ Instalar dependências

```bash
npm install
```

### 2️⃣ Rodar MongoDB localmente

Você pode:
* Rodar uma instância local
* Ou subir apenas o container do MongoDB via Docker

### 3️⃣ Rodar aplicação

```bash
npm run start:dev
```

---

# 🧪 Testes Unitários

Foram implementados testes unitários para:

* ClientsService
* ClientsController
* AppConfigService
* GlobalExceptionFilter
* MongoExceptionFilter
* ParseObjectIdPipe
* CPF Validator

### Executar testes:

```bash
npm run test
```

---

# 🛡 Validações Implementadas

* Validação de DTO com `class-validator`
* `whitelist` e `forbidNonWhitelisted`
* CPF validator customizado
* Email válido
* Paginação validada
* Validação de ObjectId
* Tratamento de erro para chave duplicada (Mongo error 11000)

---

# 📊 Logs

A aplicação utiliza **nestjs-pino** para logs estruturados:

* Logs HTTP automáticos
* Logs de service
* Logs de erro estruturados
* Pretty print em ambiente de desenvolvimento

---

# 🧠 Decisões Técnicas

* **NestJS** foi escolhido por sua arquitetura modular e suporte nativo a boas práticas.
* **Mongoose** foi utilizado para modelagem e validação no nível do banco.
* **DTOs + ValidationPipe global** garantem contrato forte da API.
* **Exception Filters globais** centralizam tratamento de erros.
* **Logger estruturado** melhora observabilidade.
* **Docker Compose** garante ambiente reprodutível.
* **Paginação server-side** melhora escalabilidade.
* **Separação clara de camadas** facilita manutenção e testes.

---

# 🤖 Uso de Inteligência Artificial

Ferramentas de IA foram utilizadas como apoio para:

* Revisão de código
* Sugestões de melhorias arquiteturais
* Validação de boas práticas

Todas as decisões técnicas, implementação, estrutura e validações foram compreendidas e aplicadas conscientemente.

O código foi revisado manualmente e pode ser explicado detalhadamente em entrevista técnica.

---

# 📈 Diferenciais Implementados

✔ Logs estruturados
✔ Filtros globais de exceção
✔ Validação robusta
✔ Paginação com cálculo de última página
✔ Tratamento específico de erro de duplicidade do MongoDB
✔ Testes unitários
✔ Configuração validada com Joi
✔ Docker completo com persistência de dados
