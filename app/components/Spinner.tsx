import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

// Default values shown
export default function Spinner({ size = "45", speed = "1.75", color = "black" }) {
    return (
        <Bouncy
            size={size}
            speed={speed}
            color={color}
        />
    )
}
