import React, { useMemo, useState, useEffect, useRef } from 'react';
// import { State } from './state/reducer'
import { useSelector } from 'react-redux';
import { isMobile } from './utils/ua';
import inobounce from './utils/inobounce';
import Style from './App.less';
import { createContext } from 'react';

import FunctionBarAndLinkmanList from '../src/modules/functionBarAndLinkmanList/functionBarAndLinkmanList'

import LoginAndRegister from '../src/modules/loginAndRegister/loginAndRegister'

/**
* 获取窗口宽度百分比
*/
function getWidthPercent() {
  let width = 0.6;
  if (isMobile) {
    width = 1;
  } else if (window.innerWidth < 1000) {
    width = 0.9;
  } else if (window.innerWidth < 1300) {
    width = 0.8;
  } else if (window.innerWidth < 1600) {
    width = 0.7;
  } else {
    width = 0.6;
  }
  return width;
}
function App() {
  const $app = useRef(null);
  // const isReady = useSelector((state: State) => state.status.ready)
  const backgroundImage = '/GroupAvatar/bk.jpg'
  // 计算窗口高度/宽度百分比
  const [width, setWidth] = useState(getWidthPercent());
  const [height, setHeight] = useState(getHeightPercent());

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
    [backgroundImage, backgroundWidth, backgroundHeight],
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

  // eslint-disable-next-line import/prefer-default-export
  const ShowUserOrGroupInfoContext = createContext(null);
  console.log(Style)
  return (
    <div className={Style.App}
      style={style}
    >
      <LoginAndRegister></LoginAndRegister>
      <div className={Style.child} style={childStyle}>
        <ShowUserOrGroupInfoContext.Provider
          value={(contextValue as unknown) as null}
        >
          <div className={Style.sideBar} />
          <FunctionBarAndLinkmanList />
          <div className={Style.chat} />
        </ShowUserOrGroupInfoContext.Provider>
      </div>
    </div>
  );
}

export default App;
