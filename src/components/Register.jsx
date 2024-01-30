import React, { useState } from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Layout } from 'antd';
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";

const { Content } = Layout;

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirm_password: '',
        role: 'Admin'
    })
    const onFinish = () => {
        handleSubmit()
    }
    const navigate = useNavigate()
    const handleSubmit = async () => {
        try {
            if (formData.password !== formData.confirm_password) {
                alert("Confirm password must match the first password input field!")
                return
            } else {
                const response = await axios.post("http://localhost:3000/user", formData)
                console.log(response)
                alert("Registered Successfully")
                navigate('/')
            }
        } catch (err) {
            console.log(err)
            alert("Registration failed.")
        }
    }

    return (
        <Content style={{ margin: '10rem 30rem' }} >
            <h2>User Registration Page</h2>
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
                <Form.Item
                    name="confirm_password"
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your Password!',
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(event) => setFormData({ ...formData, confirm_password: event.target.value })}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Sign Up
                    </Button>
                </Form.Item>
                <p>Already have an account? <Link to='/'>Login</Link></p>
            </Form>
        </Content>
    )
}

export default Register