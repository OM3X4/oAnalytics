'use client'
import { BiChevronDown } from "react-icons/bi";
import { BiLinkExternal } from "react-icons/bi";
import { BiGlobe } from "react-icons/bi";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Spinner from "@/app/components/Spinner";
import clsx from "clsx";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { formatHour, groupByDay, isTheSameDayAndMonth, shortDateFormatter } from "@/lib/utils";
import { generateDates } from "@/lib/utils";
import osNameToIcon from "@/app/components/OsIconAndName";
import { BrowserIcon } from "@/app/components/BrowserIconAndName";
import { CountryFlagAndName } from "@/app/components/CountryFlagAndName";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { type TimeRange, type Routes, type Countries, type Browsers, type Filters, RollUpResponse } from "@/app/types/types";
import Docs from "@/app/components/Docs";
import { DatePicker } from "@/app/components/Datepicker";


// const chartData1 = [
//     { month: "January", desktop: 186 },
//     { month: "February", desktop: 305 },
//     { month: "March", desktop: 237 },
//     { month: "April", desktop: 73 },
//     { month: "May", desktop: 2090 },
//     { month: "June", desktop: 214 },
// ]
// const chartData = [
//     { month: "January", desktop: 186 },
//     { month: "February", desktop: 305 },
//     { month: "March", desktop: 237 },
//     { month: "April", desktop: 73 },
//     { month: "May", desktop: 2090 },
//     { month: "June", desktop: 214 },
// ]




