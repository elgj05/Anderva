// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {},
  selected: {
    title: ''
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ARTICLES":
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
        // allData: action.allData,
      }
    case "GET_ARTICLE":
      return { ...state, selected: action.selected }
    case "ADD_ARTICLE":
    case "EDIT_ARTICLE":
    case "DELETE_ARTICLE":
      return state
    default:
      return state
  }
}

export default reducer
