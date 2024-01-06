// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {},
  selectedUser: {
    role: 'admin',
    name: '',
    email: ''
  }
  // allData: [],
}

const UsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USERS":
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
        // allData: action.allData,
      }
    case "GET_USER":
      return { ...state, selectedUser: action.selectedUser }
    case "ADD_USER":
    case "EDIT_USER":
    case "DELETE_USER":
      return state
    default:
      return state
  }
}

export default UsersReducer
