import Request from './index'

//获取帖子列表
export function getPostList(data){
  return Request.get('/post/admin', {
    params: {
      page_num: data.page_num,
      page_size: data.page_size,
      topic_id: data.topic_id,
      sort: data.sort,
      keyword: data.keyword,
      status: data.status
    }
  })
}

//获取帖子信息
export function getPost(id){
  return Request.get(`/post/${id}`)
}

//删除帖子
export function deletePost(id){
  return Request.delete(`/post/${id}`)
}