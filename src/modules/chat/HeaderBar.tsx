
import React from 'react'
import Style from './HeaderBar.less'
import useAero from '../../hooks/useAero';
import useIsLogin from '../../hooks/useIsLogin';

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
    console.log(onlineMembersCount)
    console.log(isOnline)
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
    </div>
}