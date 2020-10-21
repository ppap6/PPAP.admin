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
    email: data.email,
    account: data.account,
    sex: data.sex,
    avatar: data.avatar,
    bg: data.bg,
    title: data.title,
    signature: data.signature,
    mobile: data.mobile,
    role_id: data.role_id,
    status: data.status
  })
}

//新增用户
export function addUser(data){
  return Request.post('user', {
    name: data.name,
    email: data.email,
    password: data.password,
    role_id: data.role_id
  })
}

//获取用户权限列表（用于生成菜单栏）
export function getUserAuthList(){
  return Request.get('/user/auth')
}