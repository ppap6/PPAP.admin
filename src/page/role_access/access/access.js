import React from 'react'
import { Table, Avatar, Tag, Tooltip, Space, Input, InputNumber, Form, Button, message, Modal, Select } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getAccessList, addAccess, updateAccess, deleteAccess } from 'api/access'

import styles from './access.styl'

const { confirm } = Modal
const { Option } = Select

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const validateMessages = {
  required: '${label} is required!',
  types: {
    num: '${label} is not a validate number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
}

class List extends React.Component {

  formRef = React.createRef()
  newFormRef = React.createRef()

  state = {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    accessList: [],
    currentAccessId: 0,
    currentAccessName: '',
    displaySubAccess: false,
    subAccessList: [],
    //权限详情表单
    modalVisible: false,
    modalAccess: {
      id: 0,
      name: '',
      sid: 0,
      code: '',
      description: ''
    },
    //新增权限表单
    newModalVisible: false,
    newModalAccess: {
      name: '',
      sid: 0,
      code: '',
      description: ''
    }
  }

  componentDidMount(){
    this.getAccessList()
  }

  handleTableChange = (pagination) => {
    this.setState({
      pageNum: pagination.current
    }, () => {
      this.getAccessList()
    })
  }

  getAccessList = () => {
    this.setState({
      loading: true
    })
    const data = {
      page_num: this.state.pageNum,
      page_size: this.state.pageSize
    }
    getAccessList(data).then(response => {
      if(response.data.status == 200){
        const list = response.data.message.list
        this.setState({
          accessList: list,
          pageNum: response.data.message.page_num,
          pageSize: response.data.message.page_size,
          total: response.data.message.total
        })
        for(let i=0; i<list.length; i++){
          //更新二级权限列表
          if(list[i].id === this.state.currentAccessId){
            this.setState({
              subAccessList: list[i].child
            })
          }
        }
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
      this.getAccessList()
    })
  }

  displaySubAccess = (e) => {
    const access = JSON.parse(e.target.getAttribute('access'))
    this.setState({
      displaySubAccess: false
    }, () => {
      this.setState({
        subAccessList: access.child,
        displaySubAccess: true,
        currentAccessId: access.id,
        currentAccessName: access.name
      })
    })
  }

  deleteAccess = (e) => {
    const access = JSON.parse(e.target.getAttribute('access'))
    const that = this
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `当前操作即将把权限『${access.name}』删除`,
      okText: '确认',
      cancelText: '取消',
      onOk() {

        that.setState({
          loading: true
        })

        deleteAccess(access.id).then(response => {
          if(response.data.status == 200){
            message.success(`权限『${access.name}』成功被删除`)
            that.getAccessList()
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
        message.info(`权限『${access.name}』暂时逃脱被删除的命运`)
      }
    })
  }

  showModal = (e) => {
    const access = JSON.parse(e.target.getAttribute('access'))
    this.setState({
      modalAccess: access,
      modalVisible: true
    }, () => {
      if(this.formRef.current !== null){
        this.formRef.current.setFieldsValue(access)
      }
    })
  }

  showNewModal = (e) => {
    const addAccessSid = e.currentTarget.dataset.type === 'level1' ? 0 : this.state.currentAccessId
    this.state.newModalAccess.sid = addAccessSid
    this.setState({
      newModalVisible: true
    })
  }

  handleModalCancel = () => {
    this.setState({
      modalAccess: {
        id: 0,
        name: '',
        sid: 0,
        code: '',
        description: ''
      }
    }, () => {
      this.setState({
        modalVisible: false
      })
    })
  }

  handleNewModalok = () => {
    //调用表单提交功能
    this.newFormRef.current.submit()
  }

  handleNewModalCancel = () => {
    this.newFormRef.current.resetFields()
    this.setState({
      newModalVisible: false,
      newModalAccess: {
        name: '',
        sid: 0,
        code: '',
        description: ''
      }
    })
  }

  //详情表单验证成功后触发
  onFinish = () => {
    const valueObj = this.formRef.current.getFieldsValue({
      id: 0,
      name: '',
      sid: 0,
      code: '',
      description: '',
    })
    this.state.modalAccess.name = valueObj.name
    this.state.modalAccess.intro = valueObj.intro
    this.state.modalAccess.num = valueObj.num
    this.state.modalAccess.status = valueObj.status

    this.updateAccess() 
  }

  //新增表单验证成功后触发
  onFinishForNew = () => {
    const valueObj = this.newFormRef.current.getFieldsValue({
      name: '',
      sid: 0,
      code: '',
      description: ''
    })
    const data = {
      name: valueObj.name,
      code: valueObj.code,
      description: valueObj.description
    }
    
    this.addAccess(data)
  }

  addAccess = (data) => {
    const accessData = {
      name: data.name,
      sid: this.state.newModalAccess.sid,
      code: data.code,
      description: data.description
    }
    addAccess(accessData).then(response => {
      if(response.data.status === 200){
        message.success('新增权限成功')
        //重置表单的初始值
        this.newFormRef.current.resetFields()
        this.setState({
          newModalVisible: false,
          newModalAccess: {
            name: '',
            sid: 0,
            code: '',
            description: ''
          }
        })
        this.getAccessList()
      }else{
        message.warning(response.data.message)
      }
    }).catch(error => {
      console.log(error)
      message.error('网络或服务器貌似有问题')
    })
  }

  updateAccess = () => {
    const accessId = this.state.modalAccess.id
    const accessData = this.state.modalAccess
    updateAccess(accessId, accessData).then(response => {
      if(response.data.status === 200){
        message.success('修改权限成功')
        this.setState({
          modalVisible: false
        })
        this.getAccessList()
      }else{
        message.warning(response.data.message)
      }
    }).catch(error => {
      console.log(error)
      message.error('网络或服务器貌似有问题')
    })
  }

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
        width: 100,
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
        title: '类型',
        dataIndex: 'sid',
        align: 'center',
        width: 150,
        ellipsis: {
          showTitle: false
        },
        render: sid => {
          if(sid === 0){
            return '一级权限'
          }else{
            return '二级权限'
          }
        },
      },
      {
        title: '路由',
        dataIndex: 'code',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: code => (
          <Tag color="blue">{code}</Tag>
        )
      },
      {
        title: '描述',
        dataIndex: 'description',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: description => (
          <Tooltip placement="topLeft" title={description}>
            <span>{description}</span>
          </Tooltip>
        )
      },
      {
        title: '创建时间',
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
        title: '更新时间',
        dataIndex: 'update_time',
        align: 'center',
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
        width: 180,
        render: (text, record) => (
          <Space size="middle">
            <a access={JSON.stringify(record)} onClick={this.showModal}>查看</a>
            {record.sid ? '' : <a access={JSON.stringify(record)} onClick={this.displaySubAccess}>下级</a>}
            <a style={{color: "red"}} access={JSON.stringify(record)} onClick={this.deleteAccess}>删除</a>
          </Space>
        ),
      }
    ]

    //新增权限类型字符串提示
    const accessTypeTipsStr = this.state.newModalAccess.sid === 0 ? '新增一级权限' : `新增【${this.state.currentAccessName}】的二级权限`

    return (
      <>
        <div className={styles.container}>
          <div className={styles.header}>一级权限<Button className={styles.addBth} type="primary" data-type="level1" onClick={this.showNewModal}>新增权限</Button></div>
          <div className={styles.empty}></div>
          <Table 
            className={styles.table}
            columns={columns} 
            dataSource={this.state.accessList} 
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

          {
            this.state.displaySubAccess
            ?
            (
              <div className={styles.subcontainer}>
                <div className={styles.header}>【{this.state.currentAccessName}】的二级权限<Button className={styles.addBth} type="primary" data-type="level2" onClick={this.showNewModal}>新增权限</Button></div>
                <div className={styles.empty}></div>
                <Table 
                  className={styles.table}
                  columns={columns} 
                  dataSource={this.state.subAccessList} 
                  rowKey="id"
                  pagination={{
                    position: ['bottomCenter']
                  }}
                />
              </div>
            )
            :
            <div/>
          }
          
        </div>

        <Modal
          title={accessTypeTipsStr}
          visible={this.state.newModalVisible}
          // footer= ''
          okText="确定"
          onOk={this.handleNewModalok}
          cancelText="取消"
          onCancel={this.handleNewModalCancel}
          maskClosable={false}
        >
          <Form 
            {...layout} 
            name="new-modal" 
            onFinish={this.onFinishForNew} 
            initialValues={this.state.newModalAccess}
            validateMessages={validateMessages}
            ref={this.newFormRef}
          >
            <Form.Item name={'name'} label="名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={'code'} label="路由" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={'description'} label="描述">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="权限详情"
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
            initialValues={this.state.modalAccess}
            ref={this.formRef}
          >
            <Form.Item name={'name'} label="名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={'code'} label="路由" rules={[{ required: true }]}>
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