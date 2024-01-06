// import axios from "@configs/axios"
import axios from "axios"

const basePath = "/events"

// ** Get table Data
export const getData = (params) => {
  return async (dispatch) => {
    const { page, perPage, q } = params
    let filter = {
      limit: perPage,
      skip: (page - 1) * perPage,
      order: "updatedAt DESC",
      include: ["createdByUser"]
      // fields: { image: false }
    }
    if (params.q && params.q.length > 0) {
      filter["where"] = {
        or: [
          { title: { like: q, options: "i" } },
          { description: { like: q, options: "i" } }
        ]
      }
    }
    await axios
      .get(basePath, { params: { filter, counted: true } })
      .then((response) => {
        dispatch({
          type: "GET_EVENTS",
          // allData: response.data.allData,
          data: response.data.data,
          totalPages: Math.ceil(response.data.count / perPage),
          params
        })
      })
  }
}

// ** Get
export const getOne = (id, cb) => {
  return async (dispatch) => {
    await axios
      .get(`${basePath}/${id}`)
      .then((response) => {
        dispatch({
          type: "GET_EVENT",
          selected: response.data
        })
      })
      .then(() => {
        cb()
      })
      .catch((err) => console.log(err))
  }
}

// ** Add new
export const addOne = (data, cb, ecb = () => {}) => {
  return (dispatch, getState) => {
    // console.log(data)
    // dispatch({
    //   type: "ADD_EVENT"
    // })
    axios
      .post(basePath, data)
      .then((response) => {
        dispatch({
          type: "ADD_EVENT"
          // data
        })
      })
      .then(() => {
        cb()
        //   dispatch(getData(getState().businesss.params))
        //   dispatch(getAllData())
      })
      .catch((err) => {
        ecb()
        console.log(err)
      })
  }
}

// ** Edit
export const editOne = (id, data, cb, ecb = () => {}) => {
  return (dispatch, getState) => {
    axios
      .patch(`/${basePath}/${id}`, data)
      .then((response) => {
        dispatch({
          type: "EDIT_EVENT"
        })
      })
      .then(() => {
        cb()
        //   dispatch(getData(getState().businesss.params))
        //   dispatch(getAllData())
      })
      .catch((err) => {
        ecb()
        console.log(err)
      })
  }
}

// ** Delete business
export const deleteOne = (id, cb) => {
  return (dispatch, getState) => {
    axios
      .delete(`/${basePath}/${id}`)
      .then((response) => {
        dispatch({
          type: "DELETE_EVENT"
        })
      })
      .then(() => {
        cb()
        //   dispatch(getData(getState().businesss.params))
        //   dispatch(getAllData())
      })
      .catch((err) => console.log(err))
  }
}
