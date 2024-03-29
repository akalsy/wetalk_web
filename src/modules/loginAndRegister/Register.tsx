import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import Style from './loginAndRegister.less';
import { register, getLinkmansLastMessagesV2 } from '../../service';
import platform from "platform"
import useAction from '../../hooks/useAction';
import { useDispatch } from 'react-redux';
import convertMessage from '../../utils/convertMessage';
import getFriendId from '../../utils/getFriendId';
import { Message } from '../../state/reducer';
import { ActionTypes } from '../../state/action';
export default function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const action = useAction()
    const dispatch = useDispatch()
    async function handleRegister() {
        const user = await register(
            username,
            password,
            platform.os?.family,
            platform.name,
            platform.description,
        );
        if (user) {
            action.setUser(user);
            action.toggleLoginRegisterDialog(false);
            window.localStorage.setItem('token', user.token);

            const linkmanIds = [
                ...user.groups.map((group: any) => group._id),
                ...user.friends.map((friend: any) =>
                    getFriendId(friend.from, friend.to._id),
                ),
            ];
            const linkmanMessages = await getLinkmansLastMessagesV2(linkmanIds);
            Object.values(linkmanMessages).forEach(
                // @ts-ignore
                ({ messages }: { messages: Message[] }) => {
                    messages.forEach(convertMessage);
                },
            );
            dispatch({
                type: ActionTypes.SetLinkmansLastMessages,
                payload: linkmanMessages,
            });
        }
    }

    return <div className={Style.loginRegister}>
        <h3 className={Style.title}>用户名</h3>
        <Input
            className={Style.input}
            value={username}
            onChange={setUsername}
            onEnter={handleRegister}
        />
        <h3 className={Style.title}>密码</h3>
        <Input
            className={Style.input}
            type="password"
            value={password}
            onChange={setPassword}
            onEnter={handleRegister}
        />
        <button
            className={Style.button}
            onClick={handleRegister}
            type="button"
        >
            注册
        </button>
    </div>
}