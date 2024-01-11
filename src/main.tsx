/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-05-08 14:14:15
 * @LastEditors: houqiangxie
 * @LastEditTime: 2024-01-11 10:19:22
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter}  from "react-router-dom";
import App from './App'
import './index.css'
import 'virtual:uno.css'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
