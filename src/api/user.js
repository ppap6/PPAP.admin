import Request from './index'

//用户登录
export function login(data) {
  return Request.post('/user/login', {
    email: data.email,
    password: data.password
  })
}

//获取用户列表
export function getUserList(data){
  return Request.get('/user', {
    params: {
      page_num: data.page_num,
      page_size: data.page_size,
      keyword: data.keyword,
      status: data.status
    }
  })
}

//删除用户
export function deleteUser(id){
  return Request.delete(`/user/${id}`)
}

//修改用户信息
export function updateUser(id, data){
  return Request.put(`/user/${id}`, {
    name: data.name,
    account: data.account,
    title: data.title,
    sex: data.sex,
    email: data.email,
    role_id: data.role_id,
    status: data.status
  })
}