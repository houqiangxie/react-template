/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-05-08 14:14:15
 * @LastEditors: houqiangxie
 * @LastEditTime: 2023-05-09 10:07:21
 */
import { Suspense} from 'react'
import './App.css'
import routes from "~index-route";
const App = () => {
  const navigate = useNavigate()
  let flag =false
  useEffect(() => {
    // 路由拦截器
    // if(!false) navigate('/login')
    // else flag=true
  },[location.pathname])
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {useRoutes(routes)}
    </Suspense>
  )
}

export default App
