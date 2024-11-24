/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2024-06-26 13:55:42
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-11-25 00:52:12
 * @FilePath: /wetalk_web/src/modules/videoCall/index.tsx
 * @Description: Description
 */
import React, { useRef, useEffect, useState, useCallback } from 'react'

import { useSelector } from 'react-redux';
import useAction from '../../hooks/useAction';
import { sendMessage } from '../../service';
import style from './index.less'
import RtcConnect from './rtcConnect'
import { State } from '../../state/reducer';
export default function VideoCall(props: any) {
    const action = useAction();
    const [target, setTaget] = useState("");
    const [peer, setPeer] = useState<RTCPeerConnection | null>(null);
    // const [stream, setStream] = useState<MediaStream | null>(null);
    const focus = useSelector((state: State) => state.focus);
    const messageOfCall = useSelector((state: State) => state.messageOfVideoCall);
    const remoteVideo: any = useRef(null);
    const localVideo: any = useRef(null)
    const loggerEl: any = useRef(null)


    const [linkedId, setLinledId] = useState("")
    const selfId =
        useSelector((state: State) => state.user && state.user._id) || '';
    function messageLog(msg: string) {
        if (loggerEl.current) {
            loggerEl.current.innerHTML += `<span>${new Date().toLocaleTimeString()}：${msg}</span><br/>`;
        }
    }
    function messageError(msg: string) {
        loggerEl.current.innerHTML += `<span class="error">${new Date().toLocaleTimeString()}：${msg}</span><br/>`;
    }



    async function stopLive() {
        return new Promise<void>((resolve) => {
            const stream = localVideo.current.srcObject as MediaStream;
            if (stream) {
                stream.getAudioTracks().forEach(function (track: any) {
                    track.stop();
                });
                stream.getVideoTracks().forEach(function (track: any) {
                    track.stop();
                });
                localVideo.current.srcObject = null;
            }
            resolve()
        })
    }

    const getUserMedia = async (): Promise<MediaStream | undefined> => {
        try {
            messageLog('尝试调取本地摄像头/麦克风');

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            if (localVideo.current) {
                localVideo.current.srcObject = stream;
            }
            messageLog('摄像头/麦克风获取成功！');

            return stream;
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    };

    async function peerConnection(offerId: string, type: string) {
        const PeerConnection =
            window.RTCPeerConnection ||
            (window as any).mozRTCPeerConnection ||
            (window as any).webkitRTCPeerConnection;
        const peerNow: any = new PeerConnection();
        // setPeer(peerNow)
        messageLog('信令通道（WebSocket）创建中......');
        peerNow.ontrack = (e: { streams: MediaStream[] }) => {
            if (e && e.streams) {
                messageLog('收到对方音频/视频流数据...');
                remoteVideo.current.srcObject = e.streams[0];
            }
        };
        const stream = await getUserMedia();

        if (stream) {
            stream.getTracks().forEach((track) => peerNow.addTrack(track, stream));
        }

        peerNow.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', peerNow.iceConnectionState);
        };
        peerNow.onicecandidate = (e: { candidate: any }) => {
            if (e.candidate) {
                messageLog('搜集并发送候选人');
                sendMessage(
                    offerId,
                    `${type}_ice`,
                    JSON.stringify({
                        type: `${type}_ice`,
                        iceCandidate: e.candidate,
                    }),
                );
            } else {
                messageLog('候选人收集完成！');
            }
        };
        !PeerConnection && messageError('浏览器不支持WebRTC！');
        setPeer(peerNow)
        return peerNow;

    }



    async function answerCall(offer: any, offerId: string, type: string) {
        messageLog('接收到发送方SDP');
        let peer = await peerConnection(offerId, type);
        if (peer) {
            await peer?.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer?.createAnswer();
            peer?.setLocalDescription(answer as any);
            sendMessage(offerId, 'videoCallAnswer', JSON.stringify(answer));
        }
    }

    const startLive = async () => {
        let peer = await peerConnection(focus, 'offer');
        if (peer) {
            messageLog('创建本地SDP');
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            sendMessage(focus, 'videoCallOffer', JSON.stringify(offer));
        }
    }

    useEffect(() => {
        if (localVideo?.current) {
            localVideo.current.onloadeddata = () => {
                localVideo.current.play();
            }
        }
    }, [localVideo])


    useEffect(() => {
        if (remoteVideo?.current) {
            remoteVideo.current.onloadeddata = () => {
                remoteVideo.current.play();
            }
        }
    }, [remoteVideo])


    useEffect(() => {

        const onMessage = async (messageOfCall: any) => {
            let type, sdp, iceCandidate, from, content;
            if (messageOfCall.content) {
                content = JSON.parse(messageOfCall?.content);
                type = content?.type;
                sdp = content?.sdp;
                iceCandidate = content?.iceCandidate;
            }
            from = messageOfCall?.from;

            if (type === 'answer_ice') {
                peer?.addIceCandidate(iceCandidate);
            }
            if (type === 'offer_ice') {
                peer?.addIceCandidate(iceCandidate);
            }
            if (messageOfCall?.type == 'startLive') {
                setTaget('offer');
                setLinledId(focus);
                startLive();
            }
            if (messageOfCall?.type == 'videoCallOffer') {
                setTaget('answer');
                setLinledId(from?._id + selfId);
                answerCall(content, from?._id + selfId, 'answer');
            }

            if (messageOfCall?.type == 'videoCallAnswer') {
                if (peer) {
                    await peer.setRemoteDescription(new RTCSessionDescription(content));
                }
            }
        }
        console.log('messageOfCall', messageOfCall)
        onMessage(messageOfCall)


    }, [messageOfCall])


    async function close() {
        await stopLive();
        action.setVideoCallState(false)
    }



    return <div className={style.videocall}>
        <i className={`${style.iconfont} iconfont icon-close`} onClick={() => close()}></i>
        <video autoPlay className={style.remotevideo} ref={remoteVideo}></video>
        <video autoPlay className={style.localvideo} ref={localVideo} muted></video>
        <div className={style.logger} ref={loggerEl}></div>
    </div>
}