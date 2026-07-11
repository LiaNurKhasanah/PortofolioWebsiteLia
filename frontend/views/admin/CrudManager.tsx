/**
 * Komponen generik untuk menampilkan tabel CRUD admin.
 * Dipakai oleh semua manager (Keahlian, Pengalaman, dll).
 */
import { ReactNode } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '../../lib/shadcn/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../lib/shadcn/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '../../lib/shadcn/alert-dialog'
import { Skeleton } from '../../lib/shadcn/skeleton'

export interface Column<T> {
  header: string
  cell: (row: T) => ReactNode
  className?: string
}

interface Props<T extends { id: number }> {
  title: string
  description?: string
  columns: Column<T>[]
  data: T[]
  loading: boolean
  onAdd: () => void
  onEdit: (row: T) => void
  onDelete: (id: number) => Promise<void>
}

export default function CrudManager<T extends { id: number }>({
  title, description, columns, data, loading, onAdd, onEdit, onDelete,
}: Props<T>) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>{title}</h2>
          {description && <p className="text-sm mt-1" style={{ color: '#8A7080' }}>{description}</p>}
        </div>
        <Button onClick={onAdd} className="gap-2 rounded-xl"
          style={{ background: '#D56989', color: '#fff', border: 'none' }}>
          <Plus className="w-4 h-4" /> Tambah
        </Button>
      </div>

      {/* Tabel */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(213,105,137,0.15)' }}>
        <Table>
          <TableHeader style={{ background: 'rgba(243,238,241,0.8)' }}>
            <TableRow style={{ borderColor: 'rgba(213,105,137,0.1)' }}>
              <TableHead className="text-xs font-semibold w-12" style={{ color: '#8A7080' }}>#</TableHead>
              {columns.map(col => (
                <TableHead key={col.header} className={`text-xs font-semibold ${col.className ?? ''}`}
                  style={{ color: '#8A7080' }}>
                  {col.header}
                </TableHead>
              ))}
              <TableHead className="text-xs font-semibold text-right" style={{ color: '#8A7080' }}>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={columns.length + 2}>
                      <Skeleton className="h-8 w-full rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              : data.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 2} className="text-center py-12 text-sm"
                      style={{ color: '#8A7080' }}>
                      Belum ada data. Klik "Tambah" untuk menambahkan.
                    </TableCell>
                  </TableRow>
                )
                : data.map((row, i) => (
                    <TableRow key={row.id}
                      className="transition-colors hover:bg-pink-50/30"
                      style={{ borderColor: 'rgba(213,105,137,0.08)' }}>
                      <TableCell className="text-xs font-mono" style={{ color: '#8A7080' }}>
                        {i + 1}
                      </TableCell>
                      {columns.map(col => (
                        <TableCell key={col.header} className={`text-sm ${col.className ?? ''}`}>
                          {col.cell(row)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button variant="ghost" size="sm" onClick={() => onEdit(row)}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-pink-50"
                            style={{ color: '#D56989' }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm"
                                className="h-8 w-8 p-0 rounded-lg hover:bg-red-50"
                                style={{ color: '#E57373' }}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent style={{ borderColor: 'rgba(213,105,137,0.2)', background: '#FFFFFF', color: '#1A1A1A' }}>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(row.id)}
                                  className="rounded-xl"
                                  style={{ background: '#D56989', color: '#fff', border: 'none' }}>
                                  Ya, Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
        {/* Footer count */}
        {!loading && data.length > 0 && (
          <div className="px-4 py-2 text-xs border-t" style={{ borderColor: 'rgba(213,105,137,0.1)', color: '#8A7080', background: 'rgba(243,238,241,0.4)' }}>
            Total: <span className="font-semibold">{data.length}</span> data
          </div>
        )}
      </div>
    </div>
  )
}
