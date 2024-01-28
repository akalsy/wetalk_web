import React, { useRef } from 'react'
import Style from './MessageList.less'
import { useSelector } from 'react-redux'
import { State, Message } from '../../state/reducer';
import MessageComponent from './MessageComponent/MessageComponent'
export default function Chat() {


    function handleScroll() {

    }
    const selfId = useSelector((state: State) => state.user?._id)
    const focus = useSelector((state: State) => state.focus);
    const isGroup = useSelector(
        (state: State) => {
            if (state.linkmans[focus]) {

                return state.linkmans[focus].type === 'group'
            } else {
                return false
            }
        }
    );
    const tagColorMode = useSelector(
        (state: State) => state.status.tagColorMode,
    );
    const creator = useSelector(
        (state: State) => { return state.linkmans[focus] && state.linkmans[focus].creator }
    );
    const messages = useSelector((state: State) => { return state.linkmans[focus] ? state.linkmans[focus].messages : {} })
    const $list = useRef<HTMLDivElement>(null)
    function renderMessage(message: Message) {
        const isSelf = message.from._id === selfId
        let { tag } = message.from;
        if (!tag && isGroup && message.from._id === creator) {
            tag = '群主';
        }
        let shouldScroll = true;

        if ($list.current) {
            // @ts-ignore
            const { scrollHeight, clientHeight, scrollTop } = $list.current;
            shouldScroll =
                isSelf ||
                scrollHeight === clientHeight ||
                scrollTop === 0 ||
                scrollTop > scrollHeight - clientHeight * 2;
        }
        return (<MessageComponent
            key={message._id}
            id={message._id}
            linkmanId={focus}
            isSelf={isSelf}
            userId={message.from._id}
            avatar={message.from.avatar}
            username={message.from.username}
            originUsername={message.from.originUsername}
            time={message.createTime}
            type={message.type}
            content={message.content}
            tag={tag}
            loading={message.loading}
            percent={message.percent}
            shouldScroll={shouldScroll}
            tagColorMode={tagColorMode}
        />)

    }
    return <div className={Style.container}>
        <div className={`${Style.messageList} show-scrollbar`}
            onScroll={handleScroll}
            ref={$list}
        >
            {messages != {}  && messages ? Object.values(messages).map((message) =>
                renderMessage(message),
            ) : null}


        </div>

    </div>
}