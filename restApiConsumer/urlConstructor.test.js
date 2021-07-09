import {UrlConstructor} from "./urlConstructor";


describe(
  "Check UrlConstructor for", () => {
    test(
      "valid `retrieve` URL-path.", () => {
        const uri = new UrlConstructor("customer");

        expect(uri.retrieve(42))
          .toBe("customer/42/");

        expect(uri.retrieve(42, "orders"))
          .toBe("customer/42/orders/");

        expect(uri.retrieve(42, "orders", {date: "2020-10-20"}))
          .toBe("customer/42/orders/?date=2020-10-20");

        expect(uri.retrieve(42, {orders: 21, goods: 9}))
          .toBe("customer/42/orders/21/goods/9/");

        expect(uri.retrieve(42, {orders: 21, goods: undefined}))
          .toBe("customer/42/orders/21/goods/");

        expect(uri.retrieve(42, {orders: 21, goods: undefined}, {type: "beverages"}))
          .toBe("customer/42/orders/21/goods/?type=beverages");
      }
    );

    test(
      "valid `list` URL-path.", () => {
        const uri = new UrlConstructor("customer");

        expect(uri.list())
          .toBe("customer/");

        expect(uri.list({country: "uk", vip: true}))
          .toBe("customer/?country=uk&vip=true");

        expect(uri.list(undefined, "top10"))
          .toBe("customer/top10/");

        expect(uri.list({country: "uk", vip: true}, "top10"))
          .toBe("customer/top10/?country=uk&vip=true");
      }
    );

    test(
      "valid `create` URL-path.", () => {
        const uri = new UrlConstructor("customer");

        expect(uri.create())
          .toBe("customer/");
      }
    );

    test(
      "valid `update` URL-path.", () => {
        const uri = new UrlConstructor("customer");

        expect(uri.update(42))
          .toBe("customer/42/");

        expect(uri.update(42, {order: 25}))
          .toBe("customer/42/order/25/");
      }
    );

    test(
      "valid `delete` URL-path.", () => {
        const uri = new UrlConstructor("customer");

        expect(uri.delete(42))
          .toBe("customer/42/");

        expect(uri.delete(42, {order: 25}))
          .toBe("customer/42/order/25/");
      }
    );
  }
)
