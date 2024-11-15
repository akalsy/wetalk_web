/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2024-07-15 09:51:40
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-11-11 13:47:18
 * @FilePath: /wetalk_web/src/hooks/useIsVideoCall.ts
 * @Description: Description
 */
import { useSelector } from 'react-redux';
import { State } from '../state/reducer';

/**
 * 
 */
export default function useIsVideoCall() {
    const useIsVideoCall = useSelector(
        (state: State) => state.videoCall
    );
    return useIsVideoCall;
}

export function useCallOfMessage() {
    const useCallOfMessage = useSelector(
        (state: State) => state.messageOfVideoCall
    );
    return useCallOfMessage;
}

