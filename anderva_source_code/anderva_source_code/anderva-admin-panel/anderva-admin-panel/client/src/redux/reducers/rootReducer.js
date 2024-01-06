// ** Redux Imports
import { combineReducers } from "redux"

// ** Reducers Imports
import auth from "./auth"
import navbar from "./navbar"
import layout from "./layout"
import users from "./users"
import businesses from "./businesses"
import categories from "./categories"
import articles from "./articles"
import events from "./events"

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  users,
  businesses,
  categories,
  events,
  articles
})

export default rootReducer
