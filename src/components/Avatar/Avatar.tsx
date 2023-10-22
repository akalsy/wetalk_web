import React from "react"
type Props = {
    className?: string
    src?: string
    onClick?: () => void
}

export default function Avatar({
    className = "",
    src,
    onClick
}: Props) {
    console.log(className)
    return <img className={className}
        src={src}
        onClick={onClick}
    />

}