import { EventEmitter } from 'events';
import * as request from 'request';
import { Readable } from 'stream';

declare module 'coinbase-pro' {
  export type HttpResponse = request.Response;

  export type callback<T> = (err: any, response: HttpResponse, data: T) => void;

  interface ApiServerTime {
    iso: string;
    epoch: number;
  }

  export type ProductTicker = {
    trade_id: string;
    price: string;
    size: string;
    bid: string;
    ask: string;
    volume: string;
    time: string;
  };

  interface BaseOrder {
    type: string;
    side: 'buy' | 'sell';
    product_id: string;
    client_oid?: string;
    stp?: 'dc' | 'co' | 'cn' | 'cb';
  }

  interface LimitOrder extends BaseOrder {
    type: 'limit';
    price: string;
    size: string;
    time_in_force?: 'GTC' | 'GTT' | 'IOC' | 'FOK';
    cancel_after?: 'min' | 'hour' | 'day';
    post_only?: boolean;
  }

  /**
   * Only one of `size` and `funds` are required for market and limit orders (the other can be explicitly assigned null or undefined). However,
   * it is advisable to include both. If funds is not specified, the entire user balance is placed on hold until the order is filled which
   * will prevent other orders from being placed in the interim. This can cause issues for HFT algorithms for example.
   */
  interface MarketOrder extends BaseOrder {
    type: 'market';
    size: string | null;
    funds: number | null;
  }

  interface StopOrder extends BaseOrder {
    type: 'limit';
    size: string;
    price: number;
    funds: number;
    stop?: 'loss' | 'entry';
    stop_price?: number;    
    time_in_force: 'GTC' | 'GTT' | 'IOC' | 'FOK';
  }

  export type OrderParams = MarketOrder | LimitOrder | StopOrder;

  export interface BaseOrderInfo {
    id: string;
    price: string;
    size: string;
    product_id: string;
    side: 'buy' | 'sell';
    type: 'limit' | 'market' | 'stop';
    created_at: string;
    post_only: boolean;
    fill_fees: string;
    filled_size: string;
    status: 'received' | 'rejected' | 'open' | 'done' | 'pending' | 'settled' | 'active';
    settled: boolean;
    executed_value: string;
    time_in_force: 'GTC' | 'GTT' | 'IOC' | 'FOK';
  }

  export interface OrderResult extends BaseOrderInfo {
    stp: 'dc' | 'co' | 'cn' | 'cb';
  }

  export interface OrderInfo extends BaseOrderInfo {
    status: 'received' | 'open' | 'done' | 'pending' | 'rejected' | 'settled' | 'active';
    funds?: number;
    specified_funds?: number;
    done_at?: string;
    done_reason?: string;
    stop_price?: string;
  }

  export type PageArgs = {
    before?: number;
    after?: number;
    limit?: number;
  };

  export type FillFilter = {
    product_id?: string;
    order_id?: string;
  } & PageArgs;

  export type OrderFilter = {
    product_id?: string;
    status?: string;
  } & PageArgs;

  export type Account = {
    id: string;
    profile_id: string;
    currency: string;
    balance: string;
    available: string;
    hold: string;
  };

  export type CoinbaseAccount = {
    id: string;
    name: string;
    balance: number;
    currency: string;
    type: 'wallet' | 'fiat';
    primary: boolean;
    active: boolean;
  };

  export type CurrencyInfo = {
    id: string;
    name: string;
    min_size: string;
  };

  export interface ProductInfo {
    id: string;
    base_currency: string;
    quote_currency: string;
    base_min_size: string;
    base_max_size: string;
    quote_increment: string;
    display_name: string;
    margin_enabled: boolean;
    status: string;
    status_message: string;
  }

  /**
   * If a PublicClient or AuthenticatedClient method that does an
   * HTTP request throws an error, then it will have this shape.
   */
  export interface HttpError extends Error {
    response: HttpResponse;
    data?: any;
  }

  export interface ClientOptions {
    timeout?: number;
  }

  export class PublicClient {
    constructor(apiURI?: string, options?: ClientOptions);

    getProducts(callback: callback<ProductInfo[]>): void;
    getProducts(): Promise<ProductInfo[]>;

    getProductOrderBook(
      productID: string,
      options: any,
      callback: callback<any>
    ): void;
    getProductOrderBook(productID: string, options: any): Promise<any>;

    getProductTicker(
      productID: string,
      callback: callback<ProductTicker>
    ): void;
    getProductTicker(productID: string): Promise<ProductTicker>;

    getProductTrades(productID: string, callback: callback<any>): void;
    getProductTrades(productID: string): Promise<any>;

