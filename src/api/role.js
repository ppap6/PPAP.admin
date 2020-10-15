import Request from './index'

//获取角色列表
export function getRoleList(data){
  return Request.get('/role', {
    params: {
      page_num: data.page_num,
      page_size: data.page_size
    }
  })
}