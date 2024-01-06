import { Ability } from "@casl/ability"
import { initialAbility } from "./initialAbility"
import { getUserData } from "@utils"
import { store } from '@store/storeConfig/store'

export const getUserAbilities = () => {
  const userData = getUserData()
  if (userData && userData.role) {
    if (userData.role === "admin") {
      return [
        {
          action: "manage",
          subject: "all"
        }
      ]
    }
    if (userData.role === "org") {
      return [
        {
          action: "manage",
          subject: "events"
        }
      ]
    }
    return initialAbility
  }
  return initialAbility
}

let currentAuth
store.subscribe(() => {
  const prevAuth = currentAuth
  currentAuth = store.getState().auth.userData.id
  if (prevAuth !== currentAuth) {
    // eslint-disable-next-line no-use-before-define
    ability.update(getUserAbilities(store.getState().auth.userData.role))
  }
})

export const ability = new Ability(getUserAbilities())

// const ability = new Ability([], { subjectName })

// let currentAuth
// store.subscribe(() => {
//   const prevAuth = currentAuth
//   currentAuth = store.getState().currentUserReducer
//   if (prevAuth !== currentAuth) {
//     // eslint-disable-next-line no-use-before-define
//     ability.update(defineRulesFor(currentAuth))
//   }
// })

// function defineRulesFor(auth) {
//   const { can, rules } = AbilityBuilder.extract()
//   if (auth.role === "admin") {
//     can("manage", "all")
//   }
//   if (auth.role === "org") {
//     can("manage", "events")
//   }
//   return rules
// }

// export default ability
