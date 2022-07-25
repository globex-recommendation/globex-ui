
export class PaginatedProductsList {
    content: Content[];
    pageable: Pageable;
    totalPages: number =0;
    totalElements: number =0;
    last: boolean;
    size: number = 0;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}


export class Content {
        itemId: string;
        name: string;
        desc: string;
        price: number;
        quantity: number;
    }

    export class Sort {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    }

    export class Pageable {
        sort: Sort;
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
    }



