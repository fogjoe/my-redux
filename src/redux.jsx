import { createContext, useContext, useEffect, useState } from 'react'

const innerStore = {
  state: undefined,
  reducer: undefined,
  listeners: [],
  setState(newState) {
    innerStore.state = newState
    // 在每次更新的时候通知所有订阅者
    innerStore.listeners.forEach(fn => fn(innerStore.state))
  }
}

const store = {
  getState() {
    return innerStore.state
  },

  dispatch(action) {
    innerStore.setState(innerStore.reducer(innerStore.state, action))
  },

  subscribe(fn) {
    innerStore.listeners.push(fn)

    // 在订阅完成之后希望可以删除此调用
    return () => {
      const index = innerStore.listeners.indexOf(fn)
      innerStore.listeners.splice(index, 1)
    }
  }
}

const dispatch = store.dispatch

export const createStore = (reducer, initialState) => {
  innerStore.state = initialState
  innerStore.reducer = reducer
  return store
}

const changed = (oldState, newState) => {
  let changed = false

  for (const key in oldState) {
    if (oldState[key] !== newState[key]) {
      changed = true
      break
    }
  }
  return changed
}
export const connect = (selector, dispatchSelector) => Component => {
  const Wrapper = props => {
    const { subscribe } = useContext(appContext)

    const [, update] = useState({})

    const data = selector ? selector(innerStore.state) : { state: innerStore.state }

    const dispatchers = dispatchSelector ? dispatchSelector(dispatch) : { dispatch }

    useEffect(
      () =>
        subscribe(() => {
          const newData = selector ? selector(innerStore.state) : { state: innerStore.state }
          if (changed(data, newData)) {
            update({})
          }
        }),
      // 这里最好 取消订阅，否则在 selector 变化时会重复订阅
      [selector]
    )

    return <Component {...props} {...data} {...dispatchers} />
  }

  return Wrapper
}

const appContext = createContext(null)

// eslint-disable-next-line react/prop-types
export const Provider = ({ children, store }) => {
  return <appContext.Provider value={store}>{children}</appContext.Provider>
}
