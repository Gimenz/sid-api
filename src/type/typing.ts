export interface ILinkStatistics {
    data:    LinkData;
    message: string;
}

export interface LinkData {
    doc_count:       number;
    query_over_time: QueryOverTime;
}


export interface ITopLinks {
    data:    TopLinksData[];
    message: string;
}

export interface TopLinksData {
    doc_count: number;
    key:       string;
}

export interface IDashboard {
    data:        LinkData;
    message:     string;
    total_links: number;
}

export interface LinkData {
    doc_count:       number;
    query_over_time: QueryOverTime;
}

export interface QueryOverTime {
    buckets:  Bucket[];
    interval: string;
}

export interface Bucket {
    doc_count:     number;
    key:           number;
    key_as_string: Date;
}


export interface IUserModel {
    user: User;
}

export interface User {
    id:           number;
    uuid:         string;
    email:        string;
    created_at:   Date;
    updated_at:   Date;
    user_detail:  UserDetail;
    user_sso:     any[];
    verification: Verification;
    status:       number;
}

export interface UserDetail {
    id:         number;
    user_id:    number;
    username:   string;
    first_name: string;
    last_name:  string;
    birth_date: BirthDate;
    gender_id:  number;
    created_at: Date;
    updated_at: Date;
}

export interface BirthDate {
    Time:  Date;
    Valid: boolean;
}

export interface Verification {
    id:          number;
    user_id:     number;
    type:        string;
    verified_at: Date;
    created_at:  Date;
    updated_at:  Date;
}



export interface IShortedLink {
    link:   Link;
    status: string;
}



export interface IHeaders {
    accept:            string;
    "accept-encoding": string;
    "accept-language": string;
    "content-type":    string;
    origin:            string;
    referer:           string;
    "user-agent":      string;
    "cookie"?: string;
}


export interface IFetchedLinks {
    links:      Link[];
    pagination: Pagination;
}

export interface Link {
    id:             number;
    uuid:           string;
    user_id:        number;
    short:          string;
    long_url:       string;
    blocked:        number;
    created_at:     Date;
    updated_at:     Date;
    blocked_reason: null;
}

export interface Pagination {
    current:       number;
    totalPages:    number;
    perPage:       number;
    totalRecords:  number;
    recordsOnPage: number;
}

export enum gender_id {
    'laki-laki' = 1,
    'perempuan' = 2
}

export interface EditProfile {
    first_name: string;
    last_name: string;
    /** @property {1 | 2} */
    gender_id: number;
}