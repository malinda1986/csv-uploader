/* global window */
import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import {socket, connectSocket} from '../../services/socket'

import {
  queryUserList,
  createUser,
  removeUser,
  updateUser,
  removeUserList,
  uploadUsers,
  searchUsers,
} from 'api'
import { pageModel } from 'utils/model'

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    status: {},
    record: {count : 0},
    names: [],
    searchKey: ''
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        
        if (pathMatchRegexp('/user', location.pathname)) {
          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })

          socket.on("new_msg", function (data) {
              dispatch({
                type: 'updateStatus',
                payload: data
              });
          });
        }
        
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {
      const data = yield call(queryUserList, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    *updateStatus({ payload = {} }, { call, put }) {
        if(payload.type == 'upload'){
          yield put({
            type: 'updateState',
            payload: {
              status: payload,
            },
          })
        } else {
          yield put({
            type: 'updateState',
            payload: {
              record: payload,
            },
          })
        }
        
    },

    *nameSearch({ payload = {} }, { call, put }) {
      const data = yield call(searchUsers, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            names: data.data,
          }
        })
      }
    },

    *itemSearch({ payload = {} }, { call, put }) {
      const data = yield call(searchUsers, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total || data.length,
            },
          },
        })
      }
    },

    *delete({ payload }, { call, put, select }) {
      const data = yield call(removeUser, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload),
          },
        })
      } else {
        throw data
      }
    },

    

    *multiDelete({ payload }, { call, put }) {
      const data = yield call(removeUserList, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
      }
    },

    *create({ payload }, { call, put }) {
      const data = yield call(uploadUsers, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(updateUser, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  },
})
