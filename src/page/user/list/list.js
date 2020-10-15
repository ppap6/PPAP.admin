import React from 'react'
import { Table, Avatar, Tag, Tooltip, Space, Input, InputNumber, message,Form, Modal, Button, Select } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getUserList, addUser, updateUser, deleteUser } from 'api/user'
import PicturesWall from 'component/upload/userPicturesWall'
import sha1 from 'crypto-js/sha1'
import md5 from 'crypto-js/md5'

import styles from './list.styl'

const { Search } = Input
const { confirm } = Modal
const { Option } = Select

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const validateMessages = {
  required: '${label} is required!',
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
  email: {
    pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
  }
}

class List extends React.Component {

  formRef = React.createRef()
  newFormRef = React.createRef()

  state = {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    keyword: '',
    status: 2,
    userList: [],
    //用户详情表单
    modalVisible: false,
    modalUser: {
      id: 0,
      name: '',
      account: '',
      avatar: '',
      bg: '',
      title: '',
      signature: '',
      sex: 0,
      email: '',
      mobile: '',
      role_id: 0,
      role_name: '',
      status: 0
    },
    //新增用户表单
    newModalVisible: false,
    newModalUser: {
      name: '',
      email: '',
      password: '',
      role_id: 5
    }
  }

  componentDidMount(){
    this.getUserList()
  }

  handleTableChange = (pagination) => {
    this.setState({
      pageNum: pagination.current
    }, () => {
      this.getUserList()
    })
  }

  getUserList = () => {
    this.setState({
      loading: true
    })
    const data = {
      page_num: this.state.pageNum,
      page_size: this.state.pageSize,
      keyword: this.state.keyword,
      status: this.state.status
    }
    getUserList(data).then(response => {
      if(response.data.status === 200){
        let list = response.data.message.list
        for(let i=0; i<list.length; i++){
          if(list[i].avatar === null){
            list[i].avatar = ''
          }
          if(list[i].bg === null){
            list[i].bg = ''
          }
        }
        this.setState({
          userList: list,
          pageNum: response.data.message.page_num,
          pageSize: response.data.message.page_size,
          total: response.data.message.total
        })
      }else{
        message.warning(response.data.message)
      }
      this.setState({
        loading: false
      })
    }).catch(error => {
      console.log(error)
      message.error('网络或服务器貌似有问题')
      this.setState({
        loading: false
      })
    })
  }

  search = value => {
    this.setState({
      keyword: value.trim()
    }, () => {
      this.getUserList()
    })
  }

