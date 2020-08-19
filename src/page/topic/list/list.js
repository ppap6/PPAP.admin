import React from 'react'
import { Table, Avatar, Tag, Tooltip, Space, Input, InputNumber, Form, Button, message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getTopicList, deleteTopic } from 'api/topic'
import PicturesWall from 'component/upload/picturesWall'

import styles from './list.styl'

const { confirm } = Modal

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not validate email!',
    num: '${label} is not a validate number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

class List extends React.Component {

  formRef = React.createRef();

  state = {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    topicList: [],
    currentTopicId: 0,
    currentTopicName: '',
    displaySubTopic: false,
    subTopicList: [],
    modalVisible: false,
    modalTopic: {
      id: 0,
      name: '',
      sid: 0,
      intro: '',
      icon: '',
      num: 0,
      posts: 0,
      followers: 0,
      status: 0
    }
  }

  componentDidMount(){
    this.getTopicList()
  }

  handleTableChange = (pagination) => {
    this.setState({
      pageNum: pagination.current
    }, () => {
      this.getTopicList()
    })
  }

  getTopicList = () => {
    this.setState({
      loading: true
    })
    const data = {
      page_num: this.state.pageNum,
      page_size: this.state.pageSize
    }
    getTopicList(data).then(response => {
      if(response.data.status == 200){
        const list = response.data.message.list
        this.setState({
          topicList: list,
          pageNum: response.data.message.page_num,
          pageSize: response.data.message.page_size,
          total: response.data.message.total
        })
        for(let i=0; i<list.length; i++){
          //更新二级话题列表
          if(list[i].id === this.state.currentTopicId){
            this.setState({
              subTopicList: list[i].child
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
      this.getTopicList()
    })
  }

  displaySubTopic = (e) => {
    const topic = JSON.parse(e.target.getAttribute('topic'))
    this.setState({
      displaySubTopic: false
    }, () => {
      this.setState({
        subTopicList: topic.child,
        displaySubTopic: true,
        currentTopicId: topic.id,
        currentTopicName: topic.name
      })
    })
  }

  deleteTopic = (e) => {
    const topic = JSON.parse(e.target.getAttribute('topic'))
    const that = this
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `当前操作即将把话题『${topic.name}』关进小黑屋`,
      okText: '确认',
      cancelText: '取消',
      onOk() {

        that.setState({
          loading: true
        })

        deleteTopic(topic.id).then(response => {
          if(response.data.status == 200){
            message.success(`话题『${topic.name}』成功被关进小黑屋`)
            that.getTopicList()
          }else{
            message.warning(response.data.message)
          }
          that.setState({
            loading: true
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
        message.info(`话题『${topic.name}』暂时逃脱关进小黑屋的命运`)
      }
    })
  }

  showModal = (e) => {
    const topic = JSON.parse(e.target.getAttribute('topic'))
    this.setState({
      modalTopic: topic,
      modalVisible: true
    }, () => {
      if(this.formRef.current !== null){
        this.formRef.current.setFieldsValue(topic)
      }
    })
  }

  handleModalCancel = () => {
    this.setState({
      modalVisible: false
    })
  }

  //表单验证成功后触发
  onFinish = values => {
    console.log(values);
    this.setState({
      modalVisible: false
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
        ellipsis: {
          showTitle: false
        },
        render: sid => {
          if(sid === 0){
            return '一级话题'
          }else{
            return '二级话题'
          }
        },
      },
      {
        title: '图标',
        dataIndex: 'icon',
        align: 'center',
        width: 100,
        render: icon => (
          <Avatar src={icon} />
        ),
      },
      {
        title: '简介',
        dataIndex: 'intro',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: intro => (
          <Tooltip placement="topLeft" title={intro}>
            <span>{intro}</span>
          </Tooltip>
        )
      },
      {
        title: '序号',
        dataIndex: 'num',
        align: 'center',
        width: 80
      },
      {
        title: '帖子数',
        dataIndex: 'posts',
        align: 'center',
        width: 80,
        render: (posts, record) => (
          <>
            {record.sid ? <Tag color="blue">{posts}</Tag> : '*'}
          </>
        )
      },
      {
        title: '关注数',
        dataIndex: 'followers',
        align: 'center',
        width: 80,
        render: (followers, record) => (
          <>
            {record.sid ? <Tag color="geekblue">{followers}</Tag> : '*'}
          </>
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
        title: '显示状态',
        dataIndex: 'status',
        align: 'center',
        width: 100,
        render: (status) => {
          if(status){
            return (
              <Tag color="green">显示</Tag>
            )
          }else{
            return (
              <Tag color="gray">不显示</Tag>
            )
          }  
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        width: 180,
        render: (text, record) => (
          <Space size="middle">
            <a topic={JSON.stringify(record)} onClick={this.showModal}>查看</a>
            {record.sid ? '' : <a topic={JSON.stringify(record)} onClick={this.displaySubTopic}>下级</a>}
            <a topic={JSON.stringify(record)} onClick={this.deleteTopic}>拉黑</a>
          </Space>
        ),
      }
    ]

    return (
      <>
        <div className={styles.container}>
          <div className={styles.header}>一级话题</div>
          <div className={styles.empty}></div>
          <Table 
            className={styles.table}
            columns={columns} 
            dataSource={this.state.topicList} 
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
            this.state.displaySubTopic
            ?
            (
              <div className={styles.subcontainer}>
                <div className={styles.header}>【{this.state.currentTopicName}】的二级话题</div>
                <div className={styles.empty}></div>
                <Table 
                  className={styles.table}
                  columns={columns} 
                  dataSource={this.state.subTopicList} 
                  rowKey="id"
                />
              </div>
            )
            :
            <div/>
          }
          
        </div>

        <Modal
          title="话题详情"
          visible={this.state.modalVisible}
          footer= ''
          onCancel={this.handleModalCancel}
        >
          <Form 
            {...layout} 
            name="nest-messages" 
            onFinish={this.onFinish} 
            validateMessages={validateMessages}
            initialValues={this.state.modalTopic}
            ref={this.formRef}
          >
            <Form.Item label="name" name={'name'} label="名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="num" name={'num'} label="序号" rules={[{ type: 'number', min: 0, max: 99 }]}>
              <InputNumber />
            </Form.Item>
            {
              this.state.modalTopic.sid
              ?
              <>
              <Form.Item label="posts" name={'posts'} label="帖子数">
                <Tag color="blue">{this.state.modalTopic.posts}</Tag>
              </Form.Item>
              <Form.Item label="followers" name={'followers'} label="关注数">
                <Tag color="geekblue">{this.state.modalTopic.followers}</Tag>
              </Form.Item>
              </>
              :
              <></>
            }
            <Form.Item label="icon" name={'icon'} label="图标">
              <PicturesWall />
            </Form.Item>
            <Form.Item label="intro" name={'intro'} label="简介">
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