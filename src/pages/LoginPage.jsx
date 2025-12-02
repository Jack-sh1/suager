import React, { useState } from 'react'
import { Form, Input, Button, Toast } from 'antd-mobile'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form] = Form.useForm()

    const onFinish = (values) => {
        const result = login(values.username, values.password)
        if (result.success) {
            Toast.show({ icon: 'success', content: '欢迎回来！' })
            navigate('/', { replace: true })
        } else {
            Toast.show({ icon: 'fail', content: result.message })
        }
    }

    return (
        <div className="min-h-screen bg-white p-6 flex flex-col justify-center">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">登录</h1>
                <p className="text-gray-500">欢迎回到戒糖之旅</p>
            </div>

            <Form
                form={form}
                onFinish={onFinish}
                footer={
                    <Button block type='submit' color='primary' size='large'>
                        登录
                    </Button>
                }
            >
                <Form.Item
                    name='username'
                    label='用户名'
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input placeholder='请输入用户名' />
                </Form.Item>
                <Form.Item
                    name='password'
                    label='密码'
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input placeholder='请输入密码' type='password' />
                </Form.Item>
            </Form>

            <div className="mt-4 text-center text-sm text-gray-500">
                还没有账号？ <Link to="/register" className="text-primary">去注册</Link>
            </div>
        </div>
    )
}

export default LoginPage
