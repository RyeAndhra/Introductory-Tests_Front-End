import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesktopOutlined, FileOutlined, LogoutOutlined, AppstoreAddOutlined, EditOutlined, EllipsisOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar, Card, Button, Modal, Form, Input, Select, InputNumber, Space, Empty, List, Skeleton } from 'antd';
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
          <Menu.Item key="1" icon={<DesktopOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.SubMenu key="sub1" icon={<AppstoreAddOutlined />} title="Data">
            <Menu.Item key="2">Package</Menu.Item>
            <Menu.Item key="3">User</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="4" icon={<FileOutlined />}>
            Transaction
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutOutlined />} onClick={handleLogout}>
            Log out
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }} >
          <Breadcrumb style={{ margin: '16px 0' }} >
            <Breadcrumb.Item>Admin Page</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }} >
            {selectedMenuItem === '1' && <Contents />}
            {selectedMenuItem === '2' && <PackageList />}
            {selectedMenuItem === '3' && <UserList />}
            {selectedMenuItem === '4' && <TransactionList />}
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

function PackageList(props) {
  const [packages, setPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
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

  const showDetailModal = (packageItem) => {
    setSelectedPackage(packageItem)
    setIsDetailModalOpen(true)
  }

  // EDIT PACKAGE

  const showEditModal = (packageItem) => {
    setSelectedPackage(packageItem)
    setIsEditModalOpen(true)
  }

  const handleSubmit = () => {
    setConfirmLoading(true)
    form
      .validateFields()
      .then(values => {
        console.log('Submitting package data:', values)

        fetch("http://localhost:3000/package/" + selectedPackage.id, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Unexpected Server Response")
            }
            return response.json()
          })
          .then((data) => {
            console.log('Server response:', data)
            fetchPackage()
          })
          .catch((error) => console.log("Error: ", error))
          .finally(() => {
            setTimeout(() => {
              setIsEditModalOpen(false)
              setConfirmLoading(false)
            }, 1500)
          })
      })
      .catch(errorInfo => {
        console.log('Failed:', errorInfo)
        setConfirmLoading(false)
      })
  }

  const handleCancel = () => {
    setIsDetailModalOpen(false)
    setIsEditModalOpen(false)
    setSelectedPackage(null)
    form.resetFields()
    fetchPackage()
  }

  // DELETE PACKAGE
  function deletePackage(id) {
    fetch("http://localhost:3000/package/" + id, {
      method: "DELETE"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server Response")
        }
        return response.json()
      })
      .then((data) => {
        console.log('Server response:', data)
        fetchPackage()
      })
      .catch((error) => console.log("Error: ", error))
  }

  return (
    <>
      <ModalForm fetchPackage={() => props.fetchPackage()} />
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
              <DeleteOutlined key="setting" onClick={() => deletePackage(packageItem.id)} />,
              <EditOutlined key="edit" onClick={() => showEditModal(packageItem)} />,
              <EllipsisOutlined key="ellipsis" onClick={() => showDetailModal(packageItem)} />,
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
          visible={isDetailModalOpen}
          onCancel={handleCancel}
          footer={(_, { CancelBtn }) => (
            <CancelBtn key="cancel" />
          )}
        >
          {selectedPackage && (
            <>
              <p>Internet package by {selectedPackage.provider}</p>
              <p>{selectedPackage.description} only for ${selectedPackage.price}. Valid for {selectedPackage.period}</p>
            </>
          )}
        </Modal>
        {/* EDIT MODAL PACKAGE */}
        <Modal title={'Edit Package'} visible={isEditModalOpen} onCancel={handleCancel} footer={null} >
          {selectedPackage && (
            <>
              <Form form={form} name="validateOnly" layout="vertical" onFinish={handleSubmit} autoComplete="off" initialValues={selectedPackage}>
                <Form.Item name="name" label="Package Name" rules={[{ required: true, },]} >
                  <Input />
                </Form.Item>
                <Form.Item name="provider" label="Provider" rules={[{ required: true, },]} >
                  <Select>
                    <Select.Option value="Telkomsel">Telkomsel</Select.Option>
                    <Select.Option value="Indosat">Indosat</Select.Option>
                    <Select.Option value="Byu">By.U</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="category" label="Category" rules={[{ required: true, },]} >
                  <Select>
                    <Select.Option value="Package">Package</Select.Option>
                    <Select.Option value="Internet">Internet</Select.Option>
                    <Select.Option value="Credit">Credit</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="period" label="Active Period" rules={[{ required: true, },]} >
                  <Input />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true, },]} >
                  <InputNumber />
                </Form.Item>
                <Form.Item name="description" label="Desc" rules={[{ required: true, },]} >
                  <Input.TextArea rows={2} />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <SubmitButton form={form} confirmLoading={confirmLoading} handleSubmit={handleSubmit} />
                    <Button onClick={handleCancel}>Cancel</Button>
                  </Space>
                </Form.Item>
              </Form>
            </>
          )}
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
      Save
    </Button>
  )
}

