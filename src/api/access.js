import Request from './index'

//获取权限列表
export function getAccessList(data){
  return Request.get('/access', {
    params: {
      page_num: data.page_num,
      page_size: data.page_size
    }
  })
}

//删除权限
export function deleteAccess(id){
  return Request.delete(`/access/${id}`)
}

//修改权限信息
export function updateAccess(id, data){
  return Request.put(`/access/${id}`, {
    name: data.name,
    sid: data.sid,
    code: data.code,
    description: data.description
  })
}

//新增权限
export function addAccess(data){
  return Request.post('/access', {
    name: data.name,
    sid: data.sid,
    code: data.code,
    description: data.description
  })
}