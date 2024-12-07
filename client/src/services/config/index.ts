const BASE_URL: string = import.meta.env.VITE_APP_BASE_URL
const API_BASE_URL: string = import.meta.env.VITE_APP_API_BASE_URL
const URL = `${BASE_URL}${API_BASE_URL}`
const TIME_OUT = 60000
export { URL, TIME_OUT }