function ModalForm({ fetchPackage }) {
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  const showModal = () => {
    setOpen(true)
  }

  const handleCancel = () => {
    setOpen(false)
    fetchPackage()
    form.resetFields()
  };


  const handleSubmit = () => {
    setConfirmLoading(true)
    form
      .validateFields()
      .then(values => {
        console.log('Submitting package data:', values)

        fetch("http://localhost:3000/package", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Unexpected Server Response")
            }
            return response.json()
          })
          .then((data) => {
            console.log('Server response:', data)
            fetchPackage()
          })
          .catch((error) => console.log("Error: ", error))
          .finally(() => {
            setTimeout(() => {
              setOpen(false)
              setConfirmLoading(false)
            }, 1500)
          })
      })
      .catch(errorInfo => {
        console.log('Failed:', errorInfo)
        setConfirmLoading(false)
      })
  }

  return (
    <>
      <Modal title="Create New Packages" visible={open} onCancel={handleCancel} footer={null} >
        <Form form={form} name="validateOnly" layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item name="name" label="Package Name" rules={[{ required: true, },]} >
            <Input />
          </Form.Item>
          <Form.Item name="provider" label="Provider" rules={[{ required: true, },]} >
            <Select>
              <Select.Option value="Telkomsel">Telkomsel</Select.Option>
              <Select.Option value="Indosat">Indosat</Select.Option>
              <Select.Option value="Byu">By.U</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true, },]} >
            <Select>
              <Select.Option value="Package">Package</Select.Option>
              <Select.Option value="Internet">Internet</Select.Option>
              <Select.Option value="Credit">Credit</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="period" label="Active Period" rules={[{ required: true, },]} >
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, },]} >
            <InputNumber />
          </Form.Item>
          <Form.Item name="description" label="Desc" rules={[{ required: true, },]} >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item>
            <Space>
              <SubmitButton form={form} confirmLoading={confirmLoading} handleSubmit={handleSubmit} />
              <Button htmlType="reset">Reset</Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Button type="dashed" onClick={showModal} icon={<PlusOutlined />}>New packages</Button>
    </>
  )
}

