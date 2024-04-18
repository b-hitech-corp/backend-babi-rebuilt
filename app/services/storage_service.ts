import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3'
import { promises as fsPromises } from 'node:fs'
import mime from 'mime'

export class S3StorageService {
  private s3Client = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  })

  async uploadFile(fileKey: string, filePath: string): Promise<string> {
    const fileContent = await fsPromises.readFile(filePath)
    const contentType = mime.getType(filePath) || 'image/jpeg'
    const params = {
      Bucket: process.env.S3_BUCKET!,
      Key: fileKey,
      Body: fileContent,
      ACL: ObjectCannedACL.public_read,
      ContentType: contentType,
    }

    const command = new PutObjectCommand(params)
    try {
      await this.s3Client.send(command)
      const url = `https://${params.Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${params.Key}`
      return url
    } catch (error) {
      throw new Error("Erreur lors de l'upload : " + error.message)
    }
  }
}
