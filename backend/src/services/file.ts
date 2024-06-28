import fs from "fs";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { FileEntity } from "@entity";

const s3client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION,
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID,
    secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY,
  },
});

const uploadFile = async ({
  file,
  relation_id,
  relation_type,
  field,
  folder,
}: {
  file: Express.Multer.File;
  relation_id: number;
  relation_type: string;
  field: string;
  folder?: string;
}) => {
  try {
    const { originalname, size, mimetype, path } = file;

    const uniqueIdentifier = Date.now();

    const key = folder
      ? `${folder}/${uniqueIdentifier}_${originalname}`
      : `${uniqueIdentifier}_${originalname}`;

    const params = {
      Bucket: process.env.DO_SPACES_NAME,
      Key: key,
      Body: fs.createReadStream(path),
    };

    // upload file to the bucket
    await s3client.send(new PutObjectCommand(params));
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
    throw new Error(error);
  }
};

const uploadSignatureBuffer = async ({
  buffer,
  filename,
  relation_id,
  relation_type,
  field,
  folder,
}: {
  buffer: Buffer;
  filename: string;
  relation_id: number;
  relation_type: string;
  field: string;
  folder?: string;
}) => {
  try {
    const uniqueIdentifier = Date.now();

    const key = folder
      ? `${folder}/${filename}_${uniqueIdentifier}.png`
      : `${filename}_${uniqueIdentifier}.png`;

    const params = {
      Bucket: process.env.DO_SPACES_NAME,
      Key: key,
      Body: buffer,
      ContentEncoding: "base64",
    };

    const size = buffer.length;

    // upload file to the bucket
    await s3client.send(new PutObjectCommand(params));

    const file = await FileEntity.create({
      name: filename,
      mimetype: "image/png",
      size: size,
      key: key,
      relation_id: relation_id,
      relation_type: relation_type,
      field: field,
    }).save();
    return file;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const deleteFile = async (key: string) => {
  try {
    const params = {
      Bucket: process.env.DO_SPACES_NAME,
      Key: key,
    };

    await s3client.send(new DeleteObjectCommand(params));

    return;
  } catch (error) {
    throw new Error(error);
  }
};

const getFileUrl = async (key: string) => {
  try {
    const file = await FileEntity.findOne({
      where: {
        key,
      },
    });
    if (!file) {
      return null;
    }
    const { key: file_key, mimetype, name } = file;
    const getObjectParams = {
      Bucket: process.env.DO_SPACES_NAME,
      Key: file_key,
    };

    const { Body } = await s3client.send(new GetObjectCommand(getObjectParams));
    const byteArray = await Body.transformToByteArray();

    const buffer = Buffer.from(byteArray);
    return {
      buffer,
      mimetype,
      name,
    };
  } catch (error) {
    return null;
  }
};

export default {
  uploadFile,
  uploadSignatureBuffer,
  deleteFile,
  getFileUrl,
};
