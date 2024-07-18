import React, { useEffect, useState ,useContext} from 'react'
import Style from './chat.less'
import MessageList from './MessageList'
import { State, GroupMember } from '../../state/reducer';
import { useSelector } from 'react-redux';
import HeaderBar from './HeaderBar'
import ChatInput from './ChatInput'
import useIsLogin from '../../hooks/useIsLogin';
import useAction from '../../hooks/useAction';
import GroupManagePanel from './GroupManagePanel'
import {
    getGroupOnlineMembers,
    getUserOnlineStatus,
    updateHistory,
} from '../../service';
import { ShowUserOrGroupInfoContext } from '../../context';
export default function Chat() {
    const focus = useSelector((state: State) => { ; return state.focus });
    const isLogin = useIsLogin();
    const action = useAction();
    const self = useSelector((state: State) => state.user?._id) || '';
    const linkman = useSelector((state: State) => state.linkmans[focus] || {});
    const [groupManagePanel, toggleGroupManagePanel] = useState(false);
    const context = useContext(ShowUserOrGroupInfoContext);



    function handleBodyClick(e: MouseEvent) {
        const { currentTarget } = e;
        let target = e.target as HTMLDivElement;
        do {
            if (target.getAttribute('data-float-panel') === 'true') {
                return;
            }
            // @ts-ignore
            target = target.parentElement;
        } while (target && target !== currentTarget);
        toggleGroupManagePanel(false);
    }
    useEffect(() => {
        document.body.addEventListener('click', handleBodyClick, false);
        return () => {
            document.body.removeEventListener('click', handleBodyClick, false);
        };
    }, []);
    async function handleClickFunction() {
        if (linkman.type === 'group') {
            let onlineMembers: GroupMember[] | { cache: true } = [];
            if (isLogin) {
                onlineMembers = await getGroupOnlineMembers(focus);
            }
            if (Array.isArray(onlineMembers)) {
                action.setLinkmanProperty(
                    focus,
                    'onlineMembers',
                    onlineMembers,
                );
            }
            toggleGroupManagePanel(true);
        } else {
            // @ts-ignore
            context.showUserInfo(linkman);
        }

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


        {linkman.type === 'group' && (
            <GroupManagePanel
                visible={groupManagePanel}
                onClose={() => toggleGroupManagePanel(false)}
                isLogin={isLogin}
                groupId={linkman._id}
                avatar={linkman.avatar}
                creator={linkman.creator}
                onlineMembers={linkman.onlineMembers}
                groupNameOld={linkman.name}
            />
        )}
    </div>
}