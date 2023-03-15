
export class PaginatedProductsList {
    products: Product[];
    totalPages: number =0;
    totalElements: number =0;
    size: number = 0;
    number: number;
    numberOfElements: number;
}


export class Product {
    itemId: string;
    name: string;
    category: string;
    desc: string;
    price: number;
    quantity: number;
}


