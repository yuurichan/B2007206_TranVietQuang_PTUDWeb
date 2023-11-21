class FileService {
  getFileUrl(filePath) {
    return import.meta.env.VITE_APP_API_URL + '/' + filePath
  }
}

export default new FileService()
