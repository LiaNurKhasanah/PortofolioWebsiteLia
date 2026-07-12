import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

/* ── R2 Client (S3-compatible) ── */
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.R2_BUCKET_NAME ?? 'lia-bucket'
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ''

/* ── Upload file to R2 ── */
export async function uploadToR2(
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  )
  return `${PUBLIC_URL}/${key}`
}

/* ── Delete file from R2 ── */
export async function deleteFromR2(key: string): Promise<void> {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  )
}

/* ── List files from R2 ── */
export async function listFromR2(prefix = '') {
  const data = await r2.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
    })
  )
  
  return (data.Contents ?? []).map(item => {
    return {
      key: item.Key ?? '',
      size: item.Size ?? 0,
      lastModified: item.LastModified ?? new Date(),
      url: `${PUBLIC_URL}/${item.Key}`,
    }
  })
}

/* ── Helper: generate unique key ── */
export function generateR2Key(folder: string, filename: string): string {
  const timestamp = Date.now()
  const clean = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  return `${folder}/${timestamp}_${clean}`
}

export { r2, BUCKET, PUBLIC_URL }