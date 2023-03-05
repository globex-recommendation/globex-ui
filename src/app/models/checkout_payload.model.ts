export class CheckoutPayload {
    test: string;
    promotion: Promotion;
    billing_address: Address;
    shipping_address: Address;
    user_info: UserInfo;
    currency: Currency;
    payment: Payment;
    line_items: LineItem[];
    constructor() {
        this.promotion = new Promotion();
        this.billing_address = new Address();
        this.shipping_address = new Address();
        this.user_info = new UserInfo();
        this.currency = new Currency();
        this.payment = new Payment();
        this.line_items = new Array();
    }
}

export class Promotion {
    amount: number;
    title: string;
    description: string;
    value: string;
    value_type: string;
    applicable: boolean;
    constructor() {

    }
}

export class Address {
    first_name: string;
    last_name: string;
    address1: string;
    address2: string;
    city: string
    country: string;
    state: string;
    zip: string;
    phone: string;        
}

export class UserInfo {
    userId: string;
    email: string;
    customer_id: string;
    username: string;
    constructor() {

    }
}

export class Currency {
    currency: string;
    constructor() {

    }
}

export class Payment {
    mode: string;
    credit_card_number: string;
    card_expiry_date: DateClass;
    card_cvv: string;
    name_on_card: string;
    constructor() {

    }
}
export class DateClass {
    year: number;
    month: number;
    day: number;
}
export class LineItem {
    price: string;
    product_id: string;
    quantity: number;
    sku: string;
    constructor(product_id: string, price: string, quantity: number, sku: string) {
        this.product_id = product_id;
        this.price = price;
        this.quantity = quantity;
        this.sku = sku;

    }
}