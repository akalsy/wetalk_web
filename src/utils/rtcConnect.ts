/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2024-06-28 15:42:39
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-07-18 15:26:18
 * @FilePath: /wetalk_web/src/utils/rtcConnect.ts
 * @Description: Description
 */
import { sendMessage } from '../service';

export default class RtcConnect {
    public loggerEl: any;
    localVideo: any;
    remoteVideo: any;
    target: string;
    peer: any;
    stream: any;
    constructor(
        loggerEl: any,
        localVideo: any,
        remoteVideo: any,
        target: string,
    ) {
        this.loggerEl = loggerEl;
        this.remoteVideo = remoteVideo;
        this.localVideo = localVideo;
        this.target = target;
    }

    public messageLog(msg: string) {
        if (this.loggerEl.current) {
            this.loggerEl.current.innerHTML += `<span>${new Date().toLocaleTimeString()}：${msg}</span><br/>`;
        }
    }
    public messageError(msg: string) {
        this.loggerEl.current.innerHTML += `<span class="error">${new Date().toLocaleTimeString()}：${msg}</span><br/>`;
    }

    peerConnection(focus: string) {
        const PeerConnection =
            window.RTCPeerConnection ||
            (window as any).mozRTCPeerConnection ||
            (window as any).webkitRTCPeerConnection;
        this.peer = new PeerConnection();
        this.messageLog('信令通道（WebSocket）创建中......');
        this.peer.ontrack = (e: { streams: MediaStream[] }) => {
            if (e && e.streams) {
                this.messageLog('收到对方音频/视频流数据...');
                this.remoteVideo.current.srcObject = e.streams[0];
            }
        };
        this.peer.onicecandidate = (e: { candidate: any }) => {
            if (e.candidate) {
                this.messageLog('搜集并发送候选人');
                // sendMessage(
                //     focus,
                //     'videoCallOffer',
                //     JSON.stringify({
                //         type: `${this.target}_ice`,
                //         iceCandidate: e.candidate,
                //     }),
                // );
            } else {
                this.messageLog('候选人收集完成！');
            }
        };
        !PeerConnection && this.messageError('浏览器不支持WebRTC！');
    }

    // // const socket = new WebSocket('ws://localhost:8080');
    // // socket.onopen = () => {
    // //     message.log('信令通道创建成功！');
    // // }
    // // socket.onerror = () => message.error('信令通道创建失败！');
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
    async stopLive() {
        return new Promise<void>((resolve) => {
            this.stream.getTracks()[0].stop()
            this.stream.getTracks()[1].stop()

            this.stream.getAudioTracks().forEach(function (track: any) {
                track.stop();
            });
            this.stream.getVideoTracks().forEach(function (track: any) {
                track.stop();
            });
            this.localVideo.current.srcObject = null;
            resolve()
        })
    }

    async answerCall(offerSdp: any, focus: string) {
        this.messageLog('接收到发送方SDP');
        await this.peer.setRemoteDescription(offerSdp);

        this.messageLog('创建接收方（应答）SDP');
        const answer = await this.peer.createAnswer();
        this.messageLog(`传输接收方（应答）SDP`);
        sendMessage(focus, 'videoCallAnswer', JSON.stringify(answer));
        await this.peer.setLocalDescription(answer);
    }


    async startLive(toUserId: string) {
        try {
            this.messageLog('尝试调取本地摄像头/麦克风');
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            this.messageLog('摄像头/麦克风获取成功！');
            this.localVideo.current.srcObject = this.stream;
        } catch {
            this.messageError('摄像头/麦克风获取失败！');
            return;
        }
        this.peerConnection(toUserId);

        this.messageLog(
            `------ WebRTC ${this.target === 'offer' ? '发起方' : '接收方'
            }流程开始 ------`,
        );
        this.messageLog('将媒体轨道添加到轨道集');
        this.stream.getTracks().forEach((track: MediaStreamTrack) => {
            this.peer.addTrack(track, this.stream);
        });

        this.messageLog('创建本地SDP');
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        this.messageLog(`传输发起方本地SDP`);
        sendMessage(toUserId, 'videoCallOffer', JSON.stringify(offer));
    }
}
