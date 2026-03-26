export const useToast = () => {
  const showToast = (message, type = 'success') => {
    // Disparar evento personalizado que el ToastNotification escuchará
    window.dispatchEvent(new CustomEvent('toast-notification', { 
      detail: { message, type } 
    }))
  }

  return { showToast }
}