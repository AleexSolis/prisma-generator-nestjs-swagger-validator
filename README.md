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

| Type                  | Usage               | Result               |
| --------------------- | ------------------- | -------------------- |
| **Number**            |                     |                      |
| Divisible by          | isDivisibleBy(num)  | @IsDivisibleBy(num)  |
| Positive number       | isPositive()        | @IsPositive()        |
| Negative number       | isNegative()        | @IsNegative()        |
| Greater than or equal | min(num)            | @Min(num)            |
| Less than or equal    | max(num)            | @Max(num)            |
| **Date**              |                     |                      |
| MinDate               | minDate(YYYY-MM-DD) | @MinDate(date ISO)   |
| MaxDate               | maxDate(YYYY-MM-DD) | @MaxDate(date ISO)   |
| **Array**             |                     |                      |
|                       |                     |                      |
| **Object**            |                     |                      |
| isInstance            | isInstance(JSON)    | isInstance(Obj)      |
| **String**            |                     |                      |
| Length range          | length(min,max)     | @IsLength(min,max)   |
| Boolean               | booleanString       | @IsBooleanString()   |
| Date                  | dateString          | @IsDateString()      |
| Number                | numberString        | @IsNumberString()    |
| Contains              | contains(str)       | @Contains("str")     |
| Not contains          | notContains(str)    | @NotContains("seed") |
| Alphanumeric          | alpha               | @IsAlpha()           |
| Base64                | base64              | @IsBase64()          |
| Email                 | email               | @IsEmail()           |
| Credit card           | creditCard          | @IsCreditCard()      |
| Json                  | Json                | @IsJSON()            |
| PhoneNumber           | phoneNumber         | @IsPhoneNumber()     |
| MongoId               | mongoId             | @IsMongoId()         |
| URL                   | url                 | @IsUrl()             |
| UUID                  | uuid(version)       | @IsUUID("version")   |
| Matches               | matches(/regexp/)   | @Matches(/regex/)    |
| Timezone              | timezone            | @IsTimeZone()        |
