import React from "react"
type Props = {
    className?: string
    src?: string
    size?: number
    onClick?: () => void
}

export default function Avatar({
    className = "",
    src,
    onClick,
    size = 60,
}: Props) {
    return <img className={className}
        src={src}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        onClick={onClick}
    />

}