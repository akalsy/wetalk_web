import React, { useMemo, useState, useEffect, useRef } from 'react';
import './style/iconfont.less';
import { State } from './state/reducer'
import { useSelector } from 'react-redux';
import { isMobile } from './utils/ua';
import inobounce from './utils/inobounce';
import Style from './App.less';
import FunctionBarAndLinkmanList from '../src/modules/functionBarAndLinkmanList/functionBarAndLinkmanList'
import LoginAndRegister from '../src/modules/loginAndRegister/loginAndRegister'
import SideBar from '../src/modules/sideBar/sideBar'
import Chat from '../src/modules/chat/chat'
import VideoCall from '../src/modules/videoCall/index'
import UserInfo from './modules/UserInfo';
import GroupInfo from './modules/GroupInfo';
import { ShowUserOrGroupInfoContext } from './context'
import useIsLogin from './hooks/useIsLogin';
import useAction from './hooks/useAction';
import useIsVideoCall, { useCallOfMessage } from './hooks/useIsVideoCall';

import Dialog from './components/Dialog/Dialog';
import Button from "./components/Button/Button"

/**
* 获取窗口宽度百分比
*/
function getWidthPercent() {
  let width = 0.9;
  // if (isMobile) {
  //   width = 1;
  // } else if (window.innerWidth < 1000) {
  //   width = 0.9;
  // } else if (window.innerWidth < 1300) {
  //   width = 0.8;
  // } else if (window.innerWidth < 1600) {
  //   width = 0.7;
  // } else {
  //   width = 0.6;
  // }
  return width;
}
function App() {
  const $app = useRef(null);
  // const isReady = useSelector((state: State) => state.status.ready)
  const backgroundImage = require('./assets/images/bk.png')
  // 计算窗口高度/宽度百分比
  const [width, setWidth] = useState(getWidthPercent());
  const [height, setHeight] = useState(getHeightPercent());
  const [callDialogStatus, setCallDialogStatus] = useState(false)
  const [callTitle, setCallTitle] = useState("")

  useEffect(() => {
    window.onresize = () => {
      setWidth(getWidthPercent());
      setHeight(getHeightPercent());
    };

    // @ts-ignore
    inobounce($app.current);
  }, []);
  /**
  * 获取窗口高度百分比
  */
  // 获取底图尺寸
  const [backgroundWidth, setBackgroundWidth] = useState(window.innerWidth);
  const [backgroundHeight, setBackgroundHeight] = useState(
    window.innerHeight,
  );

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setBackgroundWidth(window.innerWidth);
      setBackgroundHeight(window.innerHeight);
    };
    img.src = backgroundImage;
  }, [backgroundImage]);


  function getHeightPercent() {
    let height = 0.8;
    if (isMobile) {
      height = 1;
    } else if (window.innerHeight < 1000) {
      height = 0.9;
    } else {
      height = 0.8;
    }
    return height;
  }
  const style = useMemo(
    () => ({
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: `${backgroundWidth}px ${backgroundHeight}px`,
      backgroundRepeat: 'no-repeat',
    }),
    [backgroundImage, "100%", backgroundHeight],
  )

  // 聊天窗口样式
  const childStyle = useMemo(
    () => ({
      width: `${width * 100}%`,
      height: `${height * 100}%`,
      left: `${((1 - width) / 2) * 100}%`,
      top: `${((1 - height) / 2) * 100}%`,
    }),
    [width, height],
  );

  // 游客窗口样式
  const visitorStyle = useMemo(
    () => ({
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% 100%",
      width: `${width * 100}%`,
      height: `${height * 100}%`,
    }),
    [backgroundImage],
  );

  const videoStyle = {
    backgroundColor: "#fff",
    width: `${width * 100}%`,
    height: `${height * 100}%`,
  }

  const [userInfoDialog, toggleUserInfoDialog] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [groupInfoDialog, toggleGroupInfoDialog] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);

  const contextValue = useMemo(
    () => ({
      showUserInfo(user: any) {
        setUserInfo(user);
        toggleUserInfoDialog(true);
      },
      showGroupInfo(group: any) {
        setGroupInfo(group);
        toggleGroupInfoDialog(true);
      },
    }),
    [],
  );
  const isLogin = useIsLogin();
  const action = useAction();

  // const [videoCallVisiable, setVideoCallVisiable] = useState(false)
  const videoCallState = useIsVideoCall()
  const callOfMessage = useCallOfMessage()
  function setVideoCallVisiable(state: boolean) {
    action.setVideoCallState(state)
  }


  useEffect(() => {
    console.log("callOfMessage:", callOfMessage)
    if(callOfMessage?.type == "videoCallOffer") {
      setCallTitle(`来自${callOfMessage?.from?.username}的视频通话`);
      setCallDialogStatus(true)
    }
  }, [callOfMessage])


  const handleOnCall = () => {
    setCallDialogStatus(false)
    action.setVideoCallState(true)
  }


  return (
    <div className={Style.App}
      style={style}
    >
      <LoginAndRegister></LoginAndRegister>
      {isLogin && <div className={Style.child} style={childStyle}>
        <ShowUserOrGroupInfoContext.Provider
          value={(contextValue as unknown) as null}
        >
          <SideBar />
          <FunctionBarAndLinkmanList />
          <Chat />
        </ShowUserOrGroupInfoContext.Provider>
      </div>}
      {!isLogin && <div className={Style.loginTips} style={visitorStyle}>
        游客你好，请
        <b className={Style.loginBton} onClick={() => {
          action.setStatus('loginRegisterDialogVisible', true)
          // console.log(1)
        }} role="button"> 登陆</b>后加入聊天
      </div>}
      {videoCallState && <VideoCall style={videoStyle} closeVideoCall={() => setVideoCallVisiable(false)} setVideoCallState={() => setVideoCallVisiable(true)}>
      </VideoCall>}
      {isLogin && <UserInfo
        visible={userInfoDialog}
        onClose={() => toggleUserInfoDialog(false)}
        // @ts-ignore
        user={userInfo}
      />}
      {isLogin && <GroupInfo
        visible={groupInfoDialog}
        onClose={() => toggleGroupInfoDialog(false)}
        // @ts-ignore
        group={groupInfo}
      />}

      <Dialog
        className={Style.deleteGroupConfirmDialog}
        title={callTitle}
        visible={callDialogStatus}
        onClose={() => setCallDialogStatus(false)}
      >
        <Button
          className={Style.deleteGroupConfirmButton}
          type="danger"
          onClick={handleOnCall}
        >
          接听
        </Button>
        <Button
          className={Style.deleteGroupConfirmButton}
          onClick={() => setCallDialogStatus(false)}
        >
          取消
        </Button>
      </Dialog>

    </div>
  );
}

export default App;
