import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, FileOutlined, LogoutOutlined, HistoryOutlined, ShoppingOutlined, EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar, Card, Button, Modal, Form, Input, Space, Empty, List, Skeleton } from 'antd';
import axios from "axios";

const { Meta } = Card;

// Sidebar Etc
const { Content, Footer, Sider } = Layout

export default function App() {
    const [collapsed, setCollapsed] = useState(false)
    const [selectedMenuItem, setSelectedMenuItem] = useState('1')
    const handleMenuItemClick = (e) => {
        setSelectedMenuItem(e.key)
    };

    const navigate = useNavigate()

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()

    const handleLogout = () => {
        localStorage.removeItem('userData')
        navigate('/')
    }

    return (
        <Layout style={{ minHeight: '100vh' }} >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[selectedMenuItem]}
                    mode="inline"
                    onClick={handleMenuItemClick}
                >
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        Home
                    </Menu.Item>
                    <Menu.Item key="2" icon={<FileOutlined />}>
                        Transaction
                    </Menu.Item>
                    <Menu.Item key="3" icon={<HistoryOutlined />}>
                        History
                    </Menu.Item>
                    <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>
                        Log out
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content style={{ margin: '0 16px' }} >
                    <Breadcrumb style={{ margin: '16px 0' }} >
                        <Breadcrumb.Item>User Page</Breadcrumb.Item>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }} >
                        {selectedMenuItem === '1' && <Contents />}
                        {selectedMenuItem === '2' && <Transaction setSelectedMenuItem={setSelectedMenuItem} />}
                        {selectedMenuItem === '3' && <TransactionList />}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }} >
                    Trying Ant Design ©{new Date().getFullYear()} by Rye
                </Footer>
            </Layout>
        </Layout>
    );
}

function Contents() {
    return (

        <Content style={{ margin: '5rem' }} >
            <Empty />
        </Content>

    )
}

