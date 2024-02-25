import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { promises as fsPromises } from 'node:fs'

export class S3StorageService {
  private s3Client = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  })

  async uploadFile(fileKey: string, filePath: string): Promise<string | null> {
    const fileContent = await fsPromises.readFile(filePath)
    const params = {
      Bucket: process.env.S3_BUCKET!,
      Key: fileKey,
      Body: fileContent,
    }

    const command = new PutObjectCommand(params)
    try {
      await this.s3Client.send(command)
      const url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`
      return url
    } catch (error) {
      console.error("Erreur lors de l'upload:", error.message)
      return null
    }
  }
}
