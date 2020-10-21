import React from 'react'
import { Table, Tag, Tooltip, Space, Input, message, Form, Modal, Button, Tree } from 'antd'
import { getRoleList, updateRole, getRoleAccessList, updateRoleAccess } from 'api/role'
import { getAccessList } from 'api/access'

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
    },
    //全部权限列表
    allAccessList: [],
    //全部权限对象数组
    allAccessObjArr: [],
    //角色的权限列表表单
    ModalRoleAccessVisible: false,
    //当前角色的权限列表
    currentRoleAccessList: [],
    //当前权限分配的角色信息
    currentCheckAccessRole: {},
    //【初始化展示使用，不包含一级节点，以为一级节点选中会使得二级节点全选】当前角色已选中的权限（数组）
    checkedKeys: [],
    //【真实id数组，包含一级节点】当前角色已选中的权限（数组）
    realCheckedKeys: [],
    //权限分配弹窗
    roleAccessModalVisible: false
  }

  componentDidMount(){
    this.getRoleList()
    this.getAccessList()
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

  getAccessList = () => {
    const data = {
      page_num: 1,
      page_size: 20
    }
    getAccessList(data).then(response => {
      if(response.data.status === 200){
        let list = response.data.message.list
        let newList = []
        let newObjArr = []
        for(let i=0; i<list.length; i++){
          const childList = list[i].child
          newList.push({
            title: list[i].name,
            key: list[i].id,
            sid: list[i].sid,
            children: []
          })
          newObjArr.push({
            title: list[i].name,
            key: list[i].id,
            sid: list[i].sid
          })
          for(let j=0; j<childList.length; j++){
            newList[i].children.push({
              title: childList[j].name,
              key: childList[j].id,
              sid: childList[j].sid
            })
            newObjArr.push({
              title: childList[j].name,
              key: childList[j].id,
              sid: childList[j].sid
            })
          }
        }
        this.setState({
          allAccessList: newList,
          allAccessObjArr: newObjArr
        })
      }else if(response.data.status === 10003){
        message.warning('权限列表数据为空')
      }else{
        message.warning(response.data.message)
      }
    }).catch(error => {
      console.log(error)
      message.error('网络或服务器貌似有问题')
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

  //详情表单验证成功后触发
  onFinish = () => {
    const valueObj = this.formRef.current.getFieldsValue({
      id: 0,
      name: '',
      create_time: '',
      update_time: '',
      description: ''
    })
    let modalRole = this.state.modalRole
    modalRole.name = valueObj.name
    modalRole.create_time = valueObj.create_time
    modalRole.update_time = valueObj.update_time
    modalRole.description = valueObj.description
    this.setState({
      modalRole
    }, () => {
      this.updateRole()
    })
  }

  updateRole = () => {
    const roleId = this.state.modalRole.id
    const roleData = this.state.modalRole
    updateRole(roleId, roleData).then(response => {
      if(response.data.status === 200){
        message.success('修改角色信息成功')
        this.setState({
          modalVisible: false
        })
        this.getRoleList()
      }else{
        message.warning(response.data.message)
      }
    }).catch(error => {
      console.log(error)
      message.error('网络或服务器貌似有问题')
    })
  }

  //展示角色的权限列表
  showRoleAccessModal = (e) => {
    const role = JSON.parse(e.target.getAttribute('role'))
    this.setState({
      checkedKeys: [],
      roleAccessModalVisible: true,
      currentCheckAccessRole: role
    })
    getRoleAccessList(role.id).then(response => {
      if(response.data.status === 200){
        const list = response.data.message
        let checkedKeys = []
        for(let i=0; i<list.length; i++){
          const childList = list[i].child
          // 一级权限不需要放进数组
          // checkedKeys.push(list[i].id)
          for(let j=0; j<childList.length; j++){
            checkedKeys.push(childList[j].id)
          }
        }
        this.setState({
          currentRoleAccessList: list,
          checkedKeys
        })
      }
    }).catch(error => {
      console.log(error)
      message.error('网络或服务器貌似有问题')
    })
  }

  handleRoleAccessModalCancel = () => {
    this.setState({
      roleAccessModalVisible: false,
      currentRoleAccessList: [],
      checkedKeys: []
    })
  }

  //提取出真实要提交的数据，权限id拼接字符串
  handleRealCheckedKeys = () => {
    console.log(this.state.checkedKeys)
    let checkedKeys = this.state.checkedKeys
    const allAccessObjArr = this.state.allAccessObjArr
    let arr = checkedKeys
    for(let i=0; i<checkedKeys.length; i++){
      for(let j=0; j<allAccessObjArr.length; j++){
        if(checkedKeys[i] === allAccessObjArr[j].key && allAccessObjArr[j].sid !== 0){
          arr.push(allAccessObjArr[j].sid)
        }
      }
    }
    const realArr = [...new Set(arr)]
    const ids = realArr.join(',')
    return ids
  }

  //修改角色权限
  updateRoleAccess = () => {
    const ids = this.handleRealCheckedKeys()
    const roleId = this.state.currentCheckAccessRole.id
    updateRoleAccess(roleId, ids).then(response => {
      if(response.data.status === 200){
        message.success('修改角色权限成功')
        this.setState({
          roleAccessModalVisible: false,
          currentRoleAccessList: [],
          checkedKeys: []
        })
      }else{
        message.warning(response.data.message)
      }
    }).catch(error => {
      console.log(error)
      message.error('网络或服务器貌似有问题')
    })
  }

  //角色权限选择框触发函数
  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys)
    this.setState({
      checkedKeys
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
            <a role={JSON.stringify(record)} onClick={this.showRoleAccessModal}>权限分配</a>
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
        
        <Modal
          title={`【${this.state.currentCheckAccessRole.name}】权限分配`}
          visible={this.state.roleAccessModalVisible}
          okText="保存"
          onOk={this.updateRoleAccess}
          cancelText="取消"
          onCancel={this.handleRoleAccessModalCancel}
          maskClosable={false}
        >
          {
            this.state.allAccessList.length === 0 
            ? '' 
            :  
            <Tree
              checkable
              // checkStrictly
              defaultExpandAll
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              treeData={this.state.allAccessList}
            />
          }
        </Modal>
      </>
    )
  }
}

export default List;