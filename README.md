REST api server exaples using
- [express](https://expressjs.com/)
- [openapi](https://www.openapis.org/)

There are 3 examples
- server1
  - custom routes builder
  - [express-openapi](https://github.com/kogosoftwarellc/open-api/tree/main/packages/express-openapi) libraries 
    - [openapi-security-handler](https://github.com/kogosoftwarellc/open-api/tree/main/packages/openapi-security-handler)
    - [openapi-request-validator](https://github.com/kogosoftwarellc/open-api/tree/main/packages/openapi-request-validator)
  - [swagger-ui-dist](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/installation.md) with some wrapping
- server2
  - custom routes builder
  - [express-openapi-validator](https://github.com/cdimascio/express-openapi-validator)
  - [swagger-ui-dist](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/installation.md) with some wrapping
- server3
  - [swagger-routes-express](https://www.npmjs.com/package/swagger-routes-express)
    - The package author [mentions](https://losikov.medium.com/part-2-express-open-api-3-0-634385c97a4e) 2 boilerplate projects which could be interesting
      - His own [api-server-boilerplate](https://github.com/davesag/api-server-boilerplate)
      - [node-express-openapi-skeleton](https://github.com/ReubenFrimpong/node-express-open-api-skeleton)
  - [express-openapi-validator](https://github.com/cdimascio/express-openapi-validator)
  - there is an [article](https://losikov.medium.com/part-2-express-open-api-3-0-634385c97a4e) about this approach
  - [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) instead of swagger-ui-dist. swagger-ui-express docs
  are not very clear, but it looks like to be working without wrappers.
  To be honest swager-ui-dist docs are not clear too.

Seems I need to give a chance for server3 first, but if swagger-routes-express is not very good, then I can give a chance for server2. Server1's express-openapi middlewares has not very stable apis, they are documented not so well (but there are quite a lot of docs for main framework express-openapi, but I do not really like its approach).
So the server1 is the 3rd option then. Let's also save server1 as containing examples of custom implementations for router builder and api builder.
