// import axios from "@configs/axios"
import axios from "axios"

// ** Get table Data
export const getData = (params) => {
  return async (dispatch) => {
    const { page, perPage, q } = params
    let filter = {
      limit: perPage,
      skip: (page - 1) * perPage,
      order: "updatedAt DESC"
    }
    if (params.q && params.q.length > 0) {
      filter["where"] = {
        or: [
          { name: { like: q, options: "i" } },
          { email: { like: q, options: "i" } }
        ]
      }
    }
    await axios.get("/users", { params: { filter } }).then((response) => {
      dispatch({
        type: "GET_USERS",
        // allData: response.data.allData,
        data: response.data.data,
        totalPages: Math.ceil(response.data.count / perPage),
        params
      })
    })
  }
}

// ** Get User
export const getUser = (id, cb) => {
  return async (dispatch) => {
    await axios
      .get(`/users/${id}`)
      .then((response) => {
        dispatch({
          type: "GET_USER",
          selectedUser: response.data
        })
      })
      .then(() => {
        cb()
      })
      .catch((err) => console.log(err))
  }
}

// ** Add new user
export const addUser = (user, cb) => {
  return (dispatch, getState) => {
    axios
      .post("/users", user)
      .then((response) => {
        dispatch({
          type: "ADD_USER"
          // user
        })
      })
      .then(() => {
        cb()
        //   dispatch(getData(getState().users.params))
        //   dispatch(getAllData())
      })
      .catch((err) => console.log(err))
  }
}

// ** Edit user
export const EditUser = (id, user, cb) => {
  return (dispatch, getState) => {
    axios
      .patch(`/users/${id}`, user)
      .then((response) => {
        dispatch({
          type: "EDIT_USER"
        })
      })
      .then(() => {
        cb()
        //   dispatch(getData(getState().users.params))
        //   dispatch(getAllData())
      })
      .catch((err) => console.log(err))
  }
}

// ** Delete user
export const deleteUser = (id, cb) => {
  return (dispatch, getState) => {
    axios
      .delete(`/users/${id}`)
      .then((response) => {
        dispatch({
          type: "DELETE_USER"
        })
      })
      .then(() => {
        cb()
        //   dispatch(getData(getState().users.params))
        //   dispatch(getAllData())
      })
      .catch((err) => console.log(err))
  }
}
