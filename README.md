# E-commerce API

## Introduction

The E-commerce API is a demo app that allows a user to CRUD commercetools products and update the logged in users cart.

## Installation

- run `npm i`
- create a .env file based on the example.env and replace the necessary secret values
- run `npm start`
- go to `localhost:3000/home` to confirm the server is running

## Swagger/Open API

Overview of the API documentation can be accessed and tested here:

- localhost:3000/api-docs/

## Routes

### Public routes

- /api/products (GET)
- /api/single-product (POST with ProductId)
- /api/login (POST with email and password for commercetools user)

### Gated routes

Requires 'Authorization: Bearer {accessToken}' - accessToken is generated when user has successfully logged in

- /api/product (POST - add product)
- /api/product (PUT - update product)
- /api/product (DELETE - delete product)
- /api/cart (GET - customers cart)
- /api/cart (PUT - create / update cart with product)
- /api/cart (DELETE - remove product from cart)

## Docker

This API can also be run in docker by running

- run `npm i`
- create .env file based on example.env and replace the necessary secret values
- run `npm start`
- go to `localhost:3000/home` to confirm the server is running

## Serverless

This API can also be run in a serverless environment

- run `npm install -g serverless` if serverless isn't installed globally yet
- run `serverless offline` to test the serverless configuration locally
- run `serverless deploy` to deploy to aws provided that you have aws credentials configured on your machine

## Technologies

- `Node and Express.js`
- `TypeScript`
- `Commercetools`
- `Serverless`
- `Docker`

## Improvement Areas

- Add unit tests
- Get rid of all 'any' types where possible
- Use commercetools GraphQL API over commercetools SDK (I wanted to try out commercetools SDK)
- Update authentication to be more robust - use an Identity provider such as Auth0
- Update swagger autogen (currently doesn't autogen correctly)
