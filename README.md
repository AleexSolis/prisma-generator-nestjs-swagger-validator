<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://d31i9b8skgubvn.cloudfront.net/enterprises/company_profile/4215.PNG" width="200" alt="Nest Logo" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://prismalens.vercel.app/header/logo-dark.svg" width="200" alt="Nest Logo" /></a>
</p>

# prisma-generator-nestjs-swagger-validator

<hr/>

## Setup

- Install

  > `npm i prisma-generator-nestjs-swagger-validator`

- add to prisma schema

  ```javascript
  generator dto-generator {
    provider = "prisma-generator-nestjs-swagger-validator"
    output   = "../src/generated"
  }
  ```

## Custom validations

| Type         | Usage         |
| ------------ | ------------- |
| **Number**   |               |
| range values | length (3,50) |
| **Date**     |               |
|              |               |
| **Array**    |               |
|              |               |
| **Object**   |               |
|              |               |
| **String**   |               |
| length range | length (3,50) |
