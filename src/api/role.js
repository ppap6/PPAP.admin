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

//修改角色信息
export function updateRole(id, data){
  return Request.put(`/role/${id}`, {
    name: data.name,
    description: data.description
  })
}

//获取角色权限列表
export function getRoleAccessList(id){
  return Request.get(`/role/access/${id}`)
}

//修改角色权限
export function updateRoleAccess(id, access_ids){
  return Request.put(`/role/access/${id}`, {
    access: access_ids
  })
}