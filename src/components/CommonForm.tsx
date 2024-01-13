/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2024-01-11 11:19:37
 * @LastEditors: houqiangxie
 * @LastEditTime: 2024-01-12 18:00:41
 */
import {
    Form,
    Checkbox,
    Cascader,
    Checkbox,
    ColorPicker,
    DatePicker,
    Form,
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
const componentList = {
    Input,
    Checkbox,
    Cascader,
    Checkbox,
    ColorPicker,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Slider,
    Switch,
    TreeSelect,
}

// 动态组件
const DynamicComponent = (prop:any,index:number) => {
    let Name = ''
    switch (prop.component) { 
        case 'Checkbox':
            Name = GroupComponent
            break;
        case 'Cascader':
            Name = componentList[prop.component]
            break;
        case 'Checkbox':
            Name = componentList[prop.component]
            break;
        case 'ColorPicker':
            Name = componentList[prop.component]
            break;
        case 'DatePicker':
            Name = componentList[prop.component]
            break;
        default Name = componentList[prop.component]
            break;
    }
    return <Name {...prop} key={index} />;
}

const GroupComponent = (prop: any,form) => {
    const onChange = (checkedValue: CheckboxValueType[]) => {
        form.setFieldValue(prop.key, checkedValue)
    }
    return (
        <Checkbox.Group className='w-full' onChange={onChange}>
            <Row>
                {prop.options.map((option, i) => (<Col span={prop.col||8}><Checkbox value={option.value}>{ option.label}</Checkbox></Col>))}
            </Row>
        </Checkbox.Group>
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

const CommonForm=forwardRef(({ config = [],formModel,cols=2},ref)=> {
    type FieldType = {
        [prop:string]: any
    };

    const [form] = Form.useForm()
    useImperativeHandle(ref, () => ({
        submit: async () => {
            Object.assign(formModel,form.getFieldsValue())
            try {
                await form.validateFields()
                return { valid: true, formModel }
            } catch (error) {
                return {valid:false,formModel}
            }
        },
        form
    }))
    // 列校验
    const setRules = (item: any, index?: number): Record<string, any> => {
        let value: any = form[item.key];
        if (index) value = form[item.key[index]];
        const bind = item?.bind?.[(index) as number] || item.bind || {}
        const rule: Record<string, any> = bind

        let fieldType: string = 'string'
        switch (item.component) {
            case 'NCheckboxGroup':
            case 'NTransfer': fieldType = 'array'; break;
            case 'Editor': fieldType = 'string'; break;
            case 'NDatePicker': fieldType = 'string'; break;
            case 'UploadFile': fieldType = 'array'; break;
            case 'NRate': fieldType = 'number'; break;
            default: fieldType = typeof value == 'undefined' ? 'string' : typeof value; break;
        }
        if (bind?.multiple) fieldType = 'array'
        rule.type = bind?.fieldType ?? fieldType
        rule.message = bind.message || ((bind.label|| item.label) + '不能为空')
        rule.validateTrigger = bind.required ? 'onChange' : []
        if (bind.patternType || bind.pattern) {
            rule.message = bind.message || ((bind.label|| item.label) + '格式不正确')
            rule.validator = (rule: any, value: string) => {
                if (!(validateReg[bind.patternType]?.test(value) || bind.pattern?.test(value))) return Promise.reject(new Error(rule.message))
                return Promise.resolve()
            }
        }
        if ((typeof item.key == 'object' && !(index || index == 0)) || bind.notValidate) rule.validator = () => true
        return [rule,item.extendRule||{}]
    }

    useEffect(() => {
        form.setFieldsValue(formModel)
    })
    return (
        <div className={`grid grid-cols-${cols} gap-x-5`}>
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
                form={form}
                component={false}
            >
                {config.map((item, index) => (
                    <Form.Item<FieldType>
                        className='col-span-1'
                        label={item.label}
                        name={item.key}
                        rules={setRules(item)}
                    >{DynamicComponent(item,index)}
                    </Form.Item>
                ))}
            </Form>
        </div>
    )
})

export default CommonForm