
type MainPanelViewsEntity = {
    bucket: string,
    count: number
}
export type MainPanelViewsObject = {
    hours24: MainPanelViewsEntity[],
    week: MainPanelViewsEntity[],
    month: MainPanelViewsEntity[]
}
type RouteEntity = {
    path: string,
    total_events: number,
    unique_visitors: number
}
export type Routes = {
    hours24: RouteEntity[],
    week: RouteEntity[],
    month: RouteEntity[]
}
type CountryEntity = {
    country: string,
    total_events: number,
    unique_visitors: number
}
export type Countries = {
    hours24: CountryEntity[],
    week: CountryEntity[],
    month: CountryEntity[]
}

type Browser = {
    browser: string,
    total_events: number,
    unique_visitors: number
}
export type Browsers = {
    hours24: Browser[],
    week: Browser[],
    month: Browser[]
}

type OperatingSystem = {
    os: string,
    total_events: number,
    unique_visitors: number
}
export type OperatingSystems = {
    hours24: OperatingSystem[],
    week: OperatingSystem[],
    month: OperatingSystem[]
}

export interface TimeRangeInternal {
    from: Date
    to: Date | undefined
}
export type TimeRange = TimeRangeInternal | undefined


export interface RollUpResponse {
    bucket: string | null;
    path: string | null;
    country: string | null;
    browser: string | null;
    os: string | null;
    views: number;
    visitors: number;
}

export interface Filters {
    country: string | null;
    browser: string | null;
    os: string | null;
    path: string | null;
}