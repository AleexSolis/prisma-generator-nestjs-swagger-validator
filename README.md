<p align="center">
  <a href="http://blackstone.studio" target="blank"><img src="https://d31i9b8skgubvn.cloudfront.net/enterprises/company_profile/4215.PNG" width="200" alt="Nest Logo" /></a>
  <a href="http://https://www.prisma.io/" target="blank"><img src="https://prismalens.vercel.app/header/logo-dark.svg" width="200" alt="Nest Logo" /></a>
</p>

# prisma-generator-nestjs-swagger-validator

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
