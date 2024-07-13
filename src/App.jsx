/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const connect = Component => {
  const Wrapper = props => {
    const { state, setState, subscribe } = useContext(appContext)

    const [, update] = useState({})

    useEffect(() => {
      console.log('connect执行了' + Math.random())
      subscribe(() => {
        update({})
      })
    }, [])

    const dispatch = action => {
      setState(reducer(state, action))
    }

    return <Component {...props} dispatch={dispatch} state={state} />
  }

  return Wrapper
}

const store = {
  state: { user: { name: 'frank', age: 18 } },
  setState(newState) {
    store.state = newState
    // 在每次更新的时候通知所有订阅者
    store.listeners.forEach(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)

    // 在订阅完成之后希望可以删除此调用
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  }
}
const appContext = React.createContext(null)
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
const 幺儿子 = () => {
  console.log('幺儿子执行了' + Math.random())

  return <section>幺儿子</section>
}
const User = connect(({ state }) => {
  console.log('User执行了' + Math.random())
  return <div>User:{state.user.name}</div>
})
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

const UserModifier = connect(({ dispatch, state, children }) => {
  console.log('UserModifyer执行了' + Math.random())
  const onChange = e => {
    dispatch({ type: 'updateUser', payload: { name: e.target.value } })
  }
  return (
    <div>
      {children}
      <input value={state.user.name} onChange={onChange} />
    </div>
  )
})

export default App
