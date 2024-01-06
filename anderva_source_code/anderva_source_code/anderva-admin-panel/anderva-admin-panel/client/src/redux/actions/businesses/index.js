// import axios from "@configs/axios"
import axios from "axios"

// ** Get table Data
export const getData = (params) => {
  return async (dispatch) => {
    const { page, perPage, q } = params
    let filter = {
      limit: perPage,
      skip: (page - 1) * perPage,
      order: "updatedAt DESC",
      fields: { image: false },
      include: ["category"]
    }
    if (params.q && params.q.length > 0) {
      filter["where"] = {
        or: [
          { name: { like: q, options: "i" } },
          { phone: { like: q, options: "i" } },
          { category: { like: q, options: "i" } },
          { locationAddress: { like: q, options: "i" } }
        ]
      }
    }
    await axios.get("/businesses", { params: { filter } }).then((response) => {
      dispatch({
        type: "GET_BUSINESSES",
        // allData: response.data.allData,
        data: response.data.data,
        totalPages: Math.ceil(response.data.count / perPage),
        params
      })
    })
  }
}

// ** Get business
export const getBusiness = (id, cb) => {
  return async (dispatch) => {
    await axios
      .get(`/businesses/${id}`)
      .then((response) => {
        dispatch({
          type: "GET_BUSINESS",
          selectedBusiness: response.data
        })
      })
      .then(() => {
        cb()
      })
      .catch((err) => console.log(err))
  }
}

// ** Add new business
export const addBusiness = (business, cb) => {
  return (dispatch, getState) => {
    console.log(business)
    // dispatch({
    //   type: "ADD_BUSINESS"
    // })
    axios
      .post("/businesses", business)
      .then((response) => {
        dispatch({
          type: "ADD_BUSINESS"
          // business
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

// ** Edit business
export const editBusiness = (id, business, cb) => {
  return (dispatch, getState) => {
    axios
      .patch(`/businesses/${id}`, business)
      .then((response) => {
        dispatch({
          type: "EDIT_BUSINESS"
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
export const deleteBusiness = (id, cb) => {
  return (dispatch, getState) => {
    axios
      .delete(`/businesses/${id}`)
      .then((response) => {
        dispatch({
          type: "DELETE_BUSINESS"
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
