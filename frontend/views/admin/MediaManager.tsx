'use client'

import { useEffect, useState, useRef } from 'react'
import { 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  FileText, 
  Music, 
  Image as ImageIcon, 
  Loader2, 
  Search,
  ExternalLink
} from 'lucide-react'
import { Card, CardContent } from '../../lib/shadcn/card'
import { Button } from '../../lib/shadcn/button'
import { Input } from '../../lib/shadcn/input'
import { Badge } from '../../lib/shadcn/badge'
import { toast } from 'sonner'

interface R2File {
  key: string
  size: number
  lastModified: string
  url: string
}

export default function MediaManager() {
  const [files, setFiles] = useState<R2File[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [copiedKey, setCopiedKey] = useState<{ [key: string]: 'markdown' | 'html' | 'url' | null }>({})
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadMedia = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/media')
      const body = await res.json()
      if (res.ok) {
        // Sort files by last modified descending
        const sorted = (body.data ?? []).sort((a: R2File, b: R2File) => 
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        )
        setFiles(sorted)
      } else {
        toast.error(body.message ?? 'Gagal memuat media')
      }
    } catch (e) {
      toast.error('Terjadi kesalahan saat memuat media')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMedia()
  }, [])

  // Helper to convert image to WebP client-side
  const convertToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Canvas context not available'))
            return
          }
          ctx.drawImage(img, 0, 0)
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob)
              else reject(new Error('Canvas conversion to blob failed'))
            },
            'image/webp',
            0.85 // quality
          )
        }
        img.onerror = () => reject(new Error('Image failed to load'))
        img.src = event.target?.result as string
      }
      reader.onerror = () => reject(new Error('FileReader failed'))
      reader.readAsDataURL(file)
    })
  }

  const handleUploadFile = async (rawFile: File) => {
    setUploading(true)
    let fileToUpload = rawFile
    const isImage = rawFile.type.startsWith('image/')
    const isSvgOrWebpOrGif = rawFile.type === 'image/svg+xml' || rawFile.type === 'image/webp' || rawFile.type === 'image/gif'

    // Automatically convert convertable images to WebP
    if (isImage && !isSvgOrWebpOrGif) {
      const convertingToastId = toast.loading(`Mengonversi ${rawFile.name} ke WebP...`)
      try {
        const webpBlob = await convertToWebP(rawFile)
        const newName = rawFile.name.substring(0, rawFile.name.lastIndexOf('.')) + '.webp'
        fileToUpload = new File([webpBlob], newName, { type: 'image/webp' })
        toast.dismiss(convertingToastId)
      } catch (err) {
        toast.dismiss(convertingToastId)
        console.error('WebP conversion failed, using original file format:', err)
      }
    }

    const formData = new FormData()
    formData.append('file', fileToUpload)
    formData.append('folder', 'uploads')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const body = await res.json()
      if (res.ok) {
        toast.success(`Berhasil mengupload ${fileToUpload.name}`)
        loadMedia()
      } else {
        toast.error(body.message ?? 'Gagal mengupload file')
      }
    } catch (e) {
      toast.error('Gagal mengupload file ke server')
    } finally {
      setUploading(false)
    }
  }

  const handleFiles = (fileList: FileList) => {
    if (fileList.length === 0) return
    // Upload files sequentially or in parallel
    const promises = Array.from(fileList).map(file => handleUploadFile(file))
    Promise.all(promises)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDelete = async (key: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus file ini dari Cloudflare R2 secara permanen?')) return

    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      })
      const body = await res.json()
      if (res.ok) {
        toast.success('File berhasil dihapus')
        setFiles(prev => prev.filter(f => f.key !== key))
      } else {
        toast.error(body.message ?? 'Gagal menghapus file')
      }
    } catch (e) {
      toast.error('Terjadi kesalahan saat menghapus file')
    }
  }

  const copyToClipboard = (text: string, key: string, type: 'markdown' | 'html' | 'url') => {
    navigator.clipboard.writeText(text)
    setCopiedKey(prev => ({ ...prev, [key]: type }))
    toast.success('Teks berhasil disalin!')
    setTimeout(() => {
      setCopiedKey(prev => ({ ...prev, [key]: null }))
    }, 2000)
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getCleanName = (key: string) => {
    const parts = key.split('/')
    const filename = parts[parts.length - 1]
    // Remove timestamp prefix if any e.g. 171822312_filename
    const clean = filename.replace(/^\d+_/g, '')
    return clean
  }

  const filteredFiles = files.filter(f => 
    f.key.toLowerCase().includes(search.toLowerCase())
  )

  const isImageFile = (key: string) => {
    const ext = key.split('.').pop()?.toLowerCase()
    return ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp'].includes(ext ?? '')
  }

  const isAudioFile = (key: string) => {
    const ext = key.split('.').pop()?.toLowerCase()
    return ['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(ext ?? '')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Media Manager</h2>
          <p className="text-sm mt-1" style={{ color: '#8A7080' }}>
            Unggah dan kelola aset gambar, audio, dan dokumen Anda di Cloudflare R2.
          </p>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[160px] ${
          isDragOver 
            ? 'border-[#D56989] bg-pink-50/20' 
            : 'border-pink-200 bg-white hover:border-[#D56989] hover:bg-pink-50/10'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => e.target.files && handleFiles(e.target.files)} 
          multiple
          className="hidden" 
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#D56989]" />
            <p className="text-sm font-semibold text-[#D56989]">Sedang mengupload file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(213,105,137,0.08)', color: '#D56989' }}>
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>
                Klik atau seret file ke sini untuk mengunggah
              </p>
              <p className="text-xs mt-1" style={{ color: '#8A7080' }}>
                JPG, PNG, WEBP, SVG, MP3, WAV, PDF • Maksimal 10MB
              </p>
              <p className="text-[10px] mt-1.5 italic text-[#D56989]">
                * Gambar selain WebP/SVG/GIF akan otomatis dikonversi ke WebP untuk performa website optimal
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari file..." 
            className="pl-9 rounded-xl border border-pink-200 focus-visible:ring-[#D56989]"
          />
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-2 bg-white" style={{ borderColor: 'rgba(213,105,137,0.15)', color: '#8A7080' }}>
          Total: <span className="font-extrabold text-[#D56989]">{files.length} file</span>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#D56989]" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: 'rgba(213,105,137,0.12)' }}>
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30 text-gray-400" />
          <p className="text-sm font-bold text-gray-500">Aset tidak ditemukan</p>
          <p className="text-xs text-gray-400 mt-1">Coba unggah file baru atau periksa kata kunci pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredFiles.map((file) => {
            const cleanName = getCleanName(file.key)
            const isImage = isImageFile(file.key)
            const isAudio = isAudioFile(file.key)

            return (
              <Card 
                key={file.key} 
                className="overflow-hidden border border-pink-100 rounded-2xl hover:shadow-lg transition-shadow duration-250 flex flex-col justify-between bg-white"
              >
                {/* Media Preview Area */}
                <div className="relative bg-gray-50 aspect-video flex items-center justify-center border-b border-pink-50 overflow-hidden">
                  {isImage ? (
                    <img 
                      src={file.url} 
                      alt={cleanName} 
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : isAudio ? (
                    <div className="flex flex-col items-center gap-2 text-[#7B68AA]">
                      <Music className="w-8 h-8 animate-pulse" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-md">Audio</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#4A7A2A]">
                      <FileText className="w-8 h-8" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-md">Dokumen</span>
                    </div>
                  )}

                  <Badge className="absolute top-2 left-2 text-[9px] px-1.5 py-0.5 pointer-events-none" variant="secondary" style={{ background: 'rgba(255,255,255,0.92)', color: '#1A1A1A' }}>
                    {file.key.split('.').pop()?.toUpperCase()}
                  </Badge>
                </div>

                {/* File Information */}
                <CardContent className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-gray-800 truncate" title={cleanName}>
                      {cleanName}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {formatSize(file.size)} · {new Date(file.lastModified).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </p>
                  </div>

                  {/* Actions / Copying Panel */}
                  <div className="space-y-1.5">
                    {/* Copy Buttons */}
                    <div className="grid grid-cols-3 gap-1">
                      {isImage ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(`![${cleanName.split('.')[0]}](${file.url})`, file.key, 'markdown')}
                            className="h-7 text-[10px] px-1 rounded-lg border-pink-100"
                          >
                            {copiedKey[file.key] === 'markdown' ? <Check className="w-3 h-3 text-[#4A7A2A]" /> : 'Markdown'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(`<img src="${file.url}" alt="${cleanName.split('.')[0]}" />`, file.key, 'html')}
                            className="h-7 text-[10px] px-1 rounded-lg border-pink-100"
                          >
                            {copiedKey[file.key] === 'html' ? <Check className="w-3 h-3 text-[#4A7A2A]" /> : 'HTML'}
                          </Button>
                        </>
                      ) : (
                        <div className="col-span-2 text-[10px] text-gray-400 flex items-center px-1">
                          Aset Non-Gambar
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(file.url, file.key, 'url')}
                        className="h-7 text-[10px] px-1 rounded-lg border-pink-100"
                      >
                        {copiedKey[file.key] === 'url' ? <Check className="w-3 h-3 text-[#4A7A2A]" /> : 'Copy URL'}
                      </Button>
                    </div>

                    {/* Open & Delete Row */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-pink-50">
                      <Button asChild variant="ghost" size="sm" className="h-7 px-1.5 text-[10px] gap-1 hover:bg-pink-50 text-gray-500">
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" /> Buka Tab Baru
                        </a>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(file.key)}
                        className="h-7 w-7 p-0 rounded-lg hover:bg-red-50 text-red-500"
                        title="Hapus aset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
