/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2024-07-15 09:51:40
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-07-15 10:15:04
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
        (state: State) => {
            (state)
            return state.videoCall
        }
    );
    return useIsVideoCall;
}