function ChartAreaLinear({ data, period, isHours = false }: { data: RollUpResponse[], period: TimeRange, isHours: boolean }) {

    const [isViews, setIsViews] = useState(true)

    const dates = generateDates(period)

    const rawVisitors = groupByDay(data.filter((item: RollUpResponse) => item.bucket != null && item.bucket != undefined))


    const chartData = dates.map((day: Date) => ({
        bucket: day,
        visitors: rawVisitors.find((item: any) => isTheSameDayAndMonth(new Date(item.bucket), day))?.visitors || 0,
        views: rawVisitors.find((item: any) => isTheSameDayAndMonth(new Date(item.bucket), day))?.views || 0
    }))

    // console.log("dates", dates)
    // console.log("chartData", chartData)
    // console.log("rawVisitors", rawVisitors)

    return (
        <div className="h-full bg-secondary-background -mt-5 pt-0 rounded-2xl border border-border"> {/* set card height here */}
            <div className="h-[20%] flex items-stretch border-b border-border p-0 bg-soft-background">
                <div
                    onClick={() => setIsViews(false)}
                    className="py-5 pl-10 pr-15 cursor-pointer hover:bg-border/50 border-r h-full border-border flex flex-col justify-center bg-background
                                border-b hover:border-b-white" style={{ borderBottomColor: isViews ? "var(--color-border)" : "white" }}>
                    <h3 className="text-muted font-medium">Visitors</h3>
                    <div className="flex items-center gap-2">
                        <h2 className="text-white text-4xl font-bold">{chartData.reduce((a, b) => a + (b.visitors ?? 0), 0)}</h2>
                        {/* <div className="bg-success-background text-success px-2 py-1 rounded-sm text-xs">
                            +30%
                        </div> */}
                    </div>
                </div>
                <div
                    onClick={() => setIsViews(true)}
                    className="py-5 pl-10 pr-15 cursor-pointer hover:bg-border/50 border-r h-full border-border flex flex-col justify-center bg-background
                                border-b hover:border-b-white" style={{ borderBottomColor: !isViews ? "var(--color-border)" : "white" }}>
                    <h3 className="text-muted font-medium">Page Views</h3>
                    <div className="flex items-center gap-2">
                        <h2 className="text-white text-4xl font-bold">{chartData.reduce((a, b) => a + (b.views ?? 0), 0)}</h2>
                        {/* <div className="bg-success-background text-success px-2 py-1 rounded-sm text-xs">
                            +48%
                        </div> */}
                    </div>
                </div>
            </div>
            <div className="h-full px-10 py-5">
                <ResponsiveContainer width="100%" height={"80%"}>
                    <AreaChart
                        data={chartData}
                        margin={{ left: 12, right: 12, top: 20, bottom: 40 }}
                    >

                        <CartesianGrid vertical={false} strokeDasharray="" stroke="var(--color-border)" />
                        <XAxis
                            fontSize={13}
                            dataKey="bucket"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fill: "var(--color-muted)" }} // makes ticks visible
                            tickFormatter={(value) => shortDateFormatter(new Date(value))}
                        />
                        <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <Tooltip
                            isAnimationActive={false}
                            content={({ active, payload }) => {
                                if (active && payload?.length) {
                                    return (
                                        <div className="rounded-lg bg-background p-2 shadow text-sm border border-border">
                                            <div className=" flex gap-2 items-center">
                                                <div className="w-2 h-2 bg-primaryME rounded-full"></div>
                                                {payload[0].value} {isViews ? "Views" : "Visitors"}
                                            </div>
                                            <p className="text-muted text-sm">{shortDateFormatter(payload[0].payload.bucket)}</p>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Area
                            activeDot={{ fill: "var(--color-primaryME)", strokeWidth: 0 }}
                            isAnimationActive={false}
                            dataKey={isViews ? "views" : "visitors"}
                            type="linear"
                            fill="var(--color-primaryME)"
                            fillOpacity={0.1}
                            stroke="var(--color-primaryME)"
                            strokeWidth={2.5}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default function Project() {

    const { id } = useParams()

    const [project, setProject] = useState()
    const [isLoading, setIsLoading] = useState(true)

    const [dateRange, setDateRange] = React.useState<TimeRange | undefined>({
        from: new Date(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)),
        to: new Date(),
    })

    const [filters, setFilters] = useState<Filters>({
        country: null,
        browser: null,
        os: null,
        path: null
    })

    const [onlineVisitors, setOnlineVisitors] = useState(0)
    const [projectData, setProjectData] = useState<RollUpResponse[]>([])


    useEffect(() => {
        async function fetchProject() {
            console.time("fetchProject")

            const query = new URLSearchParams()
            if (dateRange?.from) query.set('from', dateRange.from.toISOString())
            if (dateRange?.to) query.set('to', dateRange.to.toISOString())
            if (filters.country) query.set('country', filters.country)
            if (filters.browser) query.set('browser', filters.browser)
            if (filters.os) query.set('os', filters.os)
            if (filters.path) query.set('path', filters.path)

            const response = await fetch(`/api/project/${id}?${query.toString()}`)
            console.log(`/api/project/${id}?${query.toString()}`)
            const result = await response.json()
            setProject(result.project)
            setProjectData(result.data)
            setOnlineVisitors(result.onlineVisitors)
            console.timeEnd("fetchProject")
            setIsLoading(false)
        }
        fetchProject()
    }, [id, dateRange , filters])

    if (isLoading) {
        return <div className="w-screen h-screen flex items-center justify-center"><Spinner size="50" color="white" /></div>
    }

    if (!project) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <p className="text-white">This Project Doesn't Exist</p>
            </div>
        )
    }

    const routes = projectData.filter(d => d.path !== null && d.path !== undefined).sort((a, b) => b.views - a.views)
    const countries = projectData.filter(d => d.country !== null && d.country !== undefined).sort((a, b) => b.views - a.views)
    const browsers = projectData.filter(d => d.browser !== null && d.browser !== undefined).sort((a, b) => b.views - a.views)
    const operatingSystems = projectData.filter(d => d.os !== null && d.os !== undefined).sort((a, b) => b.views - a.views)

    return (
        <div className='text-white'>
            <div className="border-b border-border bg-background">
                <div className="w-[80vw] mx-auto py-10">
                    <div className="flex items-center justify-between">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold">{(project as any)?.name}</h1>
                                <Docs appId={(project as any)?.id} />
                            </div>
                            <div className="flex items-center gap-2">
                                <a href={(project as any)?.origin} target="_blank" className="flex items-center gap-2">
                                    <BiGlobe className="text-muted" />
                                    <h4 className="text-sm">{(project as any)?.origin}</h4>
                                    <BiLinkExternal className="text-muted" />
                                </a>
                                <div className="w-[1px] self-stretch bg-muted"></div>
                                <div className="flex items-center gap-2">
                                    <div className={clsx("w-2 h-2 rounded-full", onlineVisitors > 0 ? "bg-success" : "bg-error")}></div>
                                    <h3>{onlineVisitors} online</h3>
                                </div>
                            </div>
                        </div>
                        <div>
                            <DatePicker dateRange={dateRange} setDateRange={setDateRange} />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="w-[80vw] mx-auto grid grid-cols-6 mb-200 gap-5">
                    {/* Main Chart */}
                    <div className="h-[80vh] col-span-6">
                        <ChartAreaLinear
                            isHours={false}
                            data={projectData}
                            period={{
                                from: dateRange?.from ?? new Date(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)),
                                to: dateRange?.to
                            }} />
                    </div>
                    {/* Routes */}
                    <AnalyticsCard
                        title="Routes"
                        data={routes}
                        renderRow={(route, index) => {
                            const maxOpacity = 1;
                            const minOpacity = 0.8;
                            const total = routes.length;
                            const opacity = maxOpacity - ((maxOpacity - minOpacity) * index) / (total - 1);

                            return (
                                <div
                                    key={index}
                                    className="py-0.5 border-transparent hover:border-white border-l-2 hover:bg-soft-background"
                                    style={{ opacity }}
                                >
                                    <div className="grid grid-cols-8 items-center px-4 py-2 gap-4 mx-3 bg-soft-background rounded-lg border-b border-border">
                                        <a
                                            href={(project as any).origin + route.path}
                                            target="_blank"
                                            className="text-offwhite col-span-6 w-fit overflow-hidden whitespace-nowrap hover:underline"
                                        >
                                            {route.path}
                                        </a>
                                        <h5 className="place-self-end-safe">{route.visitors}</h5>
                                        <h5 className="place-self-end-safe">{route.views}</h5>
                                    </div>
                                </div>
                            );
                        }}
                        setFilter={(filter: any) => {
                            if (filter.path === filters.path) {
                                setFilters({ ...filters, path: null })
                            } else {
                                setFilters({ ...filters, path: filter.path })
                            }
                            return
                        }}
                    />
                    <AnalyticsCard
                        title="Countries"
                        data={countries}
                        renderRow={(country, index) => {
                            const maxOpacity = 1;
                            const minOpacity = 0.8;
                            const total = routes.length;
                            const opacity = maxOpacity - ((maxOpacity - minOpacity) * index) / (total - 1);

                            return (
                                <div
                                    key={index}
                                    className="py-0.5 border-transparent hover:border-white border-l-2 hover:bg-soft-background"
                                    style={{ opacity }}
                                >
                                    <div className="grid grid-cols-8 items-center px-4 py-2 gap-4 mx-3 bg-soft-background rounded-lg border-b border-border">
                                        <h2
                                            className="text-offwhite col-span-6 overflow-hidden whitespace-nowrap hover:underline"
                                        >
                                            {CountryFlagAndName({ code: country.country })}
                                        </h2>
                                        <h5 className="place-self-end-safe">{country.visitors}</h5>
                                        <h5 className="place-self-end-safe">{country.views}</h5>
                                    </div>
                                </div>
                            );
                        }}
                        setFilter={(filter: any) => {
                            if (filter.country === filters.country) {
                                setFilters({ ...filters, country: null })
                            } else {
                                setFilters({ ...filters, country: filter.country })
                            }
                            return
                        }}
                    />
                    <AnalyticsCard
                        title="OSs"
                        data={operatingSystems}
                        renderRow={(os, index) => {
                            const maxOpacity = 1;
                            const minOpacity = 0.8;
                            const total = routes.length;
                            const opacity = maxOpacity - ((maxOpacity - minOpacity) * index) / (total - 1);

                            return (
                                <div
                                    key={index}
                                    className="py-0.5 border-transparent hover:border-white border-l-2 hover:bg-soft-background"
                                    style={{ opacity }}
                                >
                                    <div className="grid grid-cols-8 items-center px-4 py-2 gap-4 mx-3 bg-soft-background rounded-lg border-b border-border">
                                        <h2
                                            className="text-offwhite col-span-6 overflow-hidden whitespace-nowrap hover:underline"
                                        >
                                            {osNameToIcon(os.os)}
                                        </h2>
                                        <h5 className="place-self-end-safe">{os.visitors}</h5>
                                        <h5 className="place-self-end-safe">{os.views}</h5>
                                    </div>
                                </div>
                            );
                        }}
                        setFilter={(filter: any) => {
                            if (filter.os === filters.os) {
                                setFilters({ ...filters, os: null })
                            } else {
                                setFilters({ ...filters, os: filter.os })
                            }
                            return
                        }}
                    />
                    <AnalyticsCard
                        title="Browsers"
                        data={browsers}
                        renderRow={(browser, index) => {
                            const maxOpacity = 1;
                            const minOpacity = 0.8;
                            const total = routes.length;
                            const opacity = maxOpacity - ((maxOpacity - minOpacity) * index) / (total - 1);

                            return (
                                <div
                                    key={index}
                                    className="py-0.5 border-transparent hover:border-white border-l-2 hover:bg-soft-background"
                                    style={{ opacity }}
                                >
                                    <div className="grid grid-cols-8 items-center px-4 py-2 gap-4 mx-3 bg-soft-background rounded-lg border-b border-border">
                                        <h2
                                            className="text-offwhite col-span-6 overflow-hidden whitespace-nowrap hover:underline"
                                        >
                                            {BrowserIcon({ name: browser.browser }) as any}
                                        </h2>
                                        <h5 className="place-self-end-safe">{browser.visitors}</h5>
                                        <h5 className="place-self-end-safe">{browser.views}</h5>
                                    </div>
                                </div>
                            );
                        }}
                        setFilter={(filter: any) => {
                            if (filter.browser === filters.browser) {
                                setFilters({ ...filters, browser: null })
                            } else {
                                setFilters({ ...filters, browser: filter.browser })
                            }
                            return
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

interface AnalyticsCardProps<T> {
    title: string
    data: T[]
    renderRow: (item: T, index: number) => React.ReactNode
    setFilter: (filter: string) => void
}

export function AnalyticsCard<T>({ title, data, renderRow, setFilter }: AnalyticsCardProps<T>) {
    return (
        <Card className="col-span-3 bg-secondary-background text-offwhite pt-0 px-0 overflow-hidden">
            <CardHeader className="px-0">
                <div className="grid grid-cols-8 items-center px-6 gap-4 py-4 border-b border-border">
                    <h1 className="text-white col-span-6">{title}</h1>
                    <h4>Visitors</h4>
                    <h4>Views</h4>
                </div>
            </CardHeader>
            <CardContent className="card-content-class">
                {data.slice(0, 5).map((item, index) => {
                    const maxOpacity = 1
                    const minOpacity = 0.8
                    const total = data.length
                    const opacity = maxOpacity - ((maxOpacity - minOpacity) * index) / (total - 1)

                    return (
                        <div
                            key={index}
                            onClick={() => setFilter(item as string)}
                            className="py-0.5 border-transparent hover:border-white border-l-2 hover:bg-soft-background cursor-pointer"
                            style={{ opacity }}
                        >
                            {renderRow(item, index)}
                        </div>
                    )
                })}

                <Dialog>
                    <DialogTrigger className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50 bg-background rounded-full border border-border cursor-pointer px-3 py-2">
                        See All
                    </DialogTrigger>
                    <DialogContent className="col-span-3 bg-secondary-background text-offwhite pt-0 px-0 overflow-hidden max-h-[80vh] flex flex-col">
                        {/* Header */}
                        <div className="px-0 flex-shrink-0">
                            <div className="grid grid-cols-8 items-center px-6 gap-4 py-4 border-b border-border">
                                <h1 className="text-white col-span-6">{title}</h1>
                                <h4>Visitors</h4>
                                <h4>Views</h4>
                            </div>
                        </div>

                        {/* Scrollable body */}
                        <div className="flex-1 overflow-y-auto space-y-1 px-0 relative">
                            {data.map((item, index) => {
                                const maxOpacity = 1
                                const minOpacity = 0.8
                                const total = data.length
                                const opacity = maxOpacity - ((maxOpacity - minOpacity) * index) / (total - 1)

                                return (
                                    <div
                                        key={index}
                                        className="py-0.5 border-transparent hover:border-white border-l-2 hover:bg-soft-background"
                                        style={{ opacity }}
                                    >
                                        {renderRow(item, index)}
                                    </div>
                                )
                            })}
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}

