

import React, { useState } from 'react'
import Style from './sideBar.less'
import { useSelector } from 'react-redux';
import { State } from '../../state/reducer';
import useIsLogin from '../../hooks/useIsLogin';
import IconButton from '../../components/IconButton/IconButton';
import Tooltip from '../../components/Tooltip/Tooltip';
import useAction from '../../hooks/useAction';
import Message from '../../components/Message/Message';

import OnlineStatus from './onlineStatus'
import socket from '../../socket';

import Avatar from '../../components/Avatar/Avatar';
export default function SideBar() {
    const avatar = useSelector(
        (state: State) => state.user && state.user.avatar,
    );
    const isConnect = useSelector((state: State) => state.connect);
    const action = useAction();

    const isLogin = useIsLogin();
    const [selfInfoDialogVisible, toggleSelfInfoDialogVisible] = useState(false);

    function renderTooltip(text: string, component: JSX.Element) {
        const children = <div>{component}</div>;
        return (
            <Tooltip

                placement="right"
                mouseEnterDelay={0.3}
                overlay={<span>{text}</span>}
            >

                {children}
            </Tooltip>
        )
    }

    function logout() {
        action.logout();
        window.localStorage.removeItem('token');
        Message.success('您已经退出登录');
        socket.disconnect();
        socket.connect();
    }
    return <div className={Style.sideBar}>
        {isLogin && avatar && (
            <Avatar
                className={Style.avatar}
                src={avatar}
                onClick={() => toggleSelfInfoDialogVisible(true)}
            />
        )}
        {isLogin && (
            <OnlineStatus
                className={Style.status}
                status={isConnect ? 'online' : 'offline'}
            />
        )}


        <div className={Style.buttons}>

            {isLogin &&
                renderTooltip(
                    '退出登录',
                    <IconButton
                        width={40}
                        height={40}
                        icon="logout"
                        iconSize={26}
                        onClick={logout}
                    />,
                )}
        </div>

    </div>
}