/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-05-09 09:48:38
 * @LastEditors: houqiangxie
 * @LastEditTime: 2023-05-09 14:20:14
 */
import { useCommonState } from '@/store/common'
// import { useProxy } from 'valtio/utils'
import {Button} from 'antd'

export default function Index() {
    const snap = useProxy(useCommonState)
    setInterval(() => {
    ++snap.count
    }, 1000)

    return (
        <>
            <Button type="primary">Primary Button</Button>
            <div>home</div>
        </>
    )
}