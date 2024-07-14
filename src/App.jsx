/* eslint-disable react/prop-types */
import { connectToUser } from './connecters/connectToUser.js'
import { store, connect, appContext } from './redux.jsx'

const App = () => {
  return (
    <appContext.Provider value={store}>
      <大儿子 />
      <二儿子 />
      <幺儿子 />
    </appContext.Provider>
  )
}
const 大儿子 = () => {
  console.log('大儿子执行了' + Math.random())

  return (
    <section>
      大儿子
      <User />
    </section>
  )
}
const 二儿子 = () => {
  console.log('二儿子执行了' + Math.random())

  return (
    <section>
      二儿子
      <UserModifier>context</UserModifier>
    </section>
  )
}
const 幺儿子 = connect(state => {
  return { group: state.group }
})(({ group }) => {
  console.log('幺儿子执行了' + Math.random())
  return (
    <section>
      幺儿子: <div>Group: {group.name}</div>
    </section>
  )
})

const User = connectToUser(({ user }) => {
  console.log('User执行了' + Math.random())
  // 如果后端返回的数据形式为 state.xxx.yyy.zzz.user.name
  return <div>User:{user.name}</div>
})
const UserModifier = connectToUser(({ updateUser, user, children }) => {
  console.log('UserModifier执行了' + Math.random())
  const onChange = e => {
    updateUser({ name: e.target.value })
  }
  return (
    <div>
      {children}
      <input value={user.name} onChange={onChange} />
    </div>
  )
})

export default App
