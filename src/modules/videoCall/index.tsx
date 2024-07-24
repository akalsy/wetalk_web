/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2024-06-26 13:55:42
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-07-23 11:06:24
 * @FilePath: /wetalk_web/src/modules/videoCall/index.tsx
 * @Description: Description
 */
import React, { useRef, useEffect } from 'react'

import { useSelector } from 'react-redux';
import useAction from '../../hooks/useAction';
import style from './index.less'
import RtcConnect from '../../utils/rtcConnect'
import { State } from '../../state/reducer';
export default function VideoCall(props: any) {
    const action = useAction();
    const focus = useSelector((state: State) => state.focus);
    const messageOfCall = useSelector((state: State)=> state.messageOfVideoCall);
    console.log(messageOfCall)

    const remoteVideo: any = useRef(null);
    const localVideo: any = useRef(null)
    const loggerEl: any = useRef(null)
    const selfId = useSelector((state: State) => state?.user?._id ? state.user._id : "");

    useEffect(() => {
        if (localVideo?.current) {
            localVideo.current.onloadeddata = () => {
                localVideo.current.play();
            }
        }

        if (remoteVideo) {
            remoteVideo.current.onloadeddata = () => {
                remoteVideo.current.play();
            }
        }
    }, [])


    const rtcConnect = new RtcConnect(loggerEl, localVideo, remoteVideo, 'offer')
    rtcConnect.startLive(selfId);
    async function close() {
        await rtcConnect.stopLive();
        action.setVideoCallState(false)
    }




    return <div className={style.videocall}>
        <i className={`${style.iconfont} iconfont icon-close`} onClick={() => close()}></i>
        <video className={style.remotevideo} ref={remoteVideo}></video>
        <video className={style.localvideo} ref={localVideo} muted></video>
        <div className={style.logger} ref={loggerEl}></div>
    </div>
}