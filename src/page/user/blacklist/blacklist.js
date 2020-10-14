import React from 'react'
import { Table, Avatar, Tag, Tooltip, Space, Input, message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getUserList, updateUser } from 'api/user'

import styles from './blacklist.styl'

const { Search } = Input
const { confirm } = Modal

class BlackList extends React.Component {

  state = {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    keyword: '',
    status: 0,
    userList: []
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
      if(response.data.status == 200){
        this.setState({
          userList: response.data.message.list,
          pageNum: response.data.message.page_num,
          pageSize: response.data.message.page_size,
          total: response.data.message.total
        })
      }else if(response.data.status == 10003){
        this.setState({
          userList: []
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

  updateUser = (e) => {
    const user = JSON.parse(e.target.getAttribute('user'))
    const that = this
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `当前操作用户『${user.name}』将刑满释放`,
      okText: '确认',
      cancelText: '取消',
      onOk() {

        that.setState({
          loading: true
        })

        const data = {
          name: user.name,
          account: user.account,
          title: user.title,
          signature: user.signature,
          avatar: user.avatar,
          bg: user.bg,
          sex: user.sex,
          email: user.email,
          mobile: user.mobile,
          role_id: user.role_id,
          status: 1
        }

        updateUser(user.id, data).then(response => {
          if(response.data.status == 200){
            message.success(`用户『${user.name}』成功刑满释放`)
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
        message.info(`用户『${user.name}』未能逃离小黑屋`)
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
          if(account == ''){
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
          if(title == ''){
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
          if(signature == ''){
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
          if(record.status == 1){
            if(record.role_id == 1){
              return (
                <Tag color="red">{role_name}</Tag>
              )
            }else if(record.role_id == 2){
              return (
                <Tag color="green">{role_name}</Tag>
              )
            }else if(record.role_id == 3){
              return (
                <Tag color="yellow">{role_name}</Tag>
              )
            }else if(record.role_id == 4){
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
        render: (text, record) => (
          <Space size="middle">
            <a style={{color: "#F2AA24"}} user={JSON.stringify(record)} onClick={this.updateUser}>释放</a>
          </Space>
        ),
      }
    ]

    return (
      <div className={styles.container}>
        <div className={styles.header}>用户小黑屋</div>
        <Search className={styles.search} placeholder="请输入昵称" onSearch={value => {this.search(value)}} enterButton />
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
    )
  }
}

export default BlackList;