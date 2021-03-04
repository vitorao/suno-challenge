### Link POSTMAN dos Endpoints e exemplos de requisições
https://www.getpostman.com/collections/b55431ece910e2fb7552

### Arquitetura da API
```
├── package.json
├── package-lock.json
├── src
│   ├── app.ts
│   ├── controllers // define as regras de cada endpoint
│   │   └── timeRules // valida as regras de cadastro
│   │       ├── checkTimeConflicts
│   │       │   ├── checkTimeConflicts.spec.ts
│   │       │   ├── checkTimeConflicts.ts
│   │       │   └── index.ts
│   │       ├── fixtures.ts
│   │       ├── ITimeRulesRoutes.ts
│   │       ├── timeRulesController.spec.ts
│   │       └── timeRulesController.ts
│   ├── decorators //declaradores do decorators utilizados
│   ├── models // arquivo json e regras de registro do arquivo
│   │   ├── database.json
│   │   └── timeRules
│   │       └── timeRules.ts
│   ├── routes // declaração das rotas através dos decorators
│   │   ├── constructorList.ts
│   │   ├── index.ts
│   │   └── routes.ts
│   └── server.ts
└── tsconfig.json

 ```
 
 ### Executanto a API
Instalar os pacotes npm
```sh
$ npm install
```
Executar em modo de desenvolvimento
```sh
$ npm run dev
```

### Testes
Para executar os testes do controller e da validação do cadastros das regras
```sh
$ npm run test
```

### Considerações
- A estrutura do projeto utiliza o modelo MVC ( Model, View e Controller ) porém sem a utilização de views;
- Criei uma estrutura com decorators para facilitar a visualização e organização do código, porém para produção é recomendado usar bibliotecas como NestJS