  deleteUser = (e) => {
    const user = JSON.parse(e.target.getAttribute('user'))
    const that = this
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `当前操作即将把用户『${user.name}』关进小黑屋`,
      okText: '确认',
      cancelText: '取消',
      onOk() {

        that.setState({
          loading: true
        })

        deleteUser(user.id).then(response => {
          if(response.data.status === 200){
            message.success(`用户『${user.name}』成功被关进小黑屋`)
            that.getUserList()
          }else{
            message.warning(response.data.message)
          }
          that.setState({
            loading: false
          })
        }).catch(error => {
          console.log(error)
          message.error('网络或服务器貌似有问题')
          that.setState({
            loading: false
          })
        })

      },
      onCancel() {
        message.info(`用户『${user.name}』暂时逃脱关进小黑屋的命运`)
      }
    })
  }

  showModal = (e) => {
    const user = JSON.parse(e.target.getAttribute('user'))
    this.setState({
      modalUser: user,
      modalVisible: true
    }, () => {
      if(this.formRef.current !== null){
        this.formRef.current.setFieldsValue(user)
      }
    })
  }

  showNewModal = () => {
    this.setState({
      newModalVisible: true
    })
  }

  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
      modalUser: {
        id: 0,
        name: '',
        account: '',
        avatar: '',
        bg: '',
        title: '',
        signature: '',
        sex: 0,
        email: '',
        mobile: '',
        role_id: 0,
        role_name: '',
        status: 0
      }
    })
  }

  handleNewModalCancel = () => {
    this.newFormRef.current.resetFields()
    this.setState({
      newModalVisible: false,
      newModalUser: {
        name: '',
        email: '',
        password: '',
        role_id: 5
      }
    })
  }

  //详情表单验证成功后触发
  onFinish = () => {
    const valueObj = this.formRef.current.getFieldsValue({
      name: '',
      email: '',
      account: '',
      sex: 0,
      title: '',
      signature: '',
      mobile: '',
      role_id: 0,
      status: 0
    })
    let modalUser = this.state.modalUser
    modalUser.name = valueObj.name
    modalUser.email = valueObj.email
    modalUser.account = valueObj.account
    modalUser.sex = valueObj.sex
    modalUser.title = valueObj.title
    modalUser.signature = valueObj.signature
    modalUser.mobile = valueObj.mobile
    modalUser.role_id = valueObj.role_id
    modalUser.status = valueObj.status
    this.setState({
      modalUser
    }, () => {
      this.updateUser()
    })
  }

  //新表单验证成功后触发
  onFinishForNew = () => {
    const valueObj = this.newFormRef.current.getFieldsValue({
      name: '',
      email: '',
      password: '',
      role_id: 5,
    })
    const data = {
      name: valueObj.name,
      email: valueObj.email ,
      password: valueObj.password ,
      role_id: valueObj.role_id
    }
    
    this.addUser(data)
  }

  //子组件传递选中图片base64
  emitBase64 = (base64, type) => {
    // console.log(base64)
    let modalUser = this.state.modalUser
    if(type === 'avatar'){
      modalUser.avatar = base64
    }else{
      modalUser.bg = base64
    }
    this.setState({
      modalUser
    })
  }

  //子组件传递清空当前modal的图片数据
  removePicture = (type) => {
    if(type === 'avatar'){
      this.state.modalUser.avatar = ''
    }else{
      this.state.modalUser.bg = ''
    }
  }

  updateUser = () => {
    const userId = this.state.modalUser.id
    const userData = this.state.modalUser
    updateUser(userId, userData).then(response => {
      if(response.data.status === 200){
        message.success('修改用户成功')
        this.setState({
          modalVisible: false
        })
        this.getUserList()
      }else{
        message.warning(response.data.message)
      }
    })
  }

  addUser = (data) => {
    let password = data.password.trim().length == 0 ? '123456' : this.state.newModalUser.password.trim()
    const userData = {
      name: data.name,
      email: data.email,
      password: md5(sha1(password).toString()).toString(),
      role_id: this.state.newModalUser.role_id
    }
    addUser(userData).then(response => {
      if(response.data.status === 200){
        message.success('新增用户成功')
        //重置表单的初始值
        this.newFormRef.current.resetFields()
        this.setState({
          newModalVisible: false,
          newModalUser: {
            name: '',
            email: '',
            password: '',
            role_id: 5
          }
        })
        this.getUserList()
      }else{
        message.warning(response.data.message)
      }
    })
  }

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: id => (
          <Tooltip placement="topLeft" title={id}>
            <span>{id}</span>
          </Tooltip>
        )
      },
      {
        title: '昵称',
        dataIndex: 'name',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: name => (
          <Tooltip placement="topLeft" title={name}>
            <span>{name}</span>
          </Tooltip>
        )
      },
      {
        title: '账号',
        dataIndex: 'account',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: account => {
          if(account === ''){
            return '未定义'
          }
          return (
            <Tooltip placement="topLeft" title={account}>
              <span>{account}</span>
            </Tooltip>
          )
        },
      },
      {
        title: '头像',
        dataIndex: 'avatar',
        align: 'center',
        render: avatar => (
          <Avatar src={avatar} />
        ),
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: email => (
          <Tooltip placement="topLeft" title={email}>
            <span>{email}</span>
          </Tooltip>
        )
      },
      {
        title: '用户头衔',
        dataIndex: 'title',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: title => {
          if(title === ''){
            return (
              <Tag color="green">无</Tag>
            )
          }else{
            return (
              <Tooltip placement="topLeft" title={title}>
                <span>{title}</span>
              </Tooltip>
            )
          }
        },
      },
      {
        title: '个人签名',
        dataIndex: 'signature',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: signature => {
          if(signature === ''){
            return (
              <Tag color="blue">无</Tag>
            )
          }else{
            return (
              <Tooltip placement="topLeft" title={signature}>
                <span>{signature}</span>
              </Tooltip>
            )
          }
        },
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: create_time => (
          <Tooltip placement="topLeft" title={create_time}>
            <span>{create_time}</span>
          </Tooltip>
        )
      },
      {
        title: '用户角色',
        dataIndex: 'role_name',
        align: 'center',
        render: (role_name, record) => {
          if(record.status === 1){
            if(record.role_id === 1){
              return (
                <Tag color="red">{role_name}</Tag>
              )
            }else if(record.role_id === 2){
              return (
                <Tag color="green">{role_name}</Tag>
              )
            }else if(record.role_id === 3){
              return (
                <Tag color="yellow">{role_name}</Tag>
              )
            }else if(record.role_id === 4){
              return (
                <Tag color="pink">{role_name}</Tag>
              )
            }else{
              return (
                <Tag color="blue">{role_name}</Tag>
              )
            } 
          }else{
            return (
              <Tag color="gray">小黑屋用户</Tag>
            )
          }  
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        width: 120,
        render: (text, record) => (
          <Space size="middle">
            <a user={JSON.stringify(record)} onClick={this.showModal}>查看</a>
            {record.status === 0 ? '' : <a style={{color: "red"}} user={JSON.stringify(record)} onClick={this.deleteUser}>拉黑</a>}
          </Space>
        ),
      }
    ]

    return (
      <>
        <div className={styles.container}>
          <div className={styles.header}>所有用户</div>
          <Search className={styles.search} placeholder="请输入昵称" onSearch={value => {this.search(value)}} enterButton />
          <Button className={styles.addBth} type="primary" onClick={this.showNewModal}>新增用户</Button>
          <Table 
            className={styles.table}
            columns={columns} 
            dataSource={this.state.userList} 
            rowKey="id"
            pagination={{
              current: this.state.pageNum,
              pageSize: this.state.pageSize,
              total: this.state.total,
              position: ['bottomCenter']
            }}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </div>

        <Modal
          title="新增用户"
          visible={this.state.newModalVisible}
          footer= ''
          onCancel={this.handleNewModalCancel}
          maskClosable={false}
        >
          <Form 
            {...layout} 
            name="new-modal" 
            onFinish={this.onFinishForNew} 
            validateMessages={validateMessages}
            initialValues={this.state.newModalUser}
            ref={this.newFormRef}
          >
            <Form.Item name={'name'} label="名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={'email'} label="邮箱" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name={'password'} label="密码">
              <Input placeholder="默认为 123456" />
            </Form.Item>
            <Form.Item name={'role_id'} label="角色类型" initialvalue={5} rules={[{ type: 'number', min: 1, max: 5, required: true }]}>
              <Select style={{ width: 120 }}>
                <Option value={2}>管理员</Option>
                <Option value={3}>运营</Option>
                <Option value={4}>版主</Option>
                <Option value={5}>普通用户</Option>
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Button type="primary" htmlType="submit">确定</Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="用户详情"
          visible={this.state.modalVisible}
          footer= ''
          onCancel={this.handleModalCancel}
          maskClosable={false}
        >
          <Form 
            {...layout} 
            name="detail-modal" 
            onFinish={this.onFinish} 
            validateMessages={validateMessages}
            initialValues={this.state.modalUser}
            ref={this.formRef}
          >
            <Form.Item name={'name'} label="名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={'email'} label="邮箱" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={'account'} label="账号">
              <Input />
            </Form.Item>
            <Form.Item name={'sex'} label="性别" rules={[{ type: 'number', min: 0, max: 2, required: true }]}>
              <Select style={{ width: 100 }}>
                <Option value={0}>保密</Option>
                <Option value={1}>男</Option>
                <Option value={2}>女</Option>
              </Select>
            </Form.Item>
            <Form.Item name={'avatar'} label="头像">
              <PicturesWall emitBase64={this.emitBase64} removePicture={this.removePicture} type="avatar" user={this.state.modalUser} />
            </Form.Item>
            <Form.Item name={'bg'} label="背景">
              <PicturesWall emitBase64={this.emitBase64} removePicture={this.removePicture} type="bg" user={this.state.modalUser} />
            </Form.Item>
            <Form.Item name={'title'} label="个人头衔">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'signature'} label="个人签名">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'mobile'} label="手机号">
              <Input />
            </Form.Item>
            <Form.Item name={'role_id'} label="角色类型" rules={[{ type: 'number', min: 1, max: 5, required: true }]}>
              <Select style={{ width: 120 }}>
                <Option value={2}>管理员</Option>
                <Option value={3}>运营</Option>
                <Option value={4}>版主</Option>
                <Option value={5}>普通用户</Option>
              </Select>
            </Form.Item>
            <Form.Item name={'status'} label="显示状态" rules={[{ type: 'number', min: 0, max: 1, required: true }]}>
              <Select style={{ width: 120 }}>
                <Option value={1}>正常</Option>
                <Option value={0}>小黑屋</Option>
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Button type="primary" htmlType="submit">保存</Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
  }
}

export default List;