import { LibraryRequest, LibraryResponse } from "../types";

export interface StayRequest extends LibraryRequest {
    sharingType: SharingType;
    check_in_time: string;
    check_out_time: string;
    location: string;

    description?: string;
    packingSuggestion?: string;
}

export enum SharingType {
    SINGLE,
    DOUBLE,
    TRIPLE,
}

export interface StayResponse extends LibraryResponse {
    sharingType: SharingType;
    check_in_time: string;
    check_out_time: string;
    location: string;

    description?: string;
    packingSuggestion?: string;

}