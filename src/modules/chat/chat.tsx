import React, { useEffect } from 'react'
import Style from './chat.less'
import MessageList from './MessageList'
import { State, GroupMember } from '../../state/reducer';
import { useSelector } from 'react-redux';
import HeaderBar from './HeaderBar'
import ChatInput from './ChatInput'
import useIsLogin from '../../hooks/useIsLogin';
import useAction from '../../hooks/useAction';
import {
    getGroupOnlineMembers,
    getUserOnlineStatus,
    updateHistory,
} from '../../service';
export default function Chat() {
    const focus = useSelector((state: State) => { console.log(state); return state.focus });
    const isLogin = useIsLogin();
    const action = useAction();
    const self = useSelector((state: State) => state.user?._id) || '';
    const linkman = useSelector((state: State) => state.linkmans[focus] || {});
    function handleClickFunction() {
    }
    async function fetchGroupOnlineMembers() {
        let onlineMembers: GroupMember[] | { cache: true } = [];
        if (isLogin) {
            onlineMembers = await getGroupOnlineMembers(focus);
        }
        if (Array.isArray(onlineMembers)) {
            action.setLinkmanProperty(focus, 'onlineMembers', onlineMembers);
        }
    }
    async function fetchUserOnlineStatus() {
        console.log(focus)
        const isOnline = await getUserOnlineStatus(focus.replace(self, ''));
        action.setLinkmanProperty(focus, 'isOnline', isOnline);
    }

    useEffect(() => {
        if (!linkman || !linkman.type) {
            return () => { };
        }
        const request =
            linkman.type === 'group' 
                ? fetchGroupOnlineMembers
                : fetchUserOnlineStatus;
        request();
        const timer = setInterval(() => request(), 1000 * 60);
        return () => clearInterval(timer);
    }, [focus]);

    console.log(linkman)
    return <div className={Style.chat}>
        <HeaderBar
            id={linkman._id}
            name={linkman.name}
            type={linkman.type}
            onlineMembersCount={linkman.onlineMembers?.length}
            isOnline={linkman.isOnline}
            onClickFunction={handleClickFunction}
        />
        <MessageList />
        <ChatInput />
    </div>
}