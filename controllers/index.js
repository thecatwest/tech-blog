// collect packaged group of API endpoints and prefix them with /api path

const router = require("express").Router();

const apiRoutes = require("./api/");
const homeRoutes = require("./user-routes.js");

router.use("/api", apiRoutes);
router.use("/", homeRoutes);
// router.use('/dashboard', dashboardRoutes);

// second use of router.use() to handle any endpoint requests that don't exist
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
