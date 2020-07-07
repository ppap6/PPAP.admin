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
      keyword: data.keyword
    }
  })
}

//删除用户
export function deleteUser(id){
  return Request.delete(`/user/${id}`)
}