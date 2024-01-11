/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-05-08 14:14:15
 * @LastEditors: houqiangxie
 * @LastEditTime: 2024-01-11 10:59:46
 */
import { Suspense} from 'react'
import './App.css'
import routes from "~index-route";
import { Button, ConfigProvider, Input, Space, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import customTheme from "@/assets/theme.json";
const App = () => {
  const navigate = useNavigate()
  let flag =false
  useEffect(() => {
    // 路由拦截器
    // if(!false) navigate('/login')
    // else flag=true
  },[location.pathname])
  return (
    <ConfigProvider theme={customTheme } locale={zhCN} >
    <Suspense fallback={<p>Loading...</p>}>
        {useRoutes(routes)} 
    </Suspense>
    </ConfigProvider>
  )
}

export default App
