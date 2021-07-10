const CUSTOMERS = [
  {
    id: 1,
    name: "Ivan",
    age: 27,
    address: {
      city: "N",
      street: "Krivaya",
      building: "42",
      apartment: "21"
    }
  },
  {
    id: 2,
    name: "Asya",
    age: 27,
    address: {
      city: "N",
      street: "Pryamaya",
      building: "21",
      apartment: "42"
    }
  },
  {
    id: 3,
    name: "Osip",
    age: 27,
    address: {
      city: "N",
      street: "Leavaya",
      building: "10",
      apartment: "11"
    }
  },
  {
    id: 4,
    name: "Sherlock Holmes",
    age: 27,
    address: {
      city: "London",
      street: "Baker Street",
      building: "221B",
      apartment: null
    }
  },
];
const PRODUCTS = [
  {id: 1, name: "Teapot", price: 10},
  {id: 2, name: "Cell Phone", price: 199},
  {id: 3, name: "Notebook", price: 599},
  {id: 4, name: "Flowers", price: 3},
  {id: 5, name: "Chair", price: 55},
  {id: 6, name: "Violin", price: 299},
];
const ORDERS = [
  {
    id: 1,
    user: 4,
    goods: [{id: 6, count: 1}, {id: 5, count: 1}],
    status: "processing"
  },
  {
    id: 1,
    user: 3,
    goods: [{id: 4, count: 10}, ],
    status: "processing"
  },
  {
    id: 1,
    user: 1,
    goods: [{id: 2, count: 1}, {id: 3, count: 1}],
    status: "processing"
  },
]