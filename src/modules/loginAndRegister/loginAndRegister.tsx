import React from 'react'
import Dialog from '../../components/Dialog/Dialog';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducer';
import useAction from '../../hooks/useAction';
import {
    Tabs,
    TabPane,
    TabContent,
    ScrollableInkTabBar,
} from '../../components/Tabs';
import Login from './Login'
import Register from './Register'
import Style from './loginAndRegister.less'
export default function LoginAndRegister() {
    const action = useAction();

    const loginRegisterDialogVisible = useSelector(
        (state: State) => state.status.loginRegisterDialogVisible,
    );
    return <Dialog
        visible={loginRegisterDialogVisible}
        closable={false}
        onClose={() => action.toggleLoginRegisterDialog(false)}
    >

        <Tabs
            className={Style.login}
            defaultActiveKey="login"
            renderTabBar={() => <ScrollableInkTabBar />}
            renderTabContent={() => <TabContent />}
        >
            <TabPane tab="登录" key="login">
                <Login />
            </TabPane>
            <TabPane tab="注册" key="register">
                <Register />
            </TabPane>
        </Tabs>

    </Dialog>
}