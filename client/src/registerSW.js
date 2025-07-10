// src/registerSW.js
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
    // Show a toast notification
    showNotification('App is ready to work offline!', 'info')
  },
  onRegistered(r) {
    console.log('SW Registered: ' + r)
  },
  onRegisterError(error) {
    console.log('SW registration error', error)
  },
})

function showNotification(message, type = 'info') {
  // Create a simple notification
  const notification = document.createElement('div')
  notification.className = `
    fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm
    ${type === 'info' ? 'bg-blue-500' : 'bg-green-500'}
  `
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 3000)
}

export default updateSW