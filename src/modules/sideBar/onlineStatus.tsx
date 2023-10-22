
import React from "react"
import Style from './onlineStatus.less'

interface OnlineStatusProps {
    status: string,
    className?: string,
}
export default function OnlineStatus(props: OnlineStatusProps) {

    const { className, status } = props
    return <div className={`${className} ${Style.onlineStatus}`}>
        <div className={`${status} ${Style.status}`}></div>
    </div>
}