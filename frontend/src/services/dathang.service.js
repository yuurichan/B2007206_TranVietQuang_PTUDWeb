import createClient from '@/utils/createClient'

class HangHoaService {
  /**
   * @type {import('axios').AxiosInstance}
   */
  #client

  constructor() {
    this.#client = createClient('dathang')
  }

  async placeOrder(body) {
    return await this.#client.post('/', body)
  }
  async getOrders(params) {
    return await this.#client.get('/', { params })
  }
  async getDetail(id) {
    return await this.#client.get('/' + id)
  }
  async update(id, body) {
    return await this.#client.put('/' + id, body)
  }
  async updateChiTiet(id, body) {
    return await this.#client.put('/chitiet/' + id, body)
  }
  async xoaChiTiet(id) {
    return await this.#client.delete('/chitiet/' + id)
  }
  async deleteById(id) {
    return await this.#client.delete('/' + id)
  }
}

export default new HangHoaService()
