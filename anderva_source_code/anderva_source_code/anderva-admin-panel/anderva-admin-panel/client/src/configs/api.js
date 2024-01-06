const dev = "http://localhost:3001/api"
const prod = "https://panel.anderva.app/api"

export default process.env.NODE_ENV === 'production' ? prod : dev
