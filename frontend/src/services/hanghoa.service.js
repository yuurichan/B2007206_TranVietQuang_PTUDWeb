import createClient from '@/utils/createClient'

class HangHoaService {
  /**
   * @type {import('axios').AxiosInstance}
   */
  #client

  constructor() {
    this.#client = createClient('hanghoa')
  }

  async create(body) {
    return await this.#client.post('', body)
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

  async deleteById(id) {
    return await this.#client.delete(`/${id}`)
  }

  async addImage(id, image) {
    const formData = new FormData()
    formData.append('image', image)

    return await this.#client.post(`/${id}/hinh`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  async deleteImage(id, imageId) {
    return await this.#client.delete(`/${id}/hinh/${imageId}`)
  }
  async getMultipleProducts(listIds) {
    const param = listIds.join(',')
    return await this.#client.get(`/ids/${listIds}`)
  }
}

export default new HangHoaService()
