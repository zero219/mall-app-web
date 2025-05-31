
// 获取个人信息
export const getInfo = (key) => {
  const result = localStorage.getItem(key)
  return result ? JSON.parse(result) : ''
}

// 设置个人信息
export const setInfo = (key, info) => {
  localStorage.setItem(key, JSON.stringify(info))
}

// 移除个人信息
export const removeInfo = (key) => {
  localStorage.removeItem(key)
}
