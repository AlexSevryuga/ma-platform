import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Файлы не найдены' },
        { status: 400 }
      )
    }

    const uploadedFiles = []
    const uploadDir = join(process.cwd(), 'uploads')

    // Создаем директорию для загрузок, если она не существует
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    for (const file of files) {
      if (!file) continue

      // Проверяем размер файла (максимум 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `Файл ${file.name} слишком большой. Максимальный размер: 10MB` },
          { status: 400 }
        )
      }

      // Проверяем тип файла
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv'
      ]

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Тип файла ${file.name} не поддерживается` },
          { status: 400 }
        )
      }

      // Генерируем уникальное имя файла
      const timestamp = Date.now()
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = join(uploadDir, fileName)

      // Сохраняем файл
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Определяем тип документа
      const documentType = determineDocumentType(file.name)

      uploadedFiles.push({
        id: timestamp.toString(),
        name: file.name,
        originalName: file.name,
        size: file.size,
        type: file.type,
        documentType,
        path: filePath,
        uploadedAt: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `Успешно загружено ${uploadedFiles.length} файлов`
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Ошибка при загрузке файлов' },
      { status: 500 }
    )
  }
}

function determineDocumentType(fileName: string): string {
  const lowerFileName = fileName.toLowerCase()
  
  if (lowerFileName.includes('contract') || lowerFileName.includes('договор') || lowerFileName.includes('соглашение')) {
    return 'contract'
  }
  
  if (lowerFileName.includes('financial') || lowerFileName.includes('финанс') || 
      lowerFileName.includes('balance') || lowerFileName.includes('отчет') ||
      lowerFileName.includes('ebitda') || lowerFileName.includes('p&l')) {
    return 'financial'
  }
  
  if (lowerFileName.includes('legal') || lowerFileName.includes('юридич') || 
      lowerFileName.includes('law') || lowerFileName.includes('правов')) {
    return 'legal'
  }
  
  if (lowerFileName.includes('market') || lowerFileName.includes('рынок') || 
      lowerFileName.includes('research') || lowerFileName.includes('исследование')) {
    return 'market'
  }
  
  return 'other'
}

export async function GET() {
  return NextResponse.json(
    { error: 'Метод GET не поддерживается' },
    { status: 405 }
  )
}