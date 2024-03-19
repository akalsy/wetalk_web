import React, { useEffect, useState, useContext } from 'react'
import Style from "./GroupManagePanel.less"
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import { useSelector } from 'react-redux';
import { State, GroupMember } from '../../state/reducer';
import { changeGroupName, changeGroupAvatar, leaveGroup } from '../../service';
import Message from '../../components/Message/Message';
import useAction from '../../hooks/useAction';
import uploadFile, { getOSSFileUrl } from '../../utils/uploadFile';
import readDiskFIle from '../../utils/readDiskFile';
import { MB } from '../../utils/const';
import Dialog from '../../components/Dialog/Dialog';
import Avatar from '../../components/Avatar/Avatar';
import Tooltip from 'rc-tooltip';
import { ShowUserOrGroupInfoContext } from '../../context';
interface GroupManagePanelProps {
    visible: boolean;
    onClose: () => void;
    isLogin: boolean | null;
    creator: string;
    groupId: string;
    avatar: string;
    onlineMembers: GroupMember[];
    groupNameOld: string
}

export default function GroupManagePanel(props: GroupManagePanelProps) {

    const { visible, onClose, isLogin, creator, groupNameOld, groupId, avatar, onlineMembers } = props

    const selfId = useSelector((state: State) => state.user?._id);
    const action = useAction()
    const [deleteConfirmDialog, setDialogStatus] = useState(false);
    const context = useContext(ShowUserOrGroupInfoContext)
    function handleClickMask(e: React.MouseEvent) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }
    const config = {
        maxAvatarSize: process.env.MaxAvatarSize
            ? parseInt(process.env.MaxAvatarSize, 10)
            : MB * 1.5,
    };

    async function handleLeaveGroup() {
        const isSuccess = await leaveGroup(groupId);
        if (isSuccess) {
            onClose();
            action.removeLinkman(groupId);
            Message.success('退出群组成功');
        }
    }
    const [groupName, setGroupName] = useState(groupNameOld)
    async function handleChangeGroupName() {
        const isSuccess = await changeGroupName(groupId, groupName);
        if (isSuccess) {
            Message.success('修改群名称成功');
            action.setLinkmanProperty(groupId, 'name', groupName);
        }
    }
    const handleShowUserInfo = async (userInfo: any) => {
        if (userInfo._id === selfId) {
            return;
        }
        // @ts-ignore
        context.showUserInfo(userInfo);
        onClose();
    }
    const handleChangeGroupAvatar = async () => {
        const image = await readDiskFIle(
            'blob',
            'image/png,image/jpeg,image/gif',
        );
        if (!image) {
            return;
        }
        if (image.length > config.maxAvatarSize) {
            // eslint-disable-next-line consistent-return
            return Message.error('设置群头像失败, 请选择小于1.5MB的图片');
        }

        try {
            const imageUrl = await uploadFile(
                image.result as Blob,
                `GroupAvatar/${selfId}_${Date.now()}.${image.ext}`,
            );
            const isSuccess = await changeGroupAvatar(groupId, imageUrl);
            if (isSuccess) {
                action.setLinkmanProperty(
                    groupId,
                    'avatar',
                    URL.createObjectURL(image.result),
                );
                Message.success('修改群头像成功');
            }
        } catch (err) {
            console.error(err);
            Message.error('上传群头像失败');
        }
    }
    return <div
        className={`${Style.groupManagePanel} ${visible ? 'show' : 'hide'}`}
        onClick={handleClickMask}
        role="button"
        data-float-panel="true"
    >
        <div
            className={`${Style.container} ${
                visible ? Style.show : Style.hide
                }`}
        >

            <p className={Style.title}>群组信息</p>
            <div className={Style.content}>
                {isLogin && selfId === creator ? (
                    <div className={Style.block}>
                        <p className={Style.blockTitle}>修改群名称</p>
                        <Input
                            className={Style.input}
                            value={groupName}
                            onChange={setGroupName}
                        />
                        <Button
                            className={Style.button}
                            onClick={handleChangeGroupName}
                        >
                            确认修改
                            </Button>
                    </div>
                ) : null}

                {isLogin && selfId === creator ? (
                    <div className={Style.block}>
                        <p className={Style.blockTitle}>修改群头像</p>
                        <img
                            className={Style.avatar}
                            src={getOSSFileUrl(avatar)}
                            alt="群头像预览"
                            onClick={handleChangeGroupAvatar}
                        />
                    </div>
                ) : null}



                <div className={Style.block}>
                    <p className={Style.blockTitle}>功能</p>
                    {selfId === creator ? (
                        <Button
                            className={Style.button}
                            type="danger"
                            onClick={() => setDialogStatus(true)}
                        >
                            解散群组
                        </Button>
                    ) : (
                            <Button
                                className={Style.button}
                                type="danger"
                                onClick={handleLeaveGroup}
                            >
                                退出群组
                            </Button>
                        )}
                </div>
                <div className={Style.block}>
                    <p className={Style.blockTitle}>
                        在线成员 &nbsp;<span>{onlineMembers.length}</span>
                    </p>
                    <div>
                        {onlineMembers.map((member) => (
                            <div
                                key={member.user._id}
                                className={Style.onlineMember}
                            >
                                <div
                                    className={Style.userinfoBlock}
                                    onClick={() =>
                                        handleShowUserInfo(member.user)
                                    }
                                    role="button"
                                >
                                    <Avatar
                                        size={24}
                                        src={member.user.avatar}
                                    />
                                    <p className={Style.username}>
                                        {member.user.username}
                                    </p>
                                </div>
                                <Tooltip
                                    placement="top"
                                    trigger={['hover']}
                                    overlay={
                                        <span>{member.environment}</span>
                                    }
                                >
                                    <p className={Style.clientInfoText}>
                                        {member.browser}
                                            &nbsp;&nbsp;
                                            {member.os ===
                                            'Windows Server 2008 R2 / 7'
                                            ? 'Windows 7'
                                            : member.os}
                                    </p>
                                </Tooltip>
                            </div>
                        ))}
                    </div>
                </div>
                <Dialog
                    className={Style.deleteGroupConfirmDialog}
                    title="再次确认是否解散群组?"
                    visible={deleteConfirmDialog}
                    onClose={() => setDialogStatus(false)}
                >
                    <Button
                        className={Style.deleteGroupConfirmButton}
                        type="danger"
                        onClick={handleLeaveGroup}
                    >
                        确认
                        </Button>
                    <Button
                        className={Style.deleteGroupConfirmButton}
                        onClick={() => setDialogStatus(false)}
                    >
                        取消
                        </Button>
                </Dialog>
            </div>
        </div>
    </div>
}