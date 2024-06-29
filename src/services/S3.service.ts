import fs from "fs";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { FileEntity } from "@entity";

interface UploadParams {
  file: Express.Multer.File;
  relation_id: number;
  relation_type: string;
  field: string;
  folder?: string;
}

interface UploadBufferParams {
  buffer: Buffer;
  filename: string;
  relation_id: number;
  relation_type: string;
  field: string;
  folder?: string;
}

class S3Service {
  private readonly s3Client: S3Client;

  constructor(s3Client: S3Client) {
    this.s3Client = s3Client;
  }

  public async uploadFile(params: UploadParams): Promise<FileEntity> {
    const { file, relation_id, relation_type, field, folder } = params;
    try {
      const { originalname, size, mimetype, path } = file;

      const uniqueIdentifier = Date.now();
      const key = folder
        ? `${folder}/${uniqueIdentifier}_${originalname}`
        : `${uniqueIdentifier}_${originalname}`;

      const uploadParams = {
        Bucket: process.env.DO_SPACES_NAME!,
        Key: key,
        Body: fs.createReadStream(path),
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));

      const newFile = await FileEntity.create({
        name: originalname,
        mimetype: mimetype,
        size: size,
        key: key,
        relation_id: relation_id,
        relation_type: relation_type,
        field: field,
      }).save();

      return newFile;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file");
    }
  }

  public async uploadSignatureBuffer(
    params: UploadBufferParams
  ): Promise<FileEntity> {
    const { buffer, filename, relation_id, relation_type, field, folder } =
      params;
    try {
      const uniqueIdentifier = Date.now();
      const key = folder
        ? `${folder}/${filename}_${uniqueIdentifier}.png`
        : `${filename}_${uniqueIdentifier}.png`;

      const uploadParams = {
        Bucket: process.env.DO_SPACES_NAME!,
        Key: key,
        Body: buffer,
        ContentEncoding: "base64",
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));

      const size = buffer.length;
      const newFile = await FileEntity.create({
        name: filename,
        mimetype: "image/png",
        size: size,
        key: key,
        relation_id: relation_id,
        relation_type: relation_type,
        field: field,
      }).save();

      return newFile;
    } catch (error) {
      console.error("Error uploading signature buffer:", error);
      throw new Error("Failed to upload signature buffer");
    }
  }

  public async deleteFile(key: string): Promise<void> {
    try {
      const params = {
        Bucket: process.env.DO_SPACES_NAME!,
        Key: key,
      };

      await this.s3Client.send(new DeleteObjectCommand(params));
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file");
    }
  }

  public async getFileUrl(
    key: string
  ): Promise<{ buffer: Buffer; mimetype: string; name: string } | null> {
    try {
      const file = await FileEntity.findOne({ where: { key } });
      if (!file) {
        return null;
      }

      const getObjectParams = {
        Bucket: process.env.DO_SPACES_NAME!,
        Key: file.key,
      };

      const { Body } = await this.s3Client.send(
        new GetObjectCommand(getObjectParams)
      );

      if (!Body) {
        throw new Error("Empty response body");
      }

      const byteArray = await Body.transformToByteArray();

      return {
        buffer: Buffer.from(byteArray),
        mimetype: file.mimetype,
        name: file.name,
      };
    } catch (error) {
      console.error("Error getting file URL:", error);
      throw new Error("Failed to get file URL");
    }
  }
}

export default S3Service;
