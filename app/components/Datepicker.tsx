"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import type { TimeRange } from "../types/types"


export function DatePicker({ dateRange , setDateRange } : { dateRange: TimeRange , setDateRange: React.Dispatch<React.SetStateAction<TimeRange>> }) {
    const [open, setOpen] = React.useState(false)


    const formatDateRange = () => {
        if (!dateRange ) return "Select date"
        const { from: start, to: end } = dateRange
        if (!end) return start.toLocaleDateString()
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
    }

    return (
        <div className="flex flex-col gap-3 text-white">
            <Label htmlFor="date" className="px-1">
                date
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-56 justify-between font-normal"
                    >
                        {formatDateRange()}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0 bg-soft-background"
                    align="start"
                >
                    <Calendar
                        mode="range"
                        selected={dateRange}
                        captionLayout="dropdown"
                        onSelect={(range) => {
                            if(!range || !range.from) {
                                setDateRange(undefined)
                                return
                            }
                            setDateRange({ from: range.from, to: range?.to}) // update state here
                            if (range && range.from && range.to) setOpen(false)
                        }}
                        className="bg-soft-background text-white dark"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
