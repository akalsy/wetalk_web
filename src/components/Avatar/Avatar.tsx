import React from "react"
type Props = {
    className?: string
    src?: string
    size?: number
    onClick?: () => void
    onMouseLeave?: () => void
    onMouseEnter?: () => void
}

export default function Avatar({
    className = "",
    src,
    onClick,
    onMouseLeave,
    onMouseEnter,
    size = 60,
}: Props) {
    return <img className={className}
        src={src}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    />

}