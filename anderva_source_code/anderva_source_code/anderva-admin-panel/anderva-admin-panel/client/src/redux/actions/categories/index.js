// import axios from "@configs/axios"
import axios from "axios"

const basePath = "/categories"

// ** Get table Data
export const getData = (params) => {
  return async (dispatch) => {
    const { page, perPage, q } = params
    let filter = {
      limit: perPage,
      skip: (page - 1) * perPage,
      order: "updatedAt DESC"
      // fields: { image: false },
      // include: ["category"]
    }
    if (params.q && params.q.length > 0) {
      filter["where"] = {
        or: [
          { name: { like: q, options: "i" } }
          // { phone: { like: q, options: "i" } },
          // { category: { like: q, options: "i" } },
          // { locationAddress: { like: q, options: "i" } }
        ]
      }
    }
    await axios
      .get(basePath, { params: { filter, counted: true } })
      .then((response) => {
        dispatch({
          type: "GET_CATEGORIES",
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
          type: "GET_CATEGORY",
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
export const addOne = (data, cb) => {
  return (dispatch, getState) => {
    // console.log(business)
    // dispatch({
    //   type: "ADD_CATEGORY"
    // })
    axios
      .post(basePath, data)
      .then((response) => {
        dispatch({
          type: "ADD_CATEGORY"
          // data
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

// ** Edit
export const editOne = (id, data, cb) => {
  return (dispatch, getState) => {
    axios
      .patch(`/${basePath}/${id}`, data)
      .then((response) => {
        dispatch({
          type: "EDIT_CATEGORY"
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

// ** Delete business
export const deleteOne = (id, cb) => {
  return (dispatch, getState) => {
    axios
      .delete(`/${basePath}/${id}`)
      .then((response) => {
        dispatch({
          type: "DELETE_CATEGORY"
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
