
import React from 'react';
import Style from "./functionBarAndLinkmanList.less"
import useIsLogin from '../../hooks/useIsLogin';
import LinkmanList from './LinkmanList';
import useAero from '../../hooks/useAero';
import FunctionBar from "./FunctionBar"
function FunctionBarAndLinkmanList() {
    const isLogin = useIsLogin();
    const aero = useAero();

    return (
        <div className={Style.functionBarAndLinkmanList} >
            <div className={Style.container}   {...aero}>
                {isLogin && <FunctionBar/>}
                <LinkmanList />
            </div>
        </div>
    );
}

export default FunctionBarAndLinkmanList;