function UserList() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  // GET USER
  function fetchUser() {
    fetch("http://localhost:3000/user")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server Response")
        }
        return response.json()
      })
      .then((data) => { setUsers(data) })
      .catch((error) => console.log("Error: ", error))
  }

  useEffect(() => {
    console.log('UserList component updated');
    fetchUser()
  }, [])

  // DETAIL USER

  const showDetailModal = (user) => {
    setSelectedUser(user)
    setIsDetailModalOpen(true)
  }

  // EDIT USER

  const showEditModal = (user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleSubmit = () => {
    setConfirmLoading(true)
    form
      .validateFields()
      .then(values => {
        console.log('Submitting user data:', values)

        fetch("http://localhost:3000/user/" + selectedUser.id, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Unexpected Server Response")
            }
            return response.json()
          })
          .then((data) => {
            console.log('Server response:', data)
            fetchUser()
          })
          .catch((error) => console.log("Error: ", error))
          .finally(() => {
            setTimeout(() => {
              setIsEditModalOpen(false)
              setConfirmLoading(false)
            }, 1500)
          })
      })
      .catch(errorInfo => {
        console.log('Failed:', errorInfo)
        setConfirmLoading(false)
      })
  }

  const handleCancel = () => {
    setIsDetailModalOpen(false)
    setIsEditModalOpen(false)
    setSelectedUser(null)
    form.resetFields()
    fetchUser()
  }

  // DELETE USER
  function deleteUser(id) {
    fetch("http://localhost:3000/user/" + id, {
      method: "DELETE"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server Response")
        }
        return response.json()
      })
      .then((data) => {
        console.log('Server response:', data)
        fetchUser()
      })
      .catch((error) => console.log("Error: ", error))
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* SHOW USER */}
      {users.map((user) => (
        <Card
          key={user.id}
          style={{ width: 300, margin: '1rem 1rem 0 0' }}
          cover={
            <img
              alt="example"
              src="https://api.dicebear.com/7.x/shapes/svg?seed=Felix"
            />
          }
          actions={[
            <DeleteOutlined key="setting" onClick={() => deleteUser(user.id)} />,
            <EditOutlined key="edit" onClick={() => showEditModal(user)} />,
            <EllipsisOutlined key="ellipsis" onClick={() => showDetailModal(user)} />,
          ]}
        >
          <Meta
            avatar={<Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Aneka" />}
            title={user.username}
            description={user.role}
          />
        </Card>
      ))}
      {/* DETAIL MODAL USER */}
      <Modal
        title={selectedUser ? selectedUser.username : 'User Detail'}
        visible={isDetailModalOpen}
        onCancel={handleCancel}
        footer={(_, { CancelBtn }) => (
          <CancelBtn key="cancel" />
        )}
      >
        {selectedUser && (
          <>
            <p>Role : {selectedUser.role}</p>
          </>
        )}
      </Modal>
      {/* EDIT MODAL USER */}
      <Modal title={'Edit User'} visible={isEditModalOpen} onCancel={handleCancel} footer={null} >
        {selectedUser && (
          <>
            <Form form={form} name="validateOnly" layout="vertical" onFinish={handleSubmit} autoComplete="off" initialValues={selectedUser}>
              <Form.Item name="username" label="Username" rules={[{ required: true, },]} >
                <Input />
              </Form.Item>
              <Form.Item name="role" label="Role" rules={[{ required: true, },]} >
                <Select>
                  <Select.Option value="Admin">Admin</Select.Option>
                  <Select.Option value="User">User</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true, },]} >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Space>
                  <SubmitButton form={form} confirmLoading={confirmLoading} handleSubmit={handleSubmit} />
                  <Button onClick={handleCancel}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
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
    axios.get("http://localhost:3000/transaction")
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
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
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

  // DELETE TRANSACTION
  function deleteTransaction(id) {
    fetch("http://localhost:3000/transaction/" + id, {
      method: "DELETE"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server Response")
        }
        return response.json()
      })
      .then((data) => {
        console.log('Server response:', data)
        fetchTransaction()
      })
      .catch((error) => console.log("Error: ", error))
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
            actions={[<EllipsisOutlined key="ellipsis" onClick={() => showModal(item)} />, <DeleteOutlined key="setting" onClick={() => deleteTransaction(item.id)} />]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                key={item.id}
                avatar={<Avatar src={"https://api.dicebear.com/7.x/thumbs/svg?flip=true"} />}
                title={<a href="https://ant.design">{item.package_name}</a>}
                description={date(item.transaction_date)}
              />
              <div>{item.username}</div>
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
          <>
            <p>Transaction Date : {date(selectedTransaction.transaction_date)} {hours(selectedTransaction.transaction_date)}</p>
            <p>Phone Number : {selectedTransaction.phone}</p>
            <p>Username : {selectedTransaction.username}</p>
          </>
        )}
      </Modal>
    </>
  )
}