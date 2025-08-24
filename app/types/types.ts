
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

export type TimePeriod = "hours24" | "week" | "month"