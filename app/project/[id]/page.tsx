'use client'
import { BiChevronDown } from "react-icons/bi";
import { BiLinkExternal } from "react-icons/bi";
import { BiGlobe } from "react-icons/bi";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Spinner from "@/app/components/Spinner";
import clsx from "clsx";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { formatHour, shortDateFormatter } from "@/lib/utils";
import osNameToIcon from "@/app/components/OsIconAndName";
import { BrowserIcon } from "@/app/components/BrowserIconAndName";
import { CountryFlagAndName } from "@/app/components/CountryFlagAndName";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import type { MainPanelViewsObject, TimePeriod, Routes, Countries, Browsers, OperatingSystems } from "@/app/types/types";
import Docs from "@/app/components/Docs";


const chartData1 = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 2090 },
    { month: "June", desktop: 214 },
]
const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 2090 },
    { month: "June", desktop: 214 },
]




function ChartAreaLinear({ visitors, views, period }: { visitors: MainPanelViewsObject, views: MainPanelViewsObject, period: TimePeriod }) {

    const [isViews, setIsViews] = useState(true)


    return (
        <div className="h-full bg-secondary-background -mt-5 pt-0 rounded-2xl border border-border"> {/* set card height here */}
            <div className="h-[20%] flex items-stretch border-b border-border p-0 bg-soft-background">
                <div
                    onClick={() => setIsViews(false)}
                    className="py-5 pl-10 pr-15 cursor-pointer hover:bg-border/50 border-r h-full border-border flex flex-col justify-center bg-background
                                border-b hover:border-b-white" style={{ borderBottomColor: isViews ? "var(--color-border)" : "white" }}>
                    <h3 className="text-muted font-medium">Visitors</h3>
                    <div className="flex items-center gap-2">
                        <h2 className="text-white text-4xl font-bold">{visitors[period].reduce((a, b) => a + b.count, 0)}</h2>
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
                        <h2 className="text-white text-4xl font-bold">{views[period].reduce((a, b) => a + b.count, 0)}</h2>
                        {/* <div className="bg-success-background text-success px-2 py-1 rounded-sm text-xs">
                            +48%
                        </div> */}
                    </div>
                </div>
            </div>
            <div className="h-full px-10 py-5">
                <ResponsiveContainer width="100%" height={"80%"}>
                    <AreaChart
                        data={isViews ? views[period] : visitors[period]}
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
                            tickFormatter={(value) => value ? (period === "hours24" ? formatHour(new Date(value)) : shortDateFormatter(new Date(value))) : ""}
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
                            dataKey="count"
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

    const [views, setViews] = useState({ hours24: [], week: [], month: [] })
    const [visitors, setVisitors] = useState({ hours24: [], week: [], month: [] })
    const [onlineVisitors, setOnlineVisitors] = useState(0)
    const [period, setPeriod] = useState<TimePeriod>("week")

    const [countries, setCountries] = useState<Countries>({ hours24: [], week: [], month: [] })
    const [routes, setRoutes] = useState<Routes>({ hours24: [], week: [], month: [] })
    const [operatingSystems, setOperatingSystems] = useState<OperatingSystems>({ hours24: [], week: [], month: [] })
    const [browsers, setBrowsers] = useState<Browsers>({ hours24: [], week: [], month: [] })
    useEffect(() => {
        async function fetchProject() {
            console.time("fetchProject")
            const response = await fetch(`/api/project/${id}`)
            const result = await response.json()
            setProject(result.project)
            setVisitors(result.visitors)
            setViews(result.views)
            setOnlineVisitors(result.onlineVisitors)
            setRoutes(result.routes)
            setCountries(result.countries)
            setBrowsers(result.browsers)
            setOperatingSystems(result.operatingSystems)
            console.log("browsers" , result.browsers)
            console.timeEnd("fetchProject")
            setIsLoading(false)
        }
        fetchProject()
    }, [id])

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

    const timePeriodToText: Record<TimePeriod, string> = {
        "hours24": "Last 24 hours",
        "week": "Last 7 days",
        "month": "Last 30 days"
    }


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
                            <DropdownMenu>
                                <DropdownMenuTrigger className="px-3 py-2 rounded-lg border-border border flex items-center gap-2">
                                    {timePeriodToText[period]}
                                    <BiChevronDown />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-secondary-background text-white p-2">
                                    <DropdownMenuItem
                                        onClick={() => setPeriod("hours24")}
                                        className="data-[highlighted]:bg-muted data-[highlighted]:text-white">Last 24 hours</DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setPeriod("week")}
                                        className="data-[highlighted]:bg-muted data-[highlighted]:text-white">Last 7 days</DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setPeriod("month")}
                                        className="data-[highlighted]:bg-muted data-[highlighted]:text-white">Last 30 days</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="w-[80vw] mx-auto grid grid-cols-6 mb-200 gap-5">
                    {/* Main Chart */}
                    <div className="h-[80vh] col-span-6">
                        <ChartAreaLinear visitors={visitors} views={views} period={period} />
                    </div>
                    {/* Routes */}
                    <Card className="col-span-3 bg-secondary-background text-offwhite pt-0 px-0 overflow-hidden">
                        <CardHeader className="px-0">
                            <div className="grid grid-cols-8 items-center px-6 gap-4 py-4 border-b border-border">
                                <h1 className="text-white col-span-6">Page</h1>
                                <h4>Visitors</h4>
                                <h4>Views</h4>
                            </div>
                        </CardHeader>
                        <CardContent className="card-content-class">
                            {routes[period].slice(0, 5).map((route, index) => {
                                // Calculate opacity based on index (first row 100%, last row maybe 50%)
                                const maxOpacity = 1;
                                const minOpacity = 0.8;
                                const total = routes[period].length;
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
                                                className="text-offwhite col-span-6 overflow-hidden whitespace-nowrap hover:underline"
                                            >
                                                {route.path}
                                            </a>
                                            <h5 className="place-self-end-safe">{route.unique_visitors}</h5>
                                            <h5 className="place-self-end-safe">{route.total_events}</h5>
                                        </div>
                                    </div>
                                );
                            })}
                            <Dialog>
                                <DialogTrigger className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50 bg-background rounded-full border border-border cursor-pointer px-3 py-2">
                                    See All
                                </DialogTrigger>
                                <DialogContent className="col-span-3 bg-secondary-background text-offwhite pt-0 px-0 overflow-hidden max-h-[80vh] flex flex-col">
                                    {/* Header */}
                                    <div className="px-0 flex-shrink-0">
                                        <div className="grid grid-cols-8 items-center px-6 gap-4 py-4 border-b border-border">
                                            <h1 className="text-white col-span-6">Page</h1>
                                            <h4>Visitors</h4>
                                            <h4>Views</h4>
                                        </div>
                                    </div>

                                    {/* Scrollable body */}
                                    <div className="flex-1 overflow-y-auto space-y-1 px-0 relative">
                                        {routes[period].map((route, index) => {
                                            const maxOpacity = 1;
                                            const minOpacity = 0.8;
                                            const total = routes[period].length;
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
                                                            className="text-offwhite col-span-6 overflow-hidden whitespace-nowrap hover:underline"
                                                        >
                                                            {route.path}
                                                        </a>
                                                        <h5 className="place-self-end-safe">{route.unique_visitors}</h5>
                                                        <h5 className="place-self-end-safe">{route.total_events}</h5>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                    {/* Countries */}
                    <Card className="col-span-3 bg-secondary-background text-offwhite pt-0 px-0 overflow-hidden">
                        <CardHeader className="px-0">
                            <div className="grid grid-cols-8 items-center px-6 gap-4 py-4 border-b border-border">
                                <h1 className="text-white col-span-6">Country</h1>
                                <h4>Visitors</h4>
                                <h4>Views</h4>
                            </div>
                        </CardHeader>
                        <CardContent className="card-content-class">
                            {countries[period].slice(0, 5).map((route, index) => {
                                // Calculate opacity based on index (first row 100%, last row maybe 50%)
                                const maxOpacity = 1;
                                const minOpacity = 0.8;
                                const total = routes[period].length;
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
                                                {CountryFlagAndName({ code: route.country })}
                                            </h2>
                                            <h5 className="place-self-end-safe">{route.unique_visitors}</h5>
                                            <h5 className="place-self-end-safe">{route.total_events}</h5>
                                        </div>
                                    </div>
                                );
                            })}
                            <Dialog>
                                <DialogTrigger className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50 bg-background rounded-full border border-border cursor-pointer px-3 py-2">
                                    See All
                                </DialogTrigger>
                                <DialogContent className="col-span-3 bg-secondary-background text-offwhite pt-0 px-0 overflow-hidden max-h-[80vh] flex flex-col">
                                    {/* Header */}
                                    <div className="px-0 flex-shrink-0">
                                        <div className="grid grid-cols-8 items-center px-6 gap-4 py-4 border-b border-border">
                                            <h1 className="text-white col-span-6">Page</h1>
                                            <h4>Visitors</h4>
                                            <h4>Views</h4>
                                        </div>
                                    </div>

                                    {/* Scrollable body */}
                                    <div className="flex-1 overflow-y-auto space-y-1 px-0 relative">
                                        {countries[period].map((route, index) => {
                                            const maxOpacity = 1;
                                            const minOpacity = 0.8;
                                            const total = routes[period].length;
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
                                                            {CountryFlagAndName({ code: route.country })}
                                                        </h2>
                                                        <h5 className="place-self-end-safe">{route.unique_visitors}</h5>
                                                        <h5 className="place-self-end-safe">{route.total_events}</h5>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                    {/* Devices */}
                    <Card className="col-span-3 bg-secondary-background text-offwhite pt-0 px-0 overflow-hidden">
                        <CardHeader className="px-0">
                            <div className="grid grid-cols-8 items-center px-6 gap-4 py-4 border-b border-border">
                                <h1 className="text-white col-span-6">Page</h1>
                                <h4>Visitors</h4>
                                <h4>Views</h4>
                            </div>
                        </CardHeader>
                        <CardContent className="card-content-class">
                            {operatingSystems[period].slice(0, 5).map((route, index) => {
                                // Calculate opacity based on index (first row 100%, last row maybe 50%)
                                const maxOpacity = 1;
                                const minOpacity = 0.8;
                                const total = routes[period].length;
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
                                                {osNameToIcon(route.os)}
                                            </h2>
                                            <h5 className="place-self-end-safe">{route.unique_visitors}</h5>
                                            <h5 className="place-self-end-safe">{route.total_events}</h5>
                                        </div>
                                    </div>
                                );
                            })}
                            <Dialog>
                                <DialogTrigger className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50 bg-background rounded-full border border-border cursor-pointer px-3 py-2">
                                    See All
                                </DialogTrigger>
                                <DialogContent className="col-span-3 bg-secondary-background text-offwhite pt-0 px-0 overflow-hidden max-h-[80vh] flex flex-col">
                                    {/* Header */}
                                    <div className="px-0 flex-shrink-0">
                                        <div className="grid grid-cols-8 items-center px-6 gap-4 py-4 border-b border-border">
                                            <h1 className="text-white col-span-6">Page</h1>
                                            <h4>Visitors</h4>
                                            <h4>Views</h4>
                                        </div>
                                    </div>

                                    {/* Scrollable body */}
                                    <div className="flex-1 overflow-y-auto space-y-1 px-0 relative">
                                        {operatingSystems[period].map((route, index) => {
                                            const maxOpacity = 1;
                                            const minOpacity = 0.8;
                                            const total = routes[period].length;
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
                                                            {osNameToIcon(route.os)}
                                                        </h2>
                                                        <h5 className="place-self-end-safe">{route.unique_visitors}</h5>
                                                        <h5 className="place-self-end-safe">{route.total_events}</h5>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                    {/* Browsers */}
                    <Card className="col-span-3 bg-secondary-background text-offwhite pt-0 px-0 overflow-hidden">
                        <CardHeader className="px-0">
                            <div className="grid grid-cols-8 items-center px-6 gap-4 py-4 border-b border-border">
                                <h1 className="text-white col-span-6">Page</h1>
                                <h4>Visitors</h4>
                                <h4>Views</h4>
                            </div>
                        </CardHeader>
                        <CardContent className="card-content-class">
                            {browsers[period].slice(0, 5).map((route, index) => {
                                // Calculate opacity based on index (first row 100%, last row maybe 50%)
                                const maxOpacity = 1;
                                const minOpacity = 0.8;
                                const total = routes[period].length;
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
                                                {BrowserIcon({ name: route.browser }) as any}
                                            </h2>
                                            <h5 className="place-self-end-safe">{route.unique_visitors}</h5>
                                            <h5 className="place-self-end-safe">{route.total_events}</h5>
                                        </div>
                                    </div>
                                );
                            })}
                            <Dialog>
                                <DialogTrigger className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50 bg-background rounded-full border border-border cursor-pointer px-3 py-2">
                                    See All
                                </DialogTrigger>
                                <DialogContent className="col-span-3 bg-secondary-background text-offwhite pt-0 px-0 overflow-hidden max-h-[80vh] flex flex-col">
                                    {/* Header */}
                                    <div className="px-0 flex-shrink-0">
                                        <div className="grid grid-cols-8 items-center px-6 gap-4 py-4 border-b border-border">
                                            <h1 className="text-white col-span-6">Page</h1>
                                            <h4>Visitors</h4>
                                            <h4>Views</h4>
                                        </div>
                                    </div>

                                    {/* Scrollable body */}
                                    <div className="flex-1 overflow-y-auto space-y-1 px-0 relative">
                                        {browsers[period].map((route, index) => {
                                            const maxOpacity = 1;
                                            const minOpacity = 0.8;
                                            const total = routes[period].length;
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
                                                            {BrowserIcon({ name: route.browser }) as any}
                                                        </h2>
                                                        <h5 className="place-self-end-safe">{route.unique_visitors}</h5>
                                                        <h5 className="place-self-end-safe">{route.total_events}</h5>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
