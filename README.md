# restapiReduxSaga

That project provides unified interface to consume REST API,
 factories for Redux state wich handles with data received from REST API
 and factories for redux-sagas wich performs requests to api consumer and handles response.

Pupouses:
- Implements "single responsibility" principle with abstractions:
  - ApiConsumer
  - StateFactory
  - SagaFactory
- Reduce boilerplates related to redux and redux-saga usage
- Unify usage of REST API through ApiConsumer object interface