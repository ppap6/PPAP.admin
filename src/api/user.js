import Request from './index'

//用户登录
export function login(data) {
  return Request.post('/user/login', {
    email: data.email,
    password: data.password
  })
}