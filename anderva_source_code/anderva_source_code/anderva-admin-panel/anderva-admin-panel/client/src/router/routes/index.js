import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - Admin Panel'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))
  },
  // {
  //   path: '/second-page',
  //   component: lazy(() => import('../../views/SecondPage'))
  // },
  {
    path: '/users',
    component: lazy(() => import('../../views/users/Users'))
  },
  {
    path: '/events',
    component: lazy(() => import('../../views/events/Events'))
  },
  {
    path: '/businesses',
    component: lazy(() => import('../../views/businesses/Businesses'))
  },
  {
    path: '/articles',
    component: lazy(() => import('../../views/articles/Articles'))
  },
  {
    path: '/categories',
    component: lazy(() => import('../../views/categories/Categories'))
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
