import Request from './index'

//获取帖子列表
export function getPostList(data){
  return Request.get('/post/admin', {
    params: {
      page_num: data.page_num,
      page_size: data.page_size,
      topic_id: data.topic_id,
      sort: data.sort,
      keyword: data.keyword
    }
  })
}