function Transaction({ setSelectedMenuItem }) {
    const [packages, setPackages] = useState([])
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [open, setOpen] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [form] = Form.useForm()


    // GET PACKAGE
    function fetchPackage() {
        fetch("http://localhost:3000/package")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unexpected Server Response")
                }
                return response.json()
            })
            .then((data) => { setPackages(data) })
            .catch((error) => console.log("Error: ", error))
    }

    useEffect(() => {
        console.log('PackageList component updated');
        fetchPackage()
    }, [])

    // DETAIL PACKAGE
    const showModal = (packageItem) => {
        setSelectedPackage(packageItem)
        setOpen(true)
    }
    const handleConfirm = () => {
        setOpen(false)
        setModalOpen(true)
    }
    const handleCancel = () => {
        setOpen(false)
        setModalOpen(false)
        setSelectedPackage(null)
        form.resetFields()
        fetchPackage()
    }

    // CONFIRM PURCHASE
    const userData = JSON.parse(localStorage.getItem('userData'));

    const [formData, setFormData] = useState({
        user_id: userData.id,
        username: userData.username,
        role: userData.role,
        phone: '',
        transaction_date: new Date().toISOString()
    })
    const navigate = useNavigate()
    const handleSubmit = async () => {
        setConfirmLoading(true)
        try {
            if (!formData || !selectedPackage) {
                throw new Error("Incomplete user data")
            }
            const response = await axios.post("http://localhost:3000/transaction", {
                ...formData,
                package_id: selectedPackage.id,
                package_name: selectedPackage.name,
            })
            console.log(response.data)

        } catch (error) {
            console.error("Transaction failed:", error)
            alert("Transaction failed.")
        } finally {
            setTimeout(() => {
                setModalOpen(false)
                setConfirmLoading(false)
                form.resetFields()
                alert("Transaction Succeeded")
                navigate('/')
                setSelectedMenuItem('3')
            }, 1500)
        }
    }

    return (
        <>
            <div style={{ display: 'flex' }}>
                {/* SHOW PACKAGE */}
                {packages.map((packageItem) => (
                    <Card
                        key={packageItem.id}
                        style={{ width: 300, margin: '1rem 1rem 0 0' }}
                        cover={
                            <img
                                alt="example"
                                src="https://api.dicebear.com/7.x/shapes/svg?seed=Aneka"
                            />
                        }
                        actions={[
                            <div key="purchase" onClick={() => showModal(packageItem)} style={{ cursor: 'pointer' }}>
                                <ShoppingOutlined /> Purchase One Time
                            </div>
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Felix" />}
                            title={packageItem.name}
                            description={packageItem.description}
                        />
                    </Card>
                ))}
                {/* DETAIL MODAL PACKAGE */}
                <Modal
                    title={selectedPackage ? selectedPackage.name : 'Package Detail'}
                    visible={open}
                    onOk={handleConfirm}
                    onCancel={handleCancel}
                >
                    {selectedPackage && (
                        <>
                            <p>Internet package by {selectedPackage.provider}</p>
                            <p>{selectedPackage.description} only for ${selectedPackage.price}. Valid for {selectedPackage.period}</p>
                        </>
                    )}
                </Modal>
                {/* CREATE TRANSACTION */}
                <Modal title="Confirm Purchase" visible={modalOpen} onCancel={handleCancel} footer={null} >
                    <Form form={form} name="validateOnly" layout="vertical" onFinish={handleSubmit} autoComplete="off">

                        <Form.Item name="phone" label="Phone" rules={[{ required: true, },]} >
                            <Input onChange={(event) => setFormData({ ...formData, phone: event.target.value })} />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button onClick={handleCancel}>Cancel</Button>
                                <SubmitButton form={form} confirmLoading={confirmLoading} handleSubmit={handleSubmit}>Confirm</SubmitButton>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    )
}

const SubmitButton = ({ confirmLoading }) => {
    const [submittable, setSubmittable] = React.useState(false)

    const [form] = Form.useForm()
    const values = Form.useWatch([], form)

    React.useEffect(() => {
        form
            .validateFields({
                validateOnly: true,
            })
            .then(
                () => {
                    setSubmittable(true)
                },
                () => {
                    setSubmittable(false)
                }
            )
    }, [values])

    return (
        <Button type="primary" htmlType="submit" disabled={!submittable} loading={confirmLoading}>
            Confirm Purchase
        </Button>
    )
}

function TransactionList() {
    const [initLoading, setInitLoading] = useState(true)
    const [data, setData] = useState([])
    const [list, setList] = useState([])
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetchTransaction()
    }, [])

    const fetchTransaction = () => {
        const userData = JSON.parse(localStorage.getItem('userData'))
        const userId = userData.id
        axios.get(`http://localhost:3000/transaction?user_id=${userId}`)
            .then((response) => {
                setData(response.data)
                setList(response.data)
                setInitLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching transactinons:', error)
            })
    }

    // DETAIL TRANSACTION
    const showModal = (item) => {
        setSelectedTransaction(item)
        setOpen(true)
    }
    const handleConfirm = () => {
        setOpen(false)
    }
    const handleCancel = () => {
        setOpen(false)
        setSelectedTransaction(null)
        fetchTransaction()
    }
    const date = (dateString) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}
        const date = new Date(dateString)
        const day = date.toLocaleDateString('en-US', { weekday: 'long' })
        const dateOfMonth = date.getDate()
        const month = date.toLocaleDateString('en-US', { month: 'long' })
        const year = date.getFullYear()
        return `${day}, ${dateOfMonth} ${month} ${year}`
    }
    const hours = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' }
        const date = new Date(dateString)
        const time = date.toLocaleTimeString('en-US', { hour12: false })
        return `{${time}}`
    }

    return (
        <>
            <List
                className="demo-loadmore-list"
                loading={initLoading}
                itemLayout="horizontal"
                dataSource={list}
                renderItem={(item) => (
                    <List.Item
                        actions={[<EllipsisOutlined key="ellipsis" onClick={() => showModal(item)} />]}
                    >
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                key={item.id}
                                avatar={<Avatar src={"https://api.dicebear.com/7.x/thumbs/svg?flip=true"} />}
                                title={<a href="https://ant.design">{item.package_name}</a>}
                                description={item.phone}
                            />
                            <div>{date(item.transaction_date)}</div>
                        </Skeleton>
                    </List.Item>
                )}
            />
            {/* DETAIL MODAL TRANSACTION */}
            <Modal
                title={selectedTransaction ? selectedTransaction.package_name : 'Transaction Detail'}
                visible={open}
                onOk={handleConfirm}
                onCancel={handleCancel}
                footer={(_, { CancelBtn }) => (
                    <CancelBtn key="cancel" />
                )}
            >
                {selectedTransaction && (
                    <p>
                        <p>Transaction Date : {date(selectedTransaction.transaction_date)} {hours(selectedTransaction.transaction_date)}</p>
                        <p>Username : {selectedTransaction.username}</p>
                        <p>Phone Number : {selectedTransaction.phone}</p>
                    </p>
                )}
            </Modal>
        </>
    )
}