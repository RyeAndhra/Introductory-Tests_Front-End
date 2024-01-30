import React, { useState } from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Layout } from 'antd';
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";

const { Content } = Layout;

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })
    const onFinish = () => {
        handleSubmit()
    }
    const navigate = useNavigate()
    const handleSubmit = async () => {
        try {
            const response = await axios.get("http://localhost:3000/user")
            const userData = response.data.find(user => user.username === formData.username && user.password === formData.password)
            if (!userData) {
                alert("Womp Womp, Invalid username or password.")
                return
            }
            localStorage.setItem('userData', JSON.stringify(userData))
            if (userData.role === 'User') {
                navigate('/home')
            } else if (userData.role === 'Admin') {
                navigate('/dashboard')
            }
            alert("Login Successfully")
        } catch (err) {
            console.log(err)
            alert("Login failed.")
        }
    }

    return (
        <Content style={{ margin: '10rem 30rem' }} >
            {/* <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input onChange={(event) => setFormData({ ...formData, username: event.target.value })} />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password onChange={(event) => setFormData({ ...formData, password: event.target.value })} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
                <p>Don't have an account? <Link to='/register'>Register</Link></p>
            </Form> */}
            <h2>User Login Page</h2>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Username"
                        onChange={(event) => setFormData({ ...formData, username: event.target.value })} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Login
                    </Button>
                </Form.Item>
                <p>Doesn't have an account? <Link to='/register'>Register</Link></p>
            </Form>
        </Content>
    )
}

export default Login