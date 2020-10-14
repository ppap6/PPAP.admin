import React from 'react'
import { Table, Avatar, Tag, Tooltip, Space, Input, message, Modal, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getPostList, deletePost } from 'api/post'

import styles from './list.styl'
import { getPost } from '../../../api/post'

const { Search } = Input
const { confirm } = Modal

class List extends React.Component {

  formRef = React.createRef()

  state = {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    keyword: '',
    status: 2,
    postList: [],
    modalVisible: false,
    modalPost: {
      id: 0,
      uid: 0,
      uname: '',
      avatar: '',
      title: '',
      content: '',
      md: '',
      create_time: '',
      update_time: '',
      pv: 0,
      likes: 0,
      collects: 0,
      answers: 0,
      topic_id: 0,
      topic_name: '',
      status: 0
    }
  }

  componentDidMount(){
    this.getPostList()
  }

  handleTableChange = (pagination) => {
    this.setState({
      pageNum: pagination.current
    }, () => {
      this.getPostList()
    })
  }

  getPostList = () => {
    this.setState({
      loading: true
    })
    const data = {
      page_num: this.state.pageNum,
      page_size: this.state.pageSize,
      keyword: this.state.keyword,
      status: this.state.status
    }
    getPostList(data).then(response => {
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
          postList: list,
          pageNum: response.data.message.page_num,
          pageSize: response.data.message.page_size,
          total: response.data.message.total
        })
      }else if(response.data.status == 10003){
        this.setState({
          postList: []
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
      this.getPostList()
    })
  }

  goUpdatePost = (e) => {
    const post = JSON.parse(e.target.getAttribute('post'))
    if(!window.frontendUrl){
      message.warning('当前在前端部署文件config.js未配置好前端访问地址')
      return 
    }
    window.open(`${window.frontendUrl}/#/update-post?id=${post.id}`)
  }

  goPostDetail = (e) => {
    if(!window.frontendUrl){
      message.warning('当前在前端部署文件config.js未配置好前端访问地址')
      return 
    }
    window.open(`${window.frontendUrl}/#/post/${this.state.modalPost.id}`)
  }

  deletePost = (e) => {
    const post = JSON.parse(e.target.getAttribute('post'))
    const that = this
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `当前操作即将把帖子『${post.title}』关进小黑屋`,
      okText: '确认',
      cancelText: '取消',
      onOk() {

        that.setState({
          loading: true
        })

        deletePost(post.id).then(response => {
          if(response.data.status === 200){
            message.success(`帖子『${post.title}』成功被关进小黑屋`)
            that.getPostList()
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
        message.info(`帖子『${post.title}』暂时逃脱关进小黑屋的命运`)
      }
    })
  }

  showModal = async (e) => {
    let post = JSON.parse(e.target.getAttribute('post'))
    await getPost(post.id).then(response => {
      if(response.data.status === 200){
        post.content = response.data.message.content
      }else{
        post.content = '获取帖子内容失败'
      }
    }).catch(error => {
      post.content = '获取帖子内容失败'
    })
    this.setState({
      modalPost: post,
      modalVisible: true
    })
  }

  handleModalCancel = () => {
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
        title: '标题',
        dataIndex: 'title',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: title => (
          <Tooltip placement="topLeft" title={title}>
            <span>{title}</span>
          </Tooltip>
        )
      },
      {
        title: '作者',
        dataIndex: 'uname',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: uname => {
          return (
            <Tooltip placement="topLeft" title={uname}>
              <span>{uname}</span>
            </Tooltip>
          )
        },
      },
      {
        title: '头像',
        dataIndex: 'avatar',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: avatar => (
          <Avatar src={avatar} />
        ),
      },
      {
        title: '话题',
        dataIndex: 'topic_name',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: topic_name => (
          <Tooltip placement="topLeft" title={topic_name}>
            <span>{topic_name}</span>
          </Tooltip>
        )
      },
      {
        title: '浏览量',
        dataIndex: 'pv',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: pv => {
          return (
            <Tooltip placement="topLeft" title={pv}>
              <span>{pv}</span>
            </Tooltip>
          )
        },
      },
      {
        title: '点赞量',
        dataIndex: 'likes',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: likes => {
          return (
            <Tooltip placement="topLeft" title={likes}>
              <span>{likes}</span>
            </Tooltip>
          )
        }
      },
      {
        title: '收藏量',
        dataIndex: 'collects',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: collects => {
          return (
            <Tooltip placement="topLeft" title={collects}>
              <span>{collects}</span>
            </Tooltip>
          )
        }
      },
      {
        title: '评论 / 回复',
        dataIndex: 'answers',
        align: 'center',
        ellipsis: {
          showTitle: false
        },
        render: answers => {
          return (
            <Tooltip placement="topLeft" title={answers}>
              <span>{answers}</span>
            </Tooltip>
          )
        }
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
        ellipsis: {
          showTitle: false
        },
        render: (status, record) => {
          if(record.status === 1){
            return (
              <Tag color="green">正常</Tag>
            )
          }else{
            return (
              <Tag color="gray">小黑屋</Tag>
            )
          }  
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        width: 150,
        render: (text, record) => (
          <Space size="middle">
            <a post={JSON.stringify(record)} onClick={this.showModal}>查看</a>
            <a post={JSON.stringify(record)} onClick={this.goUpdatePost}>修改</a>
            {record.status === 0 ? '' : <a style={{color: "red"}} post={JSON.stringify(record)} onClick={this.deletePost}>拉黑</a>}
          </Space>
        ),
      }
    ]

    return (
      <>
        <div className={styles.container}>
          <div className={styles.header}>所有帖子</div>
          <Search className={styles.search} placeholder="请输入关键字" onSearch={value => {this.search(value)}} enterButton />
          <Table 
            className={styles.table}
            columns={columns} 
            dataSource={this.state.postList} 
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
          title="帖子详情"
          width="80vw"
          visible={this.state.modalVisible}
          footer= ''
          onCancel={this.handleModalCancel}
          maskClosable={false}
        > 
          <h1 align="center">{this.state.modalPost.title}</h1>
          <div className={styles.markdownBody} dangerouslySetInnerHTML={{__html: this.state.modalPost.content}}></div>
          <Button className={styles.commentButton} type="primary" onClick={this.goPostDetail}>查看评论</Button>
        </Modal>
      </>
    )
  }
}

export default List;