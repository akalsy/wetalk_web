import React from 'react';
import Style from './Button.less'
type Props = {
    /** 类型: primary / danger */
    type?: string;
    /** 按钮文本 */
    children: string;
    className?: string;
    /** 点击事件 */
    onClick?: () => void;
};

function Button({
    type = 'primary',
    children,
    className = '',
    onClick,
}: Props) {
    return (
        <button
            className={`${Style.button} ${type} ${className}`}
            type="button"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;
