

import React from 'react'
import Style from './MessageComponent.less';
import expressions from '../../../utils/expressions';
import { TRANSPARENT_IMAGE } from '../../../utils/const';
interface TextMessageProps {
    content: string;
}
export default function TextMessage(props: TextMessageProps) {
    const content = props.content
        .replace(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}(\.[a-z]{2,6})?\b(:[0-9]{2,5})?([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
            (r) =>
                `<a class="${Style.selecteAble}" href="${r}" rel="noopener noreferrer" target="_blank">${r}</a>`,
        )
        .replace(/#\(([\u4e00-\u9fa5a-z]+)\)/g, (r, e) => {
            const index = expressions.default.indexOf(e);
            if (index !== -1) {
                return `<img class="${Style.baidu} ${
                    Style.selecteAble
                    }" src="${TRANSPARENT_IMAGE}" style="background-position: left ${-30 *
                    index}px;" onerror="this.style.display='none'" alt="${r}">`;
            }
            return r;
        });
    return <div
        className={Style.textMessage}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: content }}
    />
} 