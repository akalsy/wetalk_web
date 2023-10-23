import React from "react";
import Time from '../../utils/time';

import Style from "./contacts.less";
import { useSelector } from "react-redux";
import Avatar from '../../components/Avatar/Avatar';
import { State } from "../../state/reducer"
import { useStore } from '../../hooks/useStore';
import useAero from '../../hooks/useAero';
import { updateHistory } from '../../service';
import useAction from '../../hooks/useAction';
import { isMobile } from '../../utils/ua';

interface ContactList {
    id: string;
    name: string;
    avatar: string;
    /** 消息预览 */
    preview: string;
    unread: number;
    time: Date;
}

export default function Contact(props: ContactList) {
    const { id, name, avatar, preview, unread, time } = props;
    const { linkmans } = useStore();
    const aero = useAero();
    const action = useAction();

    function formatTime() {
        const nowTime = new Date();
        if (Time.isToday(nowTime, time)) {
            return Time.getHourMinute(time);
        }
        if (Time.isYesterday(nowTime, time)) {
            return '昨天';
        }
        return Time.getMonthDate(time);
    }
    async function handleClick() {
        // Update next linkman read history
        const nextFocusLinkman = linkmans[id];
        if (nextFocusLinkman) {
            const messageKeys = Object.keys(nextFocusLinkman.messages);
            if (messageKeys.length > 0) {
                const lastMessageId =
                    nextFocusLinkman.messages[
                        messageKeys[messageKeys.length - 1]
                    ]._id;
                updateHistory(nextFocusLinkman._id, lastMessageId);
            }
        }

        action.setFocus(id);
        if (isMobile) {
            action.setStatus('functionBarAndLinkmanListVisible', false);
        }
    }
    const focus = useSelector((state: State) => state.focus)
    return <div className={`${Style.linkman} ${id === focus ? Style.focus : ''}`} onClick={handleClick}
        role="button"
        {...aero}>
        <Avatar src={avatar} size={48}/>
        <div className={Style.container}>
            <div className={`${Style.rowContainer} ${Style.nameTimeBlock}`}>
                <p className={Style.name}>{name}</p>
                <p className={Style.time}>{formatTime()}</p>
            </div>
            <div
                className={`${Style.rowContainer} ${Style.previewUnreadBlock}`}
            >
                <p
                    className={Style.preview}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: preview }}
                />
                {unread > 0 && (
                    <div className={Style.unread}>
                        <span>{unread > 99 ? '99+' : unread}</span>
                    </div>
                )}
            </div>
        </div>
    </div>
}