
import React, { useRef, useState } from 'react'
import Style from './ChatInput.less'
import useAero from '../../hooks/useAero';
import { State } from '../../state/reducer';
import voice from '../../utils/voice';
import { useSelector } from 'react-redux';
import useAction from '../../hooks/useAction';
import { sendMessage } from '../../service';
import xss from '../../utils/xss';
import Message from '../../components/Message/Message';

let inputIME = false;
let searchExpressionTimer: number = 0;

export default function ChatInput() {
    const action = useAction();
    const connect = useSelector((state: State) => state.connect);
    const selfId = useSelector((state: State) => state.user?._id);
    const username = useSelector((state: State) => state.user?.username);
    const focus = useSelector((state: State) => state.focus);
    const avatar = useSelector((state: State) => state.user?.avatar);
    const tag = useSelector((state: State) => state.user?.tag);
    const linkman = useSelector((state: State) => state.linkmans[focus]);

    const selfVoiceSwitch = useSelector(
        (state: State) => state.status.selfVoiceSwitch,
    );
    const aero = useAero()
    const enableSearchExpression = useSelector(
        (state: State) => state.status.enableSearchExpression,
    );
    const [expressions, setExpressions] = useState<
        { image: string; width: number; height: number }[]
    >([]);
    function sendTextMessage() {
        if (!connect) {
            return Message.error('发送消息失败, 您当前处于离线状态');
        }

        // @ts-ignore
        const message = $input.current.value.trim();
        if (message.length === 0) {
            return null;
        }

        if (
            message.startsWith(window.location.origin) &&
            message.match(/\/invite\/group\/[\w\d]+/)
        ) {
            const groupId = message.replace(
                `${window.location.origin}/invite/group/`,
                '',
            );
            const id = addSelfMessage(
                'inviteV2',
                JSON.stringify({
                    inviter: selfId,
                    inviterName: username,
                    group: groupId,
                    groupName: '',
                }),
            );
            handleSendMessage(id, 'inviteV2', groupId);
        } else {
            const id = addSelfMessage('text', xss(message));
            handleSendMessage(id, 'text', message);
        }

        // @ts-ignore
        $input.current.value = '';
        setExpressions([]);
        return null;
    }
    async function handleSendMessage(
        localId: string,
        type: string,
        content: string,
        linkmanId = focus,
    ) {
        if (linkman.unread > 0) {
            action.setLinkmanProperty(linkman._id, 'unread', 0);
        }
        const [error, message] = await sendMessage(linkmanId, type, content);
        if (error) {
            action.deleteMessage(focus, localId, true);
        } else {
            message.loading = false;
            action.updateMessage(focus, localId, message);
        }
    }
    function addSelfMessage(type: string, content: string) {
        const _id = focus + Date.now();
        const message = {
            _id,
            type,
            content,
            createTime: Date.now(),
            from: {
                _id: selfId,
                username,
                avatar,
                tag,
            },
            loading: true,
            percent: type === 'image' || type === 'file' ? 0 : 100,
        };
        // @ts-ignore
        action.addLinkmanMessage(focus, message);

        if (selfVoiceSwitch && type === 'text') {
            const text = content
                .replace(
                    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
                    '',
                )
                .replace(/#/g, '');

            if (text.length > 0 && text.length <= 100) {
                voice.push(text, Math.random().toString());
            }
        }

        return _id;
    }
    function sendHuaji() {

    }
    function toggleExpressionDialog(diolagVisiable: Boolean) {

    }
    const [at, setAt] = useState({ enable: false, content: '' });
    async function handleInputKeyDown(e: any) {
        if (e.key === 'Tab') {
            e.preventDefault();
        } else if (e.key === 'Enter' && !inputIME) {
            sendTextMessage();
        } else if (e.altKey && (e.key === 's' || e.key === 'ß')) {
            sendHuaji();
            e.preventDefault();
        } else if (e.altKey && (e.key === 'd' || e.key === '∂')) {
            toggleExpressionDialog(true);
            e.preventDefault();
        } else if (e.key === '@') {
            // 如果按下@建, 则进入@计算模式
            // @ts-ignore
            if (!/@/.test($input.current.value)) {
                setAt({
                    enable: true,
                    content: '',
                });
            }
            // eslint-disable-next-line react/destructuring-assignment
        } else if (at.enable) {
            // 如果处于@计算模式
            const { key } = e;
            // 延时, 以便拿到新的value和ime状态
            setTimeout(() => {
                // 如果@已经被删掉了, 退出@计算模式
                // @ts-ignore
                if (!/@/.test($input.current.value)) {
                    setAt({ enable: false, content: '' });
                    return;
                }
                // 如果是输入中文, 并且不是空格键, 忽略输入
                if (inputIME && key !== ' ') {
                    return;
                }
                // 如果是不是输入中文, 并且是空格键, 则@计算模式结束
                if (!inputIME && key === ' ') {
                    setAt({ enable: false, content: '' });
                    return;
                }

                // 如果是正在输入中文, 则直接返回, 避免取到拼音字母
                if (inputIME) {
                    return;
                }
                // @ts-ignore
                const regexResult = /@([^ ]*)/.exec($input.current.value);
                if (regexResult) {
                    setAt({ enable: true, content: regexResult[1] });
                }
            }, 100);
        } else if (enableSearchExpression) {
            // Set timer to get current input value
            setTimeout(() => {
                if (inputIME) {
                    return;
                }
                if (($input.current as any)?.value) {
                    getExpressionsFromContent();
                } else {
                    clearTimeout(searchExpressionTimer);
                    setExpressions([]);
                }
            });
        }
    }

    async function getExpressionsFromContent() {

    }
    function handlePaste() {

    }
    function toggleInputFocus(focus: boolean) {

    }
    const $input = useRef(null)
    return <div className={Style.chatInput} {...aero}>
        <input
            className={Style.input}
            type="text"
            placeholder="随便聊点啥吧, 不要无意义刷屏~~"
            maxLength={2048}
            ref={$input}
            onKeyDown={handleInputKeyDown}
            onPaste={handlePaste}
            onCompositionStart={() => {
                inputIME = true;
            }}
            onCompositionEnd={() => {
                inputIME = false;
            }}
            onFocus={() => toggleInputFocus(true)}
            onBlur={() => toggleInputFocus(false)}
        />

        <i className={`iconfont icon-fasong ${Style.fasong}`} onClick={sendTextMessage} />
    </div>
}