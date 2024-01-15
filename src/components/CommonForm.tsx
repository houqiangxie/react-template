/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2024-01-11 11:19:37
 * @LastEditors: houqiangxie
 * @LastEditTime: 2024-01-15 15:31:53
 */
import {
    Form,
    Cascader,
    Checkbox,
    ColorPicker,
    DatePicker,
    Input,
    InputNumber,
    Radio,
    Select,
    Slider,
    Switch,
    TreeSelect,
    Upload, Row, Col
} from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const componentList = {
    Input,
    TextArea,
    InputNumber,
    Checkbox,
    Radio,
    Select,
    TreeSelect,
    Slider,
    Cascader,
    DatePicker,
    RangePicker,
    ColorPicker,
    Switch,
}

const CommonForm=forwardRef(({ config = [],formModel,cols=2,baseName}:any,ref)=> {
    const [form] = Form.useForm()
    useImperativeHandle(ref, () => ({
        submit: async () => {
            // Object.assign(formModel,form.getFieldsValue())
            try {
                await form.validateFields()
                return true
                // return { valid: true, formModel }
            } catch (error) {
                console.log('error: ', error);
                // return {valid:false,formModel}
                return false
            }
        },
        form
    }))
    

    useEffect(() => {
        form.setFieldsValue(formModel)
    })

    const updateModelValue = (changedValues) => {
        Object.assign(formModel, changedValues)
    }

    // checkbox radio 组件
    const GroupComponent = (prop: any, index, Name) => {
        return (
            <Name.Group className='w-full' {...prop?.bind} >
                <Row>
                    {prop.bind?.options.map((option, i) => (<Col span={prop.col || 8} key={i}><Name value={option.value} disabled={option.disabled}>{option.label}</Name></Col>))}
                </Row>
            </Name.Group>
        )
    }

    // 动态组件;
    const DynamicComponent = (prop: any, index?: number) => {
        if (!prop.bind) prop.bind = {}
        const {bind,key,component,...rest}=prop
        if (prop.bind?.renderComponent || prop.component && Array.isArray(prop.component)) {
            return (
                <Form.Item
                    className='col-span-1'
                    label={prop.label}
                    key={index}
                    {...rest}
                > {
                        prop.bind?.renderComponent ? prop.bind.renderComponent(prop, index) : (
                            <Row gutter={16}>
                                {prop.component.map((component, i) => <Col span={prop.bind.col||12} key={i}>{DynamicComponent({ bind: prop.bind[i], key: prop.key[i], component,bindItem:prop.bindItem?.[i] })}</Col>)}
                            </Row>)
                    }
                </Form.Item>)
        }
        let Name = ''
        Name = componentList[prop.component]
        let currentComponent = <Name {...prop.bind} />
        switch (prop.component) {
            case 'Checkbox':
            case 'Radio':
                currentComponent = GroupComponent(prop, index, Name)
            // default: Name = componentList[prop.component]
            //     break;
        }
        const propName = baseName ? [...baseName, prop.key] : prop.key
        return (
            <Form.Item
                className='col-span-1'
                label={prop.label}
                name={propName}
                rules={setRules(prop, index)}
                key={index}
                {...rest}
            >{currentComponent}
            </Form.Item>
        )
    }



    // 默认校验正则
    const validateReg: Record<string, RegExp> = {
        'default': /^.+$/,//非空正则
        'phone': /^[1][3,4,5,6,7,8,9][0-9]{9}$/, //手机号
        'phone_prefix': /\d{3,4}/,//固话前缀
        'phone_suffix': /\d{7,8}/,//固话后缀
        'phone_number': /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,//手机号和固话
    }

    // 列校验
    const setRules = (item: any, index?: number): Array<Record<string, any>> => {
        const bind = item?.bind?.[(index) as number] || item.bind || {}
        const rule: Record<string, any> = bind
        if (bind.rules) return bind.rules
        rule.message = bind.message || ((bind.label || item.label) + '不能为空')
        rule.validateTrigger = bind.required ? 'onChange' : []
        rule.transform = (value) => value ? String(value) : null
        if (bind.patternType || bind.pattern) {
            rule.message = bind.message || ((bind.label || item.label) + '格式不正确')
            rule.validator = (rule: any, value: string) => {
                if (!(validateReg[bind.patternType]?.test(value) || bind.pattern?.test(value))) return Promise.reject(new Error(rule.message))
                return Promise.resolve()
            }
        }
        if ((typeof item.key == 'object' && !(index || index == 0)) || bind.notValidate) rule.validator = () => Promise.resolve()
        // extendRule  扩展当前校验校验属性
        // extendRules 扩展其他校验，多个校验
        // rules 直接替换校验
        if (bind.extendRule) return [Object.assign(rule, bind.extendRule)]
        else if (bind.extendRules) return [rule, ...bind.extendRules]
        return [rule]
    }

    return (
        <div className={`grid grid-cols-${cols} gap-x-5`}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
                form={form}
                component={false}
                onValuesChange={updateModelValue}
            >
                {config.map((item, index) => DynamicComponent(item, index))}
            </Form>
        </div>
    )
})

export default CommonForm



// 使用demo
// const subConfig = (i) => {
//     return [
//         { component: 'Input', key: 'name2', label: '姓名', bind: { required: true, options } },
//     ]
// }
// const formInstanceMap = new Map()
// const config = [
//     { component: 'Cascader', key: 'name', label: '姓名', options, bind: { required: true } },
//     { component: ['Input', 'TreeSelect'], key: ['66', '666'], label: '密码', required: true, bind: [{ required: true, placeholder: '请输入姓名', options }, { required: false, placeholder: '请输入姓名', options, treeData }] },
//     {
//         component: 'Cascader', key: 'pas3', label: '3密码', className: 'col-span-2', bind: {
//             required: true, renderComponent: (f, i) => {
//                 return formModel.data.map((item, index) => (<CommonForm config={subConfig(i)} cols={1} formModel={formModel.data[index]} key={index} ref={(el) => formInstanceMap.set(index, el)} />))
//             }
//         }
//     },
// ]
// const [formModel, setFormModel] = useState({ data: [{}, {}] })
// const formRef = useRef(null)

// const handleClick = async () => {
//     let validateArr = []
//     validateArr.push(await formRef.current.submit())
//     // let bool = await formRef.current.submit()
//     for (const [key, value] of formInstanceMap) {
//         value && validateArr.push(await value.submit())
//     }
//     if (validateArr.some(item => item === false)) return;
//     console.log('formModel: ', formModel);
// }
// return (
//     <>
//         <CommonForm config={config} formModel={formModel} ref={formRef} />
//         <div onClick={handleClick}>提交</div>
//     </>
// )