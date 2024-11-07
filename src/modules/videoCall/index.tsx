/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2024-06-26 13:55:42
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-11-04 22:24:51
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
    const messageOfCall = useSelector((state: State) => state.messageOfVideoCall);
    console.log(focus)

    const remoteVideo: any = useRef(null);
    const localVideo: any = useRef(null)
    const loggerEl: any = useRef(null)
    const selfId = useSelector((state: State) => state?.user?._id ? state.user._id : "");
    let rtcConnect: any;

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


    useEffect(() => {
        // // socket.onmessage = e => {
        // //     const { type, sdp, iceCandidate } = JSON.parse(e.data)
        // //     if (type === 'answer') {
        // //         peer.setRemoteDescription(new RTCSessionDescription({ type, sdp }));
        // //     } else if (type === 'answer_ice') {
        // //         peer.addIceCandidate(iceCandidate);
        // //     } else if (type === 'offer') {
        // //         startLive(new RTCSessionDescription({ type, sdp }));
        // //     } else if (type === 'offer_ice') {
        // //         peer.addIceCandidate(iceCandidate);
        // //     }
        // // };
        console.log(messageOfCall)
        let  type, sdp, iceCandidate;
        if(messageOfCall.content) {
            let content =  JSON.parse(messageOfCall?.content);
            type = content?.type;
            sdp = content?.sdp;
            iceCandidate = content?.iceCandidate;
        }
        if (messageOfCall?.type == 'startLive') {
            rtcConnect = new RtcConnect(loggerEl, localVideo, remoteVideo, 'offer')
            rtcConnect.startLive(focus);
        }
        if (messageOfCall?.type == 'videoCallOffer') {
            rtcConnect = new RtcConnect(loggerEl, localVideo, remoteVideo, 'answer')
            rtcConnect.answerCall(sdp, focus);
        }

        if (messageOfCall?.type == 'videoCallAnswer') {
            rtcConnect = new RtcConnect(loggerEl, localVideo, remoteVideo, 'answer')
            rtcConnect.peer.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: sdp }));
        }

        if (messageOfCall?.type === 'answer_ice') {
            rtcConnect.peer.addIceCandidate(iceCandidate);
        }
        if (messageOfCall?.type === 'answer_ice') {
            rtcConnect.peer.addIceCandidate(iceCandidate);
        }

    }, [messageOfCall])


    async function close() {
        await rtcConnect?.stopLive();
        action.setVideoCallState(false)
    }



    return <div className={style.videocall}>
        <i className={`${style.iconfont} iconfont icon-close`} onClick={() => close()}></i>
        <video className={style.remotevideo} ref={remoteVideo}></video>
        <video className={style.localvideo} ref={localVideo} muted></video>
        <div className={style.logger} ref={loggerEl}></div>
    </div>
}