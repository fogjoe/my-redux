import { createContext, useContext, useEffect, useState } from 'react'

const store = {
  state: undefined,
  reducer: undefined,
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

export const createStore = (reducer, initialState) => {
  store.state = initialState
  store.reducer = reducer
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
    const dispatch = action => {
      setState(store.reducer(state, action))
    }

    const { state, setState, subscribe } = useContext(appContext)

    const [, update] = useState({})

    const data = selector ? selector(state) : { state }

    const dispatchers = dispatchSelector ? dispatchSelector(dispatch) : { dispatch }

    useEffect(
      () =>
        subscribe(() => {
          const newData = selector ? selector(store.state) : { state: store.state }
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
