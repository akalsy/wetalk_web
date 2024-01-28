

import React, { useState } from 'react'
import Style from './MessageComponent.less';
import { getOSSFileUrl } from '../../../utils/uploadFile';

interface Props {
    src: string;
    loading: boolean;
    percent: number;
}
export default React.memo(function TextMessage(props: Props) {
    const { src, loading, percent } = props;
    let imageSrc = src
    const [viewer, toggleViewer] = useState(false)
    const containerWidth = 450;
    const maxWidth = containerWidth - 100 > 500 ? 500 : containerWidth - 100;
    const maxHeight = 200;
    let width = 200;
    let height = 200;
    const parseResult = /width=([0-9]+)&height=([0-9]+)/.exec(imageSrc);
    if (parseResult) {
        const natureWidth = +parseResult[1];
        const naturehHeight = +parseResult[2];
        let scale = 1;
        if (natureWidth * scale > maxWidth) {
            scale = maxWidth / natureWidth;
        }
        if (naturehHeight * scale > maxHeight) {
            scale = maxHeight / naturehHeight;
        }
        width = natureWidth * scale;
        height = naturehHeight * scale;
        imageSrc = /^(blob|data):/.test(imageSrc)
            ? imageSrc.split('?')[0]
            : getOSSFileUrl(
                src,
                `image/resize,w_${Math.floor(width)},h_${Math.floor(
                    height,
                )}/quality,q_90`,
            );
    }
    return <img
        className={Style.image}
        src={imageSrc}
        alt="消息图片"
        width={width}
        height={height}
        onClick={() => toggleViewer(true)}
    />
}) 