    getProductTrades(
      productID: string,
      pageArgs: PageArgs,
      callback: callback<any>
    ): void;
    getProductTrades(productID: string, pageArgs: PageArgs): Promise<any>;

    getProductTradeStream(
      productID: string,
      tradesFrom: number,
      tradesTo: any
    ): Readable;

    getProductHistoricRates(
      productID: string,
      args: any,
      callback: callback<any[][]>
    ): void;
    getProductHistoricRates(productID: string, args: any): Promise<any[][]>;

    getProduct24HrStats(productID: string, callback: callback<any>): void;
    getProduct24HrStats(productID: string): Promise<any>;

    getCurrencies(callback: callback<CurrencyInfo[]>): void;
    getCurrencies(): Promise<CurrencyInfo[]>;

    getTime(callback: callback<ApiServerTime>): void;
    getTime(): Promise<ApiServerTime>;
  }

  export class AuthenticatedClient extends PublicClient {
    constructor(
      key: string,
      secret: string,
      passphrase: string,
      apiURI?: string,
      options?: ClientOptions
    );

    getCoinbaseAccounts(callback: callback<CoinbaseAccount[]>): void;
    getCoinbaseAccounts(): Promise<CoinbaseAccount[]>;

    getAccounts(callback: callback<Account[]>): void;
    getAccounts(): Promise<Account[]>;

    getAccount(accountID: string, callback: callback<Account>): void;
    getAccount(accountID: string): Promise<Account>;

    getAccountHistory(accountID: string, callback: callback<any>): void;
    getAccountHistory(accountID: string): Promise<any>;

    getAccountHistory(
      accountID: string,
      pageArgs: PageArgs,
      callback: callback<any>
    ): void;
    getAccountHistory(accountID: string, pageArgs: PageArgs): Promise<any>;

    getAccountTransfers(accountID: string, callback: callback<any>): void;
    getAccountTransfers(accountID: string): Promise<any>;

    getAccountTransfers(
      accountID: string,
      pageArgs: PageArgs,
      callback: callback<any>
    ): void;
    getAccountTransfers(accountID: string, pageArgs: PageArgs): Promise<any>;

    getAccountHolds(accountID: string, callback: callback<any>): void;
    getAccountHolds(accountID: string): Promise<any>;

    getAccountHolds(
      accountID: string,
      pageArgs: PageArgs,
      callback: callback<any>
    ): void;
    getAccountHolds(accountID: string, pageArgs: PageArgs): Promise<any>;

    buy(params: OrderParams, callback: callback<OrderResult>): void;
    buy(params: OrderParams): Promise<OrderResult>;

    sell(params: OrderParams, callback: callback<OrderResult>): void;
    sell(params: OrderParams): Promise<OrderResult>;

    placeOrder(params: OrderParams, callback: callback<OrderResult>): void;
    placeOrder(params: OrderParams): Promise<OrderResult>;

    cancelOrder(orderID: string, callback: callback<string[]>): void;
    cancelOrder(orderID: string): Promise<string[]>;

    cancelAllOrders(
      args: { product_id?: string },
      callback: callback<string[]>
    ): void;
    cancelAllOrders(args: { product_id?: string }): Promise<string[]>;

    getOrders(callback: callback<OrderInfo[]>): void;
    getOrders(): Promise<OrderInfo[]>;

    getOrders(props: OrderFilter, callback: callback<OrderInfo[]>): void;
    getOrders(props: OrderFilter): Promise<OrderInfo[]>;

    getOrder(orderID: string, callback: callback<OrderInfo>): void;
    getOrder(orderID: string): Promise<OrderInfo>;

    getFills(callback: callback<any>): void;
    getFills(): Promise<any>;

    getFills(props: FillFilter, callback: callback<any>): void;
    getFills(props: FillFilter): Promise<any>;

    getFundings(params: any, callback: callback<any>): void;
    getFundings(params: any): Promise<any>;

    repay(params: any, callback: callback<any>): void;
    repay(params: any): Promise<any>;

    marginTransfer(params: any, callback: callback<any>): void;
    marginTransfer(params: any): Promise<any>;

    closePosition(params: any, callback: callback<any>): void;
    closePosition(params: any): Promise<any>;

    convert(params: any, callback: callback<any>): void;
    convert(params: any): Promise<any>;

    deposit(params: any, callback: callback<any>): void;
    deposit(params: any): Promise<any>;

    withdraw(params: any, callback: callback<any>): void;
    withdraw(params: any): Promise<any>;

