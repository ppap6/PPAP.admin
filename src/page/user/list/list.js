import React from 'react'
import { PageHeader, Table, Avatar, Tag, Tooltip, Space, Input, message } from 'antd'
import { getUserList } from 'api/user'

import styles from './list.styl'

const { Search } = Input

class List extends React.Component {

  state = {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    keyword: '',
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
      keyword: this.state.keyword
    }
    getUserList(data).then(response => {
      if(response.data.status == 200){
        this.setState({
          userList: response.data.message.list,
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

  render() {
    const columns = [
      {
        title: '昵称',
        dataIndex: 'name',
        align: 'center',
        ellipsis: false
      },
      {
        title: '账号',
        dataIndex: 'account',
        align: 'center',
        ellipsis: true,
        render: text => {
          if(text == ''){
            return '未定义'
          }
          return text
        },
      },
      {
        title: '头像',
        dataIndex: 'avatar',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        render: avatar => (
          <Avatar src={avatar} />
        ),
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        align: 'center',
        ellipsis: true
      },
      {
        title: '用户头衔',
        dataIndex: 'title',
        align: 'center',
        ellipsis: {
          showTitle: false,
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
          showTitle: false,
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
          showTitle: false,
        },
        render: create_time => (
          <Tooltip placement="topLeft" title={create_time}>
            <span>{create_time}</span>
          </Tooltip>
        ),
      },
      {
        title: '用户角色',
        dataIndex: 'role_name',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        render: (role_name, record) => {
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
              <Tag color="gray">{role_name}</Tag>
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
            <a>查看</a>
            <a>删除</a>
          </Space>
        ),
      }
    ]

    return (
      <div>
        <div className={styles.header}>所有用户</div>
        <Search className={styles.search} placeholder="昵称" onSearch={value => {this.search(value)}} enterButton />
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

export default List;