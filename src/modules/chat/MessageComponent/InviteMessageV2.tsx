

import React from 'react'
import Style from './InviteMessageV2.less';
import { joinGroup, getLinkmanHistoryMessages } from "../../../service"
import useAction from '../../../hooks/useAction';
import Message from '../../../components/Message/Message';
interface TextMessageProps {
    inviteInfo: string;
}
export default function TextMessage(props: TextMessageProps) {
    const { inviteInfo } = props;
    const invite = JSON.parse(inviteInfo);
    const action = useAction()
    async function handleJoinGroup() {
        const group = await joinGroup(invite.group);
        if (group) {
            group.type = 'group';
            (action as any).addLinkman(group, true);
            Message.success('加入群组成功');
            const messages = await getLinkmanHistoryMessages(invite.group, 0);
            if (messages) {
                (action as any).addLinkmanHistoryMessages(invite.group, messages);
            }
        }
    }
    return (
        <div
            className={Style.inviteMessage}
            onClick={handleJoinGroup}
            role="button"
        >
            <div className={Style.info}>
                <span className={Style.info}>
                    &quot;{invite.inviterName}&quot; 邀请你加入群组「
                    {invite.groupName}」
                </span>
            </div>
            <p className={Style.join}>加入</p>
        </div>
    );
} 