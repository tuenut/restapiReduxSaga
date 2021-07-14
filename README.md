# restapiReduxSaga

That project provides unified interface to consume REST API,
 factories to create Redux state wich handles with data received from RESTApi
 and redux-saga factories to create sagas that performs requests to RESTApi and
 handles response.

Pupouses:
- Implements "single responsibility" principle with abstractions:
  - `ApiRepository` - responses for http request to RESTApi server (uses axios);
  - `StateFactory` - produce redux state to store data from RESTApi server;
  - `SagaFactory` -  produce redux-saga to perform api requst and handle response;
- Reduce boilerplates related to redux and redux-saga usage;
- Unify usage of RESTApi through `ApiRepository` object interface;

## Example
Let's say you have RESTApi server on `https://example.com` host with following resources:
- `customers/` - with customers profiles
- `products/` - with producst list and details
- `orders/` - with customers orders
That resources provide typical CRUD interface also `orders` has extra action 
`confirm` to get customer confirmation of order completion.

Then you have following urls:
- `https://example.com/customers/` - list all customers profiles and filter it 
with GET, create new customer with POST;
    - `https://example.com/customers/<int:id>` - get details about customer
with GET, update customer information with PUT and delete customer with DELETE;
- `https://example.com/products/` - same as above but for products; 
    - `https://example.com/products/<int:id>` - same as above but for products;
- `https://example.com/orders/` - same as above but for orders;
    - `https://example.com/products/<int:id>` - same as above but for orders;
    - `https://example.com/products/<int:id>/confirm/` - customer confirms is
order complete; 
 
You can describe that RESTApi consumer in next way:
```js
// describe custom resource
class OrdersResource extends ApiResource {
  confirm(id) {
    const url = this.url.retrieve(id, "complete");
    
    return this.request("retrieve", url);
  }
}

// write configuration
const apiConfiguration = [
  "customers", 
  "products",
  {
    name: "orders", _class: OrdersResource
  }
];

```

And next use it:
```js
// configure api repository
configureApi("https://example.com", apiConfiguration);

// get api object
const api = getApi();

// get info about customer with id 42, for example
const response = api.customers.retrieve(42); // returns AxiosPromise

// confirm order with id 13
api.orders.confirm(13); 
```
 