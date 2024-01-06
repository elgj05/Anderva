// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {},
  selectedBusiness: {
    // role: 'admin',
    // name: '',
    // email: ''
  }
  // allData: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_BUSINESSES":
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
        // allData: action.allData,
      }
    case "GET_BUSINESS":
      return { ...state, selectedBusiness: action.selectedBusiness }
    case "ADD_BUSINESS":
    case "EDIT_BUSINESS":
    case "DELETE_BUSINESS":
      return state
    default:
      return state
  }
}

export default reducer
