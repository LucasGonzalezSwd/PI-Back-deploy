const { Router } = require('express')

const {Recipe} = require('../db')

const router = Router();

router.post("/", async (req,res,next) =>{
  
     const {name,image,summary,healthScore,steps,diets} = req.body;

     try {
        await Recipe.create({name,image,summary,healthScore,steps,diets})
          if(diets && diets.length && typeof diets === 'object'){

            const newRecipe = await Recipe.findOne({where:{name}});
            diets.forEach(async el => {
                 await newRecipe.addDiets(el)
            });
           
          }
        res.send("Recipe has been created!")

     } catch (error) {
        
        next(error)

     }



})
router.delete('/:idRecipe', (req, res, next) => {
  try {
      const { idRecipe } = req.params
      Recipe.destroy({ where: {id: idRecipe} })
      res.send( `The ${idRecipe} has been removed`)
  } catch(error) {
      next(error)
  }
})

// router.get("*", (req,res) =>{
     
//   res.status(405).json("the path not exist")

// })

module.exports = router;