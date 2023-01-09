const movieRoutes = require("./MovieRoutes");

const routes = (app: any) => {
  movieRoutes(app);
};

module.exports = routes;
