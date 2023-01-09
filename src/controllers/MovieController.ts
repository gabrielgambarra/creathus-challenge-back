import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import sharp from "sharp";
import crypto from "crypto";
import { getPaginationData } from "../utils/pagination";
import { deleteFile, getObjectSignedUrl, uploadFile } from "../utils/s3";

const prisma = new PrismaClient();

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export const getMovies = async (req: Request, res: Response) => {
  const { code, returnedData } = await getPaginationData(prisma.movie, req);

  if (returnedData.hasOwnProperty("data")) {
    for (let post of returnedData.data) {
      post.image = await getObjectSignedUrl(post.image);
    }
  }

  res.status(code).json(returnedData);
};

export const getMovieById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const movie = await prisma.movie.findUnique({
    where: {
      id,
    },
  });

  res.status(200).json({ movie });
};

export const createMovie = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const file = req.file;
  const image = generateFileName();

  const fileBuffer = await sharp(file?.buffer)
    // .resize({ height: 1920, width: 1080, fit: "contain" })
    .resize({ fit: "contain" })
    .toBuffer();

  await uploadFile(fileBuffer, image, file?.mimetype);

  await prisma.movie.create({
    data: {
      title,
      description,
      image,
    },
  });

  res.status(201).send();
};

export const deleteMovie = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const post = await prisma.movie.findUnique({ where: { id } });

  await deleteFile(post?.image);

  await prisma.movie.delete({
    where: {
      id,
    },
  });

  res.status(202).send();
};
