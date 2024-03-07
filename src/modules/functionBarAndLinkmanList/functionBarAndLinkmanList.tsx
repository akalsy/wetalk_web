
import React from 'react';
import Style from "./functionBarAndLinkmanList.less"
import useAction from "../../hooks/useAction"
import useIsLogin from '../../hooks/useIsLogin';
import LinkmanList from './LinkmanList';
import useAero from '../../hooks/useAero';
import FunctionBar from "./FunctionBar"
function FunctionBarAndLinkmanList() {
    const action = useAction();
    const isLogin = useIsLogin();
    const aero = useAero();

    return (
        <div className={Style.functionBarAndLinkmanList} >
            {!isLogin && <div className={Style.loginTips}>
                游客你好，请
                <b className={Style.loginBton} onClick={() => {
                    action.setStatus('loginRegisterDialogVisible', true)
                    // console.log(1)
                }} role="button"> 登陆</b>后参与聊天
            </div>}
            <div className={Style.container}   {...aero}>
                {isLogin && <FunctionBar/>}
                <LinkmanList />
            </div>
        </div>
    );
}

export default FunctionBarAndLinkmanList;