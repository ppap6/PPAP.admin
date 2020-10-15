import React from 'react'
import { Table, Tag, Tooltip, Space, Input, message, Form, Modal, Button } from 'antd'
import { getRoleList } from 'api/role'

import styles from './role.styl'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const validateMessages = {
  required: '${label} is required!',
}

class List extends React.Component {

  formRef = React.createRef()

  state = {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    roleList: [],
    //角色详情表单
    modalVisible: false,
    modalRole: {
      id: 0,
      name: '',
      create_time: '',
      update_time: '',
      description: ''
    }
  }

  componentDidMount(){
    this.getRoleList()
  }

  handleTableChange = (pagination) => {
    this.setState({
      pageNum: pagination.current
    }, () => {
      this.getRoleList()
    })
  }

  getRoleList = () => {
    this.setState({
      loading: true
    })
    const data = {
      page_num: this.state.pageNum,
      page_size: this.state.pageSize
    }
    getRoleList(data).then(response => {
      if(response.data.status === 200){
        this.setState({
          roleList: response.data.message.list,
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

  showModal = (e) => {
    const role = JSON.parse(e.target.getAttribute('role'))
    this.setState({
      modalRole: role,
      modalVisible: true
    }, () => {
      if(this.formRef.current !== null){
        this.formRef.current.setFieldsValue(role)
      }
    })
  }

  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
      modalRole: {
        id: 0,
        name: '',
        create_time: '',
        update_time: '',
        description: ''
      }
    })
  }

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
        width: 120,
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
        title: '名称',
        dataIndex: 'name',
        align: 'center',
        width: 180,
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
        title: '描述',
        dataIndex: 'description',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: description => {
          if(description === ''){
            return (
              <Tag color="blue">无</Tag>
            )
          }else{
            return (
              <Tooltip placement="topLeft" title={description}>
                <span>{description}</span>
              </Tooltip>
            )
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        align: 'center',
        width: 180,
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
        title: '更新时间',
        dataIndex: 'update_time',
        align: 'center',
        width: 180,
        ellipsis: {
          showTitle: false
        },
        render: update_time => (
          <Tooltip placement="topLeft" title={update_time}>
            <span>{update_time}</span>
          </Tooltip>
        )
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        width: 240,
        render: (text, record) => (
          <Space size="middle">
            <a role={JSON.stringify(record)} onClick={this.showModal}>查看</a>
          </Space>
        ),
      }
    ]

    return (
      <>
        <div className={styles.container}>
          <div className={styles.header}>所有角色</div>
          <Table 
            className={styles.table}
            columns={columns} 
            dataSource={this.state.roleList} 
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
          title="角色详情"
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
            initialValues={this.state.modalRole}
            ref={this.formRef}
          >
            <Form.Item name={'name'} label="名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={'description'} label="描述">
              <Input.TextArea />
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