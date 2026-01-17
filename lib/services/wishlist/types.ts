export interface WishlistTrip {
    id: number;
    tripPublicId: string;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    duration: string;
    price?: number;
    imageUrl?: string;
    organizerName?: string;
}

export interface Pageable {
    page: number;
    size: number;
    sort?: string[];
}

export interface Sort {
    direction: string;
    nullHandling: string;
    ascending: boolean;
    property: string;
    ignoreCase: boolean;
}

export interface PageableInfo {
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort: Sort[];
    unpaged: boolean;
}

export interface WishlistTripsResponse {
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    pageable: PageableInfo;
    size: number;
    content: WishlistTrip[];
    number: number;
    sort: Sort[];
    numberOfElements: number;
    empty: boolean;
}

export interface TripExistsResponse {
    exists: boolean;
}
