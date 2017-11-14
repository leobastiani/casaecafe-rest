# Casa e café: REST API. Primeiro desafio.
Leonardo Guarnieri de Bastiani<br>
Primeiro desafio para a vaga de estágio na Casa e café. Uma aplicação REST desenvolvida em [Node.js](https://nodejs.org/en/download/).

## Como utilizar?
Tenha previamente instalado o [Node.js](https://nodejs.org/en/download/) e o [MongoDB](https://docs.mongodb.com/manual/installation/).

Execute o MongoDB com o comando `mongod`.

Em seguida, execute:
```sh
$ npm install
$ npm run seed
$ npm run start
```
Estes comando realizam os passos na sequência:
 * Instalam as dependências;
 * Alimenta o banco de dados com os valores padrões;
 * Executar o servidor.

## Detalhes do projeto
Este projeto se refere a um sistema de vendas com Produtos (ou Planos) e cadastra Pagamentos referente a eles.

O endereço do banco de dados foi `mongodb://localhost/casaecafe`

Duas rotas foram implementadas:

| Method | Rota      | Função                                                                          |
| ------ | ----      | ------                                                                          |
| GET    | /plans    | Recebe-se um JSON com todos os planos (produtos) cadastrados no banco de dados. |
| POST   | /payments | Pode-se cadastrar novos pagamentos.                                             |

Os dados que devem estar presentes no *POST /payments* estão apresentados na tabela a seguir. Todos os dados são obrigatórios e alguns possuem restrição de tipo e de valor.

| Header | Exemplo | Tipo de dado |
| ------ | ------- | ------------ |
| payment_date   | 2017-10-3 10:10:10 | Data e hora do pagamento |
| payment_type   | cartao de credito | Tipo de pagamento, pode ser apenas os tipos: "cartao de debito", "cartao de credito", "boleto bancario", "debito online" e "cartao internacional" |
| product        | gold_plan | Nome do produto (ou plano) referente ao pagamento. |
| product_price  | 59.9 | Preço do produto referente ao pagamento. Deve ser igual ao preço do produto cadastrado, caso contrário, um erro é retornado. |
| discount       | 50 | Valor do desconto em porcentagem. Deve ser correspondente ao preço pago em relação ao preço do produto cadastrado, caso contrário, um erro é retornado. O desconto não pode ser maior do que 50%, caso contrário, um erro é retornado. |
| price          | 29.95 | Preço pago pelo produto. Deve ser correspondente ao desconto em relação ao preço do produto cadastrado, caso contrário, um erro é retornado. |
| transaction_id | 123 | Um possível ID de uma tabela transação que não foi implementada. |

Caso um erro ocorra, um JSON é retornado da seguinte forma:
```javascript
{
    error: 1, // Código do erro
    message: 'Explicação do erro' // String que contém uma mensagem sobre o erro
}
```

Os possíveis erros de código estão listados a seguir:

| Nome | Código |
| ---- | ------ |
| ERROR.FIELD_REQUIRED           | 1 |
| ERROR.PRODUCT_NOT_FOUND        | 2 |
| ERROR.PRODUCT_FIELDS_NOT_MATCH | 3 |
| ERROR.DISCOUNT_NOT_MATCH       | 4 |
| ERROR.DISCOUNT_TOO_HIGH        | 5 |
| ERROR.FIELD_WRONG_TYPE         | 6 |
| ERROR.VALIDATOR                | 7 |
| ERROR.UNKNOWN                  | 0 |

##### Observação
Todos os campos de `POST /payments` devem ser informados e caso algum deles não seja consistente um erro é retornado.

## Exemplos
Retorno de requisição para `GET /plans`
```javascript
[
    {
        "product": "gold_plan",
        "price": "59.9",
        "description": "plano pago gold"
    },
    {
        "product": "platinum_plan",
        "price": "79.9",
        "description": "premium platinum"
    },
    {
        "product": "super_premium_plan",
        "price": "129.9",
        "description": "o melhor plano de todos"
    }
]
```
Retorno de requisição para `POST /payments`
```javascript
{
    "__v": 0,
    "payment_date": "2017-10-03T13:10:10.000Z",
    "payment_type": "cartao de credito",
    "product": "gold_plan",
    "product_price": "59.9",
    "discount": "50",
    "price": 29.95,
    "transaction_id": "asd",
    "_id": "5a0b67cab6885110603a533a"
}
```
