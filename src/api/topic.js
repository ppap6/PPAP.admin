import Request from './index'

//获取话题列表
export function getTopicList(data){
  return Request.get('/topic/admin', {
    params: {
      page_num: data.page_num,
      page_size: data.page_size
    }
  })
}

//删除话题
export function deleteTopic(id){
  return Request.delete(`/topic/${id}`)
}

//修改话题信息
export function updateTopic(id, data){
  return Request.put(`/topic/${id}`, {
    name: data.name,
    intro: data.intro,
    icon: data.icon,
    num: data.num,
    status: data.status
  })
}

//新增话题
export function addTopic(data){
  return Request.post('/topic/add', {
    name: data.name,
    sid: data.sid,
    intro: data.intro,
    icon: data.icon,
    num: data.num
  })
}