'use client'

import { useState, useRef, useCallback } from 'react'
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface FileUploadProps {
  onFileUpload?: (files: File[]) => void
  acceptedTypes?: string[]
  maxSize?: number // in MB
  multiple?: boolean
  className?: string
}

interface UploadedFile {
  file: File
  id: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

export default function FileUpload({
  onFileUpload,
  acceptedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'],
  maxSize = 10,
  multiple = true,
  className = ''
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    
    if (fileExtension && !acceptedTypes.includes(fileExtension)) {
      return `Неподдерживаемый тип файла. Поддерживаются: ${acceptedTypes.join(', ')}`
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `Файл слишком большой. Максимальный размер: ${maxSize}MB`
    }
    
    return null
  }

  const uploadToServer = async (uploadedFile: UploadedFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('files', uploadedFile.file)
      
      const xhr = new XMLHttpRequest()
      
      // Отслеживание прогресса загрузки
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, progress: Math.round(progress) }
                : f
            )
          )
        }
      })
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            const response = JSON.parse(xhr.responseText)
            if (response.success) {
              setUploadedFiles(prev => 
                prev.map(f => 
                  f.id === uploadedFile.id 
                    ? { ...f, status: 'success', progress: 100 }
                    : f
                )
              )
              resolve()
            } else {
              throw new Error(response.message || 'Upload failed')
            }
          } catch (error) {
            setUploadedFiles(prev => 
              prev.map(f => 
                f.id === uploadedFile.id 
                  ? { ...f, status: 'error', error: 'Ошибка обработки ответа сервера' }
                  : f
              )
            )
            reject(error)
          }
        } else {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, status: 'error', error: `Ошибка сервера: ${xhr.status}` }
                : f
            )
          )
          reject(new Error(`HTTP ${xhr.status}`))
        }
      })
      
      xhr.addEventListener('error', () => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, status: 'error', error: 'Ошибка сетевого соединения' }
              : f
          )
        )
        reject(new Error('Network error'))
      })
      
      xhr.open('POST', '/api/upload')
      xhr.send(formData)
    })
  }

  const uploadFiles = async (files: File[]) => {
    const newUploadedFiles: UploadedFile[] = files.map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      status: 'uploading' as const,
      progress: 0
    }))

    setUploadedFiles(prev => [...prev, ...newUploadedFiles])

    // Реальная загрузка файлов на сервер
    const uploadPromises = newUploadedFiles.map(uploadedFile => 
      uploadToServer(uploadedFile).catch(() => {})
    )

    await Promise.all(uploadPromises)
    
    if (onFileUpload) {
      onFileUpload(files)
    }
  }

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return

    const validFiles: File[] = []
    const errors: string[] = []

    Array.from(files).forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      alert(`Ошибки валидации:\n${errors.join('\n')}`)
    }

    if (validFiles.length > 0) {
      await uploadFiles(validFiles)
    }
  }, [acceptedTypes, maxSize])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }, [handleFiles])

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    return <DocumentIcon className="w-8 h-8 text-gray-400" />
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.map(type => `.${type}`).join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Перетащите файлы сюда или нажмите для выбора
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Поддерживаемые форматы: {acceptedTypes.join(', ')}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Максимальный размер: {maxSize}MB
        </p>
      </div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Загруженные файлы ({uploadedFiles.length})
            </h4>
            
            <div className="space-y-3">
              {uploadedFiles.map((uploadedFile) => (
                <motion.div
                  key={uploadedFile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-shrink-0 mr-3">
                    {getFileIcon(uploadedFile.file.name)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {uploadedFile.file.name}
                      </p>
                      <button
                        onClick={() => removeFile(uploadedFile.id)}
                        className="flex-shrink-0 ml-2 text-gray-400 hover:text-red-500"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                    
                    {uploadedFile.status === 'uploading' && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                          style={{ width: `${uploadedFile.progress}%` }}
                        ></div>
                      </div>
                    )}
                    
                    {uploadedFile.status === 'success' && (
                      <div className="flex items-center text-green-600 text-xs">
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Загружено успешно
                      </div>
                    )}
                    
                    {uploadedFile.status === 'error' && (
                      <div className="text-red-600 text-xs">
                        {uploadedFile.error || 'Ошибка загрузки'}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}