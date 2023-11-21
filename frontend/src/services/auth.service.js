import createClient from '@/utils/createClient'

class AuthService {
  /**
   * @type {import('axios').AxiosInstance}
   */
  #client

  constructor() {
    this.#client = createClient('auth')
  }

  async login(body) {
    return await this.#client.post('/login', body)
  }

  async register(body) {
    return await this.#client.post('/register', body)
  }

  async auth() {
    return await this.#client.get('')
  }

  async changePassword(body) {
    return await this.#client.post('/change-password', body)
  }
}

export default new AuthService()
