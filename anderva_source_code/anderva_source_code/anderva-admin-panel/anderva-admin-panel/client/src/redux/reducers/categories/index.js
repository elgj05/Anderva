// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {},
  selected: {
    name: ''
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CATEGORIES":
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
        // allData: action.allData,
      }
    case "GET_CATEGORY":
      return { ...state, selected: action.selected }
    case "ADD_CATEGORY":
    case "EDIT_CATEGORY":
    case "DELETE_CATEGORY":
      return state
    default:
      return state
  }
}

export default reducer
