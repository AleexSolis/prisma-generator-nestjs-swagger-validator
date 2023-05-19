<p align="center">
  <a href="http://blackstone.studio" target="blank"><img src="https://d31i9b8skgubvn.cloudfront.net/enterprises/company_profile/4215.PNG" width="200" alt="Nest Logo" /></a>
  <a href="http://https://www.prisma.io/" target="blank"><img src="https://prismalens.vercel.app/header/logo-dark.svg" width="200" alt="Nest Logo" /></a>
</p>

# prisma-generator-nestjs-swagger-validator

<p>This packeges generates Dtos based in your prisma model, and optionally also can generate Nestjs modules with a basic CRUD code. </p>

## Setup

- Install

  `javascript npm i prisma-generator-nestjs-swagger-validator`

  <br/>

- add to prisma schema

  ```javascript
  generator dto-generator {
    provider = "prisma-generator-nestjs-swagger-validator"
    output   = "../src/generated"
  }
  ```

## Options

We can customize the code generation annotations.

- We can use annotations like this.

  ```javascript
    /// crud
    model User {
      id    Int    @id @default(autoincrement())
      /// email
      email String @unique
      /// dateString
      dob   DateTime?
      /// positive
      age  Int?
      role Role
    }
  ```

  > `✅ Annotations can be used on table level and field level`

  <br/>

  - Table level annotations
    <br/>

  | Annotation | Description                                  |
  | ---------- | -------------------------------------------- |
  | skip       | skips the table (doesn't generates it).      |
  | crud       | Generates a Nestjs Module with a basic CRUD. |

  - <a href="https://github.com/BlackstoneStudio/prisma-generator-nestjs-swagger-validator/blob/develop/packages/usage/prisma/schema.prisma" target="blank">check a datamodel example</a>

## Custom validations

| Type         | Usage             | Result               |
| ------------ | ----------------- | -------------------- |
| **Number**   |                   |
| range values | length(3,50)      |
| **Date**     |                   |
|              |                   |
| **Array**    |                   |
|              |                   |
| **Object**   |                   |
|              |                   |
| **String**   |                   |
| length range | length(min,max)   | @IsLength(min,max)   |
| boolean      | booleanString     | @IsBooleanString()   |
| date         | dateString        | @IsDateString()      |
| number       | numberString      | @IsNumberString()    |
| contains     | contains(str)     | @Contains("str")     |
| not contains | notContains(str)  | @NotContains("seed") |
| alphanumeric | alpha             | @IsAlpha()           |
| base64       | base64            | @IsBase64()          |
| email        | email             | @IsEmail()           |
| creditcard   | creditCard        | @IsCreditCard()      |
| Json         | Json              | @IsJSON()            |
| phoneNumber  | phoneNumber       | @IsPhoneNumber()     |
| mongoId      | mongoId           | @IsMongoId()         |
| url          | url               | @IsUrl()             |
| uuid         | uuid(version)     | @IsUUID("version")   |
| matches      | matches(/regexp/) | @Matches(/regex/)    |
| timezone     | timezone          | @IsTimeZone()        |

required packages: class-transformer, class-validator, prisma, @nestjs/swagger
