/* eslint-disable react/prop-types */
import { connectToUser } from './connecters/connectToUser.js'
import { connect,  createStore, Provider } from './redux.jsx'

const initialState = {
  user: { name: 'frank', age: 18 },
  group: { name: '前端组' }
}
const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'updateUser':
      return {
        ...state,
        user: {
          ...state.user,
          ...payload
        }
      }
    default:
      return state
  }
}
const store = createStore(reducer, initialState)

const App = () => {
  return (
    <Provider store={store}>
      <大儿子 />
      <二儿子 />
      <幺儿子 />
    </Provider>
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

const ajax = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({data: {name: '3秒后的frank'}})
    }, 3000)
  })
}
const fetchUserPromise = () => {
  return ajax('/user').then(response => response.data)
}
const fetchUser = (dispatch) => {
  return ajax('/user').then(response => dispatch({type: 'updateUser', payload: response.data}))
}

const User = connectToUser(({ user }) => {
  console.log('User执行了' + Math.random())
  // 如果后端返回的数据形式为 state.xxx.yyy.zzz.user.name
  return <div>User:{user.name}</div>
})
const UserModifier = connect(null, null)(({ dispatch, state, }) => {
  console.log('UserModifier执行了' + Math.random())
  const onChange = e => {
    // updateUser({ name: e.target.value })
        dispatch({type: 'updateUser', payload: fetchUserPromise()})
  }
  return (
    <div>
      <input value={state.user.name} onChange={onChange} />
    </div>
  )
})

export default App
