/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-05-09 09:48:38
 * @LastEditors: houqiangxie
 * @LastEditTime: 2024-01-15 15:30:43
 */
import CommonForm from '@/components/CommonForm'
import { useCommonState } from '@/store/common'
import { Cascader } from 'antd'
const options = [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
    { value: 'Yiminghe', label: 'yiminghe', children: [{ value: 'lu333cy', label: 'L33ucy' } ]},
      ]
const treeData = [
        { value: 'jack', title: 'Jack' },
        { value: 'lucy', title: 'Lucy' },
    { value: 'Yiminghe', title: 'yiminghe', children: [{ value: 'lu333cy', title: 'L33ucy' }] },
      ]
export default function Index() {
    // const snap = useProxy(useCommonState)
    // setInterval(() => {
    // ++snap.count
    // }, 1000)
    const subConfig = (i) => {
        return [
            { component: 'Input', key: 'name2', label: '姓名', bind: { required: true,options } },
        ]
    }
    const formInstanceMap = new Map()
    const config = [
        {component: 'Cascader', key: 'name', label: '姓名', options,bind:{required:true}},
        { component: ['Input', 'TreeSelect'], key: ['66', '666'], label: '密码',required:true, bind: [{ required: true, placeholder: '请输入姓名', options }, { required: false, placeholder: '请输入姓名', options, treeData }]},
        {
            component: 'Cascader', key: 'pas3', label: '3密码',className:'col-span-2', bind: {
                required: true, renderComponent: (f, i) => {
                    return formModel.data.map((item, index) => (<CommonForm config={subConfig(i)} cols={1} formModel={formModel.data[index]} key={index} ref={(el) => formInstanceMap.set(index, el)} />))
                }}},
    ]
    const [formModel, setFormModel] = useState({data:[{},{}]})
    const formRef = useRef(null)
   
    const handleClick = async () => { 
        let validateArr = []
        validateArr.push(await formRef.current.submit())
        // let bool = await formRef.current.submit()
        for (const [key,value] of formInstanceMap) {
            value && validateArr.push(await value.submit())
        }
        if (validateArr.some(item => item === false)) return;
        console.log('formModel: ',formModel);
    }
    return (
        <>
            <CommonForm config={config} formModel={formModel} ref={formRef} />
            <div onClick={handleClick}>提交</div>
        </>
    )
}