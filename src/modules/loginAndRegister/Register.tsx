import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import Style from './loginAndRegister.less';
export default  function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    function handleLogin() {

    }
    return <div className={Style.loginRegister}>
        <h3 className={Style.title}>用户名</h3>
        <Input
            className={Style.input}
            value={username}
            onChange={setUsername}
            onEnter={handleLogin}
        />
        <h3 className={Style.title}>密码</h3>
        <Input
            className={Style.input}
            type="password"
            value={password}
            onChange={setPassword}
            onEnter={handleLogin}
        />
        <button
            className={Style.button}
            onClick={handleLogin}
            type="button"
        >
            注册
        </button>
    </div>
}