import { Request, Response } from "express";
import multer from "multer";
const moviesController = require("../controllers/MovieController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const movieRoutes = (app: any) => {
  app.get("/movies", (req: Request, res: Response) => {
    moviesController.getMovies(req, res);
  });

  app.get("/movies/:id", (req: Request, res: Response) => {
    moviesController.getMovieById(req, res);
  });

  app.post("/movies", upload.single("image"), (req: Request, res: Response) => {
    moviesController.createMovie(req, res);
  });

  app.delete("/movies/:id", (req: Request, res: Response) => {
    moviesController.deleteMovie(req, res);
  });
};

module.exports = movieRoutes;
