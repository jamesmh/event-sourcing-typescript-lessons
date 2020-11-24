# DDD & Event Sourcing Basics In TypeScript

To run the lessons first open the `main.ts` file for instructions on selecting a specific lesson to "run".

To run the code in your terminal once a lesson(s) is selected:

1. `npm install`
2. `npm run run`

### About Lesson 5+

Lesson 5 is a stand-alone nestjs project. Take a look at the `./lesson5-nestjs-mvc/src/purchase` directory for the goodies.

To run the sample web app, navigate to `./lesson5-nestjs-mvc` and run `npm install && npm run start`.

There are two pages that use event sourcing: 

1. `localhost:3000/purchase`: Shows how to use event sourcing to create a new purchase, display a list of existing purchases and refund specific purchases.
2. `localhost:3000/purchase/report`: Demonstrates how to use projections to generate reports based off of events in the store.



