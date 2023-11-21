import authService from '@/services/auth.service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('accessToken') || null)

  let isFetched = false

  const setUser = (newUser) => {
    user.value = newUser
  }

  const removeUser = () => {
    setUser(null)
  }

  const setAccessToken = (newAccessToken) => {
    accessToken.value = newAccessToken
    localStorage.setItem('accessToken', newAccessToken)
  }

  const removeAccessToken = () => {
    accessToken.value = null
    localStorage.removeItem('accessToken')
  }

  const logout = async () => {
    removeAccessToken()
    removeUser()
  }

  const isLogged = () => {
    return accessToken.value != null
  }

  const isAdmin = () => {
    if (!isLogged()) return false
    if (!isFetched) return true

    return user.value?.role === 'nhanvien'
  }

  if (isLogged()) {
    authService.auth().then((user) => setUser(user))
    isFetched = true
  }

  return { user, setUser, removeUser, setAccessToken, removeAccessToken, isLogged, logout, isAdmin }
})
