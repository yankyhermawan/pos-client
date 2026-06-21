import { Bounce, toast, type ToastOptions } from 'react-toastify'

const defaultConfig: ToastOptions = {
  hideProgressBar: true,
  pauseOnHover: false,
  progress: undefined,
  theme: 'colored',
  transition: Bounce,
}

export const success = (message: string) => toast.success(message, defaultConfig)
export const error = (message: string) => toast.error(message, defaultConfig)