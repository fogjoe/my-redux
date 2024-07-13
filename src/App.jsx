/* eslint-disable react/prop-types */
import React, { useState, useContext } from 'react'

const appContext = React.createContext(null)
const App = () => {
  const [appState, setAppState] = useState({
    user: { name: 'frank', age: 18 }
  })
  const contextValue = { appState, setAppState }
  return (
    <appContext.Provider value={contextValue}>
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
const User = () => {
  console.log('User执行了' + Math.random())
  const contextValue = useContext(appContext)
  return <div>User:{contextValue.appState.user.name}</div>
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

const connect = Component => {
  const Wrapper = props => {
    const { appState, setAppState } = useContext(appContext)

    const dispatch = action => {
      setAppState(reducer(appState, action))
    }

    return <Component {...props} dispatch={dispatch} state={appState} />
  }

  return Wrapper
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
