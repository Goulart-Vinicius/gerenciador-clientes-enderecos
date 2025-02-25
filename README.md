# Mini Aplicação Web para Cadastro de Clientes e Endereços

Uma aplicação web responsiva para cadastro e gerenciamento de clientes e seus endereços. O projeto inclui uma tela de login com cadastro de usuários, telas para cadastro de clientes e endereços, e funcionalidades para upload e exportação do banco de dados em JSON, tudo rodando diretamente no navegador utilizando o plugin [AlaSQL.js](https://github.com/AlaSQL/alasql).

---

## Arquitetura

O projeto foi desenvolvido utilizando arquitetura MVC com a inclusão de controllers, da seguinte forma:

Fluxo Principal:

1. O arquivo HTML principal chama o app.js, que instancia os controllers necessários.
2. As rotas são configuradas no router, associando cada rota aos seus respectivos controllers. A rota /login é chamada inicialmente.
3. Cada Controller é responsável por:

- Instanciar sua view.
- Processar informações e interagir com o model para armazenar os dados no banco AlaSQL.
- Definir e iniciar os eventos (ex.: cliques de botões) após a renderização da view.

---

## Considerações Técnicas

### Por que não usar um servidor web?

O desafio não permitia o uso de tecnologias extras além das listadas. Assim, o projeto foi desenvolvido como uma SPA, implementando a arquitetura MVC com roteamento diretamente no front-end, sem necessidade de um servidor web.

### Por que não foi utilizado ESM (ECMAScript Modules).?

Ao iniciar o projeto com o protocolo file://, não é possível realizar requisições HTTP, pois o CORS bloqueia tais requisições vindas desse protocolo. Como o uso de import e export ES6 depende de requisições HTTP para carregamento dos módulos, optou-se por carregar todos os arquivos diretamente no index.html.

## Features

- **Tela de Login:**

  - Autenticação com usuário e senha.
  - Opção de configurações para upload de um banco de dados pré-populado via modal.

- **Tela de Cadastro:**

  - Cadastro de novos usuários diretamente na página (evitando duplicidade).

- **Cadastro de Clientes:**

  - Formulário para Cadastro de clientes.
  - Listagem e cadastro de clientes com os seguintes campos:
    - Nome Completo
    - CPF (com validação para não permitir duplicidade)
    - Data de Nascimento
    - Telefone
    - Celular
    - botão de alterar
    - botão de excluir
    - Botão de endereços

- **Cadastro de Endereços:**

  - Listagem e cadastro de endereços para cada cliente com os seguintes campos:
    - CEP
    - Rua
    - Bairro
    - Cidade
    - Estado
    - País
  - Cada cliente pode ter múltiplos endereços, sendo obrigatório marcar um como principal.

- **Exportação de Dados:**
  - Exportação do banco de dados no formato JSON para facilitar backups ou integrações.

---

## Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**
- **[AlaSQL.js](https://github.com/AlaSQL/alasql)** – Gerenciamento de banco de dados SQL no navegador.
- **jQuery** – Auxílio na manipulação do DOM e interatividade.
- **Bootstrap** – Desenvolvimento do front-end com design responsivo e mobile friendly.

---

## Pré-Requisitos

- **Navegador Web Moderno:** Recomenda-se utilizar a versão mais recente do Chrome, Firefox ou Edge.

---

## Instalação e Execução

1. **Clone o Repositório:**

   ```bash
    git clone https://github.com/seu-usuario/nome-do-repositorio.git
   ```

2. **Abra o Projeto:**

- Navegue até a pasta do projeto.
- Abra o arquivo index.html em seu navegador.

---

## Contato

Caso tenha dúvidas ou sugestões, entre em contato:

- [Email](goulart.vag@outloo.com)
- [Linkedin]()
- [GitHub]()

---

Sinta-se à vontade para contribuir ou sugerir melhorias!
