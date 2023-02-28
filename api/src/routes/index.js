const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const recipePost = require("./recipePost")
const recipes = require("./recipes")
const dietType = require("./dietType")


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/diets", dietType)
router.use("/recipe", recipePost)
router.use("/recipes", recipes)

module.exports = router;
