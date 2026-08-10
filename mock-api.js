export async function loginWithFetch(username, password) {
  const response = await fetch('/mock-users.json')

  if (!response.ok) {
    throw new Error('用户数据加载失败，状态码：' + response.status)
  }

  const data = await response.json()

  const user = data.users.find(function (item) {
    return item.username === username && item.password === password
  })

  if (user === undefined) {
    throw new Error('用户名或密码错误')
  }

  return {
    username: user.username,
  }
}
