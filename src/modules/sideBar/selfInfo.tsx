import React, { useRef, useState } from "react"
import Style from './selfInfo.less';
import Common from './Common.less';
import Dialog from '../../components/Dialog/Dialog'
import Cropper, { ReactCropperElement } from "react-cropper";
import Avatar from '../../components/Avatar/Avatar';
import readDiskFile from '../../utils/readDiskFile';
import { useSelector } from 'react-redux';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Message from "../../components/Message/Message"
import { State } from '../../state/reducer';
import uploadFile, { getOSSFileUrl } from '../../utils/uploadFile';
import useAction from '../../hooks/useAction';
import socket from '../../socket';
import store from "../../state/store"
import "cropperjs/dist/cropper.css";
import { changeAvatar, changePassword, changeUsername } from "../../service";
interface SelfInfoProps {
    visible: boolean;
    onClose: () => void;
}
export default function SelfInfo(props: SelfInfoProps) {
    const user = store.getState().user;
    const curUserName = user?.username || "";

    const action = useAction()
    const avatar = useSelector(
        (state: State) => state.user && state.user.avatar,
    );
    const userId = useSelector(
        (state: State) => state.user && state.user._id,
    );
    const { visible, onClose } = props
    function handleCloseDialog(event: any) {
        /**
         * 点击关闭按钮, 或者在非图片裁剪时点击蒙层, 才能关闭弹窗
         */
        if (event.target.className === 'rc-dialog-close-x') {
            onClose();
        }
    }
    const onCrop = () => {
        // @ts-ignore
        
    };
    const [loading, toggleLoading] = useState(false);

    // 上传头像
    async function uploadAvatar(blob: Blob, ext = 'png') {
        // toggleLoading(true);
        toggleLoading(true);

        try {
            const avatarUrl = await uploadFile(
                blob,
                `avatar/${userId}_${Date.now()}.${ext}`,
            );
            const isSuccess = await changeAvatar(avatarUrl);
            if (isSuccess) {
                action.setAvatar(URL.createObjectURL(blob));
                Message.success('修改头像成功');
            }
        } catch (err) {
            console.error(err);
            Message.error('上传头像失败');
        } finally {
            toggleLoading(false);
            setCropper({ enable: false, src: '', ext: '' });
        }

    }
    // 保存头像
    const handleChangeAvatar = () => {
        // @ts-ignore
        cropper?.getCroppedCanvas().toBlob(async (blob: any) => {
            uploadAvatar(blob, cropper.ext);
        });
    }


    const handleChangePassWord = async () => {
        const isSuccess = await changePassword(oldPassword, newPassword);
        
        if (isSuccess) {
            onClose();
            reLogin('修改密码成功, 请使用新密码重新登录');
        }
    }


    const handleChangeUserName = async () => {
        const isSuccess = await changeUsername(newUserName);
        
        if (isSuccess) {
            onClose();
            reLogin('用户名修改成功, 请使用新密码重新登录');
        }
    }
    const reLogin = (msg: string): void => {

        action.logout();
        window.localStorage.removeItem('token');
        Message.success(msg);
        socket.disconnect();
        socket.connect();
    }
    const [cropper, setCropper] = useState({
        enable: false,
        src: "",
        ext: ""
    })
    async function selectAvatar() {
        const file = await readDiskFile(
            'blob',
            'image/png,image/jpeg,image/gif',
        );
        if (!file) {
            return;
        }
        // if (file.length > config.maxAvatarSize) {
        //     // eslint-disable-next-line consistent-return
        //     return Message.error('设置头像失败, 请选择小于1.5MB的图片');
        // }

        // gif头像不需要裁剪
        if (file.ext === 'gif') {
            uploadAvatar(file.result as Blob, file.ext);
        } else {
            // 显示头像裁剪
            const reader = new FileReader();
            reader.readAsDataURL(file.result as Blob);
            reader.onloadend = () => {
                setCropper({
                    enable: true,
                    src: reader.result as string,
                    ext: file.ext,
                });
            };
        }
    }
    function onCropperInit(cropper: any) {
        setCropper(cropper)
    }

    const [newPassword, newPasswordChange] = useState('')
    const [oldPassword, oldPasswordChange] = useState('')
    const [newUserName, newUserNameChange] = useState(curUserName)
    return <Dialog
        className={Style.selfInfo}
        visible={visible}
        title="个人信息设置"
        onClose={handleCloseDialog}>
        <div className={Common.container}>
            <div className={Common.block}>
                <p className={Common.title}>修改头像</p>
                {avatar && !cropper.enable &&
                    <div>
                        <Avatar
                            className={Style.avatar}
                            src={avatar}
                            onClick={() => selectAvatar()}
                        />
                    </div>
                }
                {cropper.enable && <Cropper
                    src={cropper.src}
                    className={loading ? 'blur' : ''}
                    style={{ height: 230, width: 200 }}
                    // Cropper.js options
                    initialAspectRatio={16 / 9}
                    guides={false}
                    crop={onCrop}
                    onInitialized={onCropperInit}
                // ref={cropper}
                />}
                {cropper.enable &&
                    <Button
                        className={Style.button}
                        onClick={handleChangeAvatar}
                    >
                        保存头像
                </Button>
                }
            </div>

            <div className={Common.block}>
                <p className={Common.title}>修改密码</p>
                <Input onChange={newPasswordChange} value={newPassword} placeholder="新密码" className={Style.input} />
                <Input onChange={oldPasswordChange} value={oldPassword} placeholder="旧密码" className={Style.input} />

                <Button
                    className={Style.button}
                    onClick={handleChangePassWord}
                >
                    保存密码
                </Button>
            </div>
            <div className={Common.block}>
                <p className={Common.title}>修改用户名</p>
                <Input onChange={newUserNameChange} value={newUserName} placeholder="用户名" className={Style.input} />

                <Button
                    className={Style.button}
                    onClick={handleChangeUserName}
                >
                    保存用户名
                </Button>
            </div>

        </div>


    </Dialog>
}