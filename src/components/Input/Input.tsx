
import React, { useState, useRef } from "react"

import Style from './Input.less'
import IconButton from '../IconButton/IconButton';

interface InputProps {
    value?: string,
    type?: string,
    placeholder?: string,
    className?: string,
    onChange: (value: string) => void,
    onEnter?: (value: string) => void,
    onFocus?: () => void,
}
export default function Input(props: InputProps) {
    const {
        value,
        type = 'text',
        placeholder = '',
        className = '',
        onChange,
        onEnter = () => { },
        onFocus = () => { },
    } = props
    const [lockEnter, setLockEnter] = useState(false)

    function handleInput(e: any) {
        onChange(e.target.value);
    }

    function handleKeyDown(e: any) {
        if (lockEnter) {
            return;
        }
        if (e.key == "Enter") {
            onEnter(value as string)
        }
    }
    function handleIMEStart() {
        setLockEnter(true);
    }
    function handleIMEEnd() {
        setLockEnter(false);
    }

    function handleClickClear() {
        onChange('');
        // @ts-ignore
        $input.current.focus();
    }
    const $input = useRef(null)
    return <div className={`${Style.inputContainer} ${className}`}>
        <input
            className={Style.input}
            type={type}
            value={value}
            onChange={handleInput}
            onInput={handleInput}
            placeholder={placeholder}
            ref={$input}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleIMEStart}
            onCompositionEnd={handleIMEEnd}
            onFocus={onFocus}
        />
        <IconButton
            className={Style.inputIconButton}
            width={32}
            height={32}
            iconSize={18}
            icon="clear"
            onClick={handleClickClear}
        />

    </div>
}