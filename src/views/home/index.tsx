/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-05-09 09:48:38
 * @LastEditors: houqiangxie
 * @LastEditTime: 2024-01-11 10:36:04
 */
import { useCommonState } from '@/store/common'
import { Button, Input } from 'antd'

export default function Index() {
    const snap = useProxy(useCommonState)
    setInterval(() => {
    ++snap.count
    }, 1000)

    return (
        <>
            <Button type="primary">Primary Button</Button>
            <div>home</div>
            <Input />

        </>
    )
}