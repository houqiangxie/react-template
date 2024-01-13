/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-05-09 09:48:38
 * @LastEditors: houqiangxie
 * @LastEditTime: 2024-01-12 17:40:37
 */
import CommonForm from '@/components/CommonForm'
import { useCommonState } from '@/store/common'
import { Cascader } from 'antd'
const options = [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled', disabled: true },
      ]
export default function Index() {
    // const snap = useProxy(useCommonState)
    // setInterval(() => {
    // ++snap.count
    // }, 1000)
    const config = [
        {
            component: 'Select', key: 'name', label: '姓名', options,bind:{required:false,placeholder:'请输入姓名'}},
       {component:'Input',key:'pas',label:'密码',bind:{required:false,placeholder:'请输入姓名'}},
       {component:'Input',key:'pas3',label:'3密码',bind:{required:false,placeholder:'请输入姓名'}},
    ]
    const [formModel, setFormModel] = useState({ name: '' })
    const formRef = useRef(null)
   
    const handleClick = async() => { 
       const a = await formRef.current.submit()
       console.log('a: ', a);
    }
    return (
        <>
            <CommonForm config={config} formModel={formModel} ref={formRef} cols='3' />
            <div onClick={handleClick}>提交</div>
        </>
    )
}