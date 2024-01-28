import React, { useRef, useContext, useState, useEffect } from 'react'
import Avatar from '../../../components/Avatar/Avatar';
import Style from './MessageComponent.less'
import { ShowUserOrGroupInfoContext } from '../../../context';
import themes from '../../../themes';
import { getRandomColor, getPerRandomColor } from '../../../utils/getRandomColor';
import Time from '../../../utils/time';
import client from '../../../config/client';
import TextMessage from './TextMessage';
import ImageMessage from './ImageMessage'

interface Props {
    id: string;
    linkmanId: string;
    isSelf: boolean;
    userId: string;
    avatar: string;
    username: string;
    originUsername: string;
    tag: string;
    time: string;
    type: string;
    content: string;
    loading: boolean;
    percent: number;
    shouldScroll: boolean;
    tagColorMode: string;
    isAdmin?: boolean;

}
export default function MessageComponent(props: Props) {
    const { content, avatar, isSelf, type, userId, username, tag, tagColorMode, time, isAdmin, loading, percent, shouldScroll } = props
    const $container = useRef<HTMLDivElement>(null)
    const context = useContext(ShowUserOrGroupInfoContext)
    const [showButtonList, setShowButtonList] = useState(false)
    let tagColor = `rgb(${themes.default.primaryColor})`;
    if (tagColorMode === 'fixedColor') {
        tagColor = getRandomColor(tag);
    } else if (tagColorMode === 'randomColor') {
        tagColor = getPerRandomColor(username);
    }

    useEffect(() => {
        if (shouldScroll) {
            ($container as any).current.scrollIntoView();
        }
    }, [shouldScroll])

    function formatTime() {
        const messageTime = new Date(time);
        const nowTime = new Date();
        if (Time.isToday(nowTime, messageTime)) {
            return Time.getHourMinute(messageTime);
        }
        if (Time.isYesterday(nowTime, messageTime)) {
            return `昨天 ${Time.getHourMinute(messageTime)}`;
        }
        return `${Time.getMonthDate(messageTime)} ${Time.getHourMinute(
            messageTime,
        )}`;
    }
    function handleClickAvatar(showUserInfo: (userinfo: any) => void) {
        if (!isSelf && type !== 'system') {
            showUserInfo({
                _id: userId,
                username,
                avatar,
            });
        }
    }

    const handleMouseEnter = () => {
        if (type === 'system') {
            return;
        }
        if (isAdmin || (!client.disableDeleteMessage && isSelf)) {
            setShowButtonList(true);
        }
    };

    const handleMouseLeave = () => {
        if (isAdmin || (!client.disableDeleteMessage && isSelf)) {
            setShowButtonList(true);
        }
    };

    const renderContent = () => {
        switch (type) {
            case 'text': {
                return <TextMessage content={content} />;
            }
            case 'image': {
                return (
                    <ImageMessage
                        src={content}
                        loading={loading}
                        percent={percent}
                    />
                );
            }

            default:
                return <div className="unknown">不支持的消息类型</div>;
        }

    }



    return (
        <div className={`${Style.message} ${isSelf ? Style.self : ''}`}
            ref={$container}>
            <Avatar
                className={Style.avatar}
                src={avatar}
                size={44}
                onClick={() =>
                    // @ts-ignore
                    handleClickAvatar(context.showUserInfo)
                }
            />
            <div className={Style.right}>
                <div className={Style.nicknameTimeBlock}>
                    {tag && (
                        <span
                            className={Style.tag}
                            style={{ backgroundColor: tagColor }}
                        >
                            {tag}
                        </span>
                    )}
                    <span className={Style.nickname}>{username}</span>
                    <span className={Style.time}>{formatTime()}</span>
                </div>
                <div
                    className={Style.contentButtonBlock}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className={Style.content}>
                        {renderContent()}
                    </div>
                </div>
                <div className={Style.arrow} />
            </div>

        </div>

    )
}