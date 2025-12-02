import React from 'react'
import { Form, Input, Button, Toast } from 'antd-mobile'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [form] = Form.useForm()

    const onFinish = (values) => {
        if (values.password !== values.confirmPassword) {
            Toast.show({ icon: 'fail', content: '两次密码不一致' })
            return
        }

        const result = register(values.username, values.password, values.nickname)
        if (result.success) {
            Toast.show({ icon: 'success', content: '注册成功！' })
            navigate('/', { replace: true })
        } else {
            Toast.show({ icon: 'fail', content: result.message })
        }
    }

    return (
        <div className="min-h-screen bg-white p-6 flex flex-col justify-center">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">注册</h1>
                <p className="text-gray-500">开启你的健康生活</p>
            </div>

            <Form
                form={form}
                onFinish={onFinish}
                footer={
                    <Button block type='submit' color='primary' size='large'>
                        注册
                    </Button>
                }
            >
                <Form.Item
                    name='nickname'
                    label='昵称'
                    rules={[{ required: true, message: '请输入昵称' }]}
                >
                    <Input placeholder='大家怎么称呼你' />
                </Form.Item>
                <Form.Item
                    name='username'
                    label='用户名'
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input placeholder='设置登录账号' />
                </Form.Item>
                <Form.Item
                    name='password'
                    label='密码'
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input placeholder='设置密码' type='password' />
                </Form.Item>
                <Form.Item
                    name='confirmPassword'
                    label='确认密码'
                    rules={[{ required: true, message: '请再次输入密码' }]}
                >
                    <Input placeholder='再次输入密码' type='password' />
                </Form.Item>
            </Form>

            <div className="mt-4 text-center text-sm text-gray-500">
                已有账号？ <Link to="/login" className="text-primary">去登录</Link>
            </div>
        </div>
    )
}

export default RegisterPage
