/**
 * @description 检查邮箱格式
 * @param {string} email
 * @return 0:正确 1:空 2:格式错误 
 */
export function checkEmail(email){
  if(email.trim().length == 0){
    return 1
  }
  const reg = /^[0-9a-zA-Z]+([\.\-_]*[0-9a-zA-Z]+)*@([0-9a-zA-Z]+[\-_]*[0-9a-zA-Z]+\.)+[0-9a-zA-Z]{2,6}$/
  if(reg.test(email)){
    return 0
  }else{
    return 2
  }
}