
# Customizing the Boilerplate for Specific Use Cases

This guide provides step-by-step instructions on how to customize the provided NestJS + Prisma + TypeScript starter repository to suit your specific application needs. Whether you are building a simple blog, a complex e-commerce platform, or a scalable enterprise application, the following steps will help you tailor the boilerplate to your project.

## Step 1: Setup and Installation

1. Clone the repository to your local machine.
2. Install the necessary dependencies:
```shell 
  npm install 
```

3. Set up environment variables:
    - Duplicate the `.env.example` file and rename it to `.env`.
    - Populate the `.env` file with your specific configuration values such as database URLs, API keys, and secret keys.

## Step 2: Configure Database

1. Modify the Prisma schema file located in `prisma/schema.prisma` to define your application's data models and relationships.
2. Run the following command to apply migrations to your database:
```shell
  npx prisma generate
  npx prisma migrate dev
```

3. Open Prisma Studio to visually interact with your data:
```shell
  npx prisma studio
```



## Step 3: Customize Modules

1. Adjust or add new modules according to your application requirements. Each feature of your application should ideally be encapsulated in its own module.
2. For each module, you can define:
    - **Controllers**: Handle HTTP requests and responses.
    - **Services**: Contain business logic.
    - **Models/Entities**: Represent data and handle ORM with Prisma.

## Step 4: Authentication and Authorization

This implementation uses `httpOnly` (server-side) cookie-based authentication. [Read more](https://dev.to/guillerbr/authentication-cookies-http-http-only-jwt-reactjs-context-api-and-node-on-backend-industry-structure-3f8e)

That means that the `JWT Token` is never stored on the client.
Usually it was stored in `localStorage` / `sesionStorage` / `cookies` (browser), but this is not secure.

Storing the token on a server side cookie is more secure, but it requires a small adjustment on frontend HTTP requests in order to work.

Frontend adjustments: 
* If you're using `axios` then you need to set: `withCredentials: true`. [Read more](https://flaviocopes.com/axios-credentials/)
* If you're using `fetch` then you need to set: `credentials: 'include'`. [Read more](https://github.com/github/fetch#sending-cookies)

## Step 5: API Customization

1. Define new routes or modify existing ones in the controller files of respective modules.
2. Customize request handling and response formats to meet the API specifications of your frontend application or external APIs.

## Step 6: Logging and Error Handling

1. Modify or extend exception filters to handle different types of exceptions according to your needs.

## Step 7: Testing

1. Write unit and e2e tests for new modules and functionalities.
    - Use Jest and Supertest frameworks as they are already configured in the project.
2. Ensure all tests pass before moving to production:

```shell
  npm run test
  npm run test:e2e
```


## Step 8: Deployment

1. Configure the CI/CD pipeline using GitHub Actions as per the provided `.github/workflows` directory.
2. Adjust the pipeline settings for deployment to your chosen hosting service or server environments.
