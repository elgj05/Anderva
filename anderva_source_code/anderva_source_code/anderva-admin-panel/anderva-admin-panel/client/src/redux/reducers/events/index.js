// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {},
  selected: {
    title: ""
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_EVENTS":
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
        // allData: action.allData,
      }
    case "GET_EVENT":
      return { ...state, selected: action.selected }
    case "ADD_EVENT":
    case "EDIT_EVENT":
    case "DELETE_EVENT":
      return state
    default:
      return state
  }
}

export default reducer
