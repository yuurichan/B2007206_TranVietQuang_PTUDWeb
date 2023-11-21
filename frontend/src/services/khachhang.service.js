import createClient from '@/utils/createClient'

class KhachHangService {
  /**
   * @type {import('axios').AxiosInstance}
   */
  #client

  constructor() {
    this.#client = createClient('khach')
  }

  async getAll(params) {
    return await this.#client.get('', { params })
  }

  async getById(id) {
    return await this.#client.get(`/${id}`)
  }

  async updateById(id, body) {
    return await this.#client.put(`/${id}`, body)
  }

  async selfUpdate(body) {
    return await this.#client.put('', body)
  }

  async deleteById(id) {
    return await this.#client.delete(`/${id}`)
  }
}

export default new KhachHangService()