    withdrawCrypto(params: any, callback: callback<any>): void;
    withdrawCrypto(params: any): Promise<any>;

    getTrailingVolume(callback: callback<any>): void;
    getTrailingVolume(): Promise<any>;
  }

  type ChannelName =
    | 'full'
    | 'level2'
    | 'level2_50'
    | 'status'
    | 'ticker'
    | 'ticker_1000'
    | 'user'
    | 'matches'
    | 'heartbeat';

  type Channel = {
    name: ChannelName;
    product_ids?: string[];
  };

  export namespace WebsocketMessage {
    type Side = 'buy' | 'sell';

    // Heartbeat channel
    export type Heartbeat = {
      type: 'heartbeat';
      sequence: number;
      last_trade_id: number;
      product_id: string;
      time: string; // ISO Date string without time zone
    };

    // Level 2 channel
    export type L2Snapshot = {
      type: 'snapshot';
      product_id: string;
      bids: [string, string][]; // strings are serialized fixed-point numbers
      asks: [string, string][]; // [price, size]
    };
    export type L2Update = {
      type: 'l2update';
      product_id: string;
      changes: [string, string, string][]; // [side, price, new size]
    };

    // Full channel
    export type Received = {
      type: 'received';
      time: string;
      product_id: string;
      sequence: number;
      order_id: string;
      side: Side;
      client_oid?: string;
    } & (ReceivedLimit | ReceivedMarket);
    type ReceivedLimit = {
      order_type: 'limit';
      size: string;
      price: string;
    };
    type ReceivedMarket = {
      order_type: 'market';
      funds: number;
    };
    export type Open = {
      type: 'open';
      price: string;
      order_id: string;
      product_id: string;
      profile_id: string;
      sequence: number;
      side: Side;
      time: string;
      user_id: string;
      remaining_size: string;
    };
    export type Match = {
      type: 'match';
      trade_id: number;
      sequence: number;
      maker_order_id: string;
      taker_order_id: string;
      time: string;
      product_id: string;
      size: string;
      price: string;
      side: Side;

      // authenticated
      profile_id?: string;
      user_id?: string;
    };
    export type Change = {
      type: 'change';
      time: string;
      sequence: number;
      order_id: string;
      product_id: string;
      price: string;
      side: Side;
      new_size?: string;
      old_size?: string;
      new_funds?: number;
      old_funds?: number;
    };
    export type Done = {
      type: 'done';
      side: Side;
      order_id: string;
      reason: string;
      product_id: string;
      user_id?: string;
    };

    // Ticket channel
    type BaseTicker = {
      type: 'ticker';
      sequence: number;
      time: string;
      product_id: string;
      price: string;
      open_24h?: string;
      volume_24h?: string;
      low_24h?: string;
      high_24h?: string;
      volume_30d?: string;
      best_bid?: string;
      best_ask?: string;
    };
    type FullTicket = BaseTicker & {
      trade_id: number;
      side: Side; // Taker side
      last_size: string;
    };
    export type Ticker = BaseTicker | FullTicket;

    // Subscription
    export type Subscription = {
      type: 'subscriptions';
      channels: Channel[];
    };

    // Error
    export type Error = {
      type: 'error';
      message: string;
      reason: string;
    };
  }
  export type WebsocketMessage =
    | WebsocketMessage.Heartbeat
    | WebsocketMessage.L2Snapshot
    | WebsocketMessage.L2Update
    | WebsocketMessage.Received
    | WebsocketMessage.Open
    | WebsocketMessage.Match
    | WebsocketMessage.Change
    | WebsocketMessage.Done
    | WebsocketMessage.Ticker
    | WebsocketMessage.Subscription
    | WebsocketMessage.Error;

  export interface WebsocketAuthentication {
    key: string;
    secret: string;
    passphrase: string;
  }

  interface WebsocketClientOptions {
    channels?: string[];
  }

  type SubscriptionOptions = { channels?: Channel[]; product_ids?: string[] };

  export class WebsocketClient extends EventEmitter {
    constructor(
      productIds: string[],
      websocketURI?: string,
      auth?: WebsocketAuthentication,
      { channels }?: WebsocketClientOptions
    );

    on(event: 'message', eventHandler: (data: WebsocketMessage) => void): this;
    on(event: 'error', eventHandler: (err: any) => void): this;
    on(event: 'open', eventHandler: () => void): this;
    on(event: 'close', eventHandler: () => void): this;

    connect(): void;
    disconnect(): void;

    subscribe(options?: SubscriptionOptions): void;
    unsubscribe(options?: SubscriptionOptions): void;
  }
}
