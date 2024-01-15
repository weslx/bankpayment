
<h3 align="center">API de Pagamentos</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()

</div>


---

<p align="center"> Este é um projeto de estudo que abrange várias partes de uma API REST.
    <br> 
</p>

## 📝 Sumário

- [Sobre](#sobre)
- [Iniciando](#iniciando)
- [Implantação](#implantacao)
- [Uso](#uso)
- [Construído Usando](#construido-usando)
- [Autores](#autores)


## 🧐 Sobre <a name = "sobre"></a>

Este projeto possui algumas funções, tais como:
- Criar conta/Entrar na conta
- Depositar dinheiro
- Atualizar para logista
- Transferir dinheiro
- Conectar telegram
- Notificar usuario no telegram
Este projeto utiliza o Prisma para a conexão com o banco de dados.

## 🏁 Iniciando <a name = "iniciando"></a>

Estas instruções ajudarão você a obter uma cópia do projeto em execução em sua máquina local para desenvolvimento e testes.

### Pre-requisitos

Primeiramente precisamos clonar o repositorio:

``` bash
git clone https://github.com/weslx/bankpayment.git
```

### Instalando

Passos para configurar sua aplicação localmente:

``` bash
npm i
```
- Crie uma .env na raiz do projeto e coloque: 
- DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE" dentro dessa string coloque seu banco, dependendo do banco sera necessario alterar o arquivo .prisma/schema.prisma
- JWT_SECRET="" Sua senha de encriptação do jwt
- TELEGRAM_TOKEN= seu token do Bot Father
- SERVER_URL= link do server atual para webhook

O prisma ira mandar o schema para o banco com esse comando

``` bash
npx prisma db push
```

e aqui ele ja estara rodando

``` bash
npm run dev
```

## 🎈 Uso <a name="uso"></a>

Aqui estão algumas rotas que estão sendo desenvolvidas atualmente:

- `/criarusuario`: Cria um novo usuário.
- `/login`: Autentica um usuário existente.
- `/depositar`: Permite que um usuário faça um depósito.
- `/mudar-status`: Altera o status de um usuário.
- `/transferencia`: Permite que um usuário faça uma transferência.
- `/telegram`: Integração com o Telegram.
  
## 🚀 Implantação do Telegram <a name = "implantacao"></a>

1. Crie um bot no Bot Father
2. Envie o comando `/newbot` e siga as instruções para configurar o nome do bot, etc.
3. Após a criação do bot, copie a HTTP API fornecida pelo Bot Father.
4. Cole a HTTP API na variável apropriada no arquivo `.env` do seu projeto.


## ⛏️ Construído Usando <a name = "construido-usando"></a>

- [Prisma](https://www.prisma.io/) - Framework de Banco de Dados
- [Express](https://expressjs.com/) - Framework de Servidor
- [NodeJs](https://nodejs.org/en/) - Ambiente de Servidor

## ✍️ Autores <a name = "autores"></a>

- [@weslx](https://github.com/weslx)
