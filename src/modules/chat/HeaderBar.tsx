
import React from 'react'
import Style from './HeaderBar.less'
import useAero from '../../hooks/useAero';
import useIsLogin from '../../hooks/useIsLogin';
import CopyToClipboard from 'react-copy-to-clipboard';
import Message from "../../components/Message/Message"
interface Props {
    id: string,
    name: string,
    type: string,
    onlineMembersCount?: number,
    isOnline: boolean
    onClickFunction: () => void
}
export default function HeaderBar(props: Props) {
    const {
        id,
        name,
        type,
        onlineMembersCount,
        isOnline,
        onClickFunction,
    } = props;

    const aero = useAero();
    const isLogin = useIsLogin();

    function handleShareGroup() {
        Message.success('已复制邀请链接到粘贴板, 去邀请其它人加入群组吧');
    }
    return <div className={Style.headerBar} {...aero}>
        <h2 className={Style.name}>
            {name && (
                <span>
                    {name}{' '}
                    {isLogin && onlineMembersCount !== undefined && (
                        <b
                            className={Style.count}
                        >{`(${onlineMembersCount})`}</b>
                    )}
                    {isLogin && isOnline !== undefined && (
                        <b className={Style.count}>{`(${
                            isOnline ? '在线' : '离线'
                            })`}</b>
                    )}
                </span>
            )}

        </h2>

        <div className={Style.rightButtonContainer}>
            {type == 'group' && <CopyToClipboard
                text={`${window.location.origin}/invite/group/${id}`}
            >
                <i className={`iconfont icon-fenxiang ${Style.caidan}`} onClick={handleShareGroup} />
            </CopyToClipboard>}
            <i className={`iconfont icon-caidan ${Style.caidan}`} onClick={onClickFunction} />
        </div>
    </div>
}