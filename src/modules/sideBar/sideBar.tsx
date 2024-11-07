/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2023-10-19 15:32:31
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-11-03 17:00:50
 * @FilePath: /wetalk_web/src/modules/sideBar/sideBar.tsx
 * @Description: Description
 */


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
import SelfInfo from './selfInfo'
export default function SideBar() {
    const avatar = useSelector(
        (state: State) => state.user && state.user.avatar,
    );
    const userName = useSelector(
        (state: State) => state.user && state.user.username,
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
        {
            selfInfoDialogVisible && isLogin && (
                <SelfInfo
                    visible={selfInfoDialogVisible}
                    onClose={() => toggleSelfInfoDialogVisible(false)}
                />
            )
        }
        {isLogin && avatar && (
            <Avatar
                className={Style.avatar}
                src={avatar}
                onClick={() => toggleSelfInfoDialogVisible(true)}
            />
        )}
        {isLogin  && (
            <div className={Style.username}>{userName}</div>
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