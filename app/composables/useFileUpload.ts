import { MODEL_CONFIG } from '~/constants/three'

export const useFileUpload = () => {
  const uploadedFile = ref<File | null>(null)

  const validateFile = (file: File): boolean => {
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    return MODEL_CONFIG.acceptedFormats.includes(extension)
  }

  const handleFileUpload = async (
    event: Event,
    onSuccess: (url: string, fileSize: number) => void
  ) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    if (!validateFile(file)) {
      alert(`Por favor, selecione um arquivo ${MODEL_CONFIG.acceptedFormats.join(' ou ')}`)
      return
    }

    uploadedFile.value = file
    const url = URL.createObjectURL(file)
    onSuccess(url, file.size)
  }

  return {
    uploadedFile,
    handleFileUpload
  }
}
