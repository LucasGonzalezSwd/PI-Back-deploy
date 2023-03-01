
const { Router } = require('express');
const {Diet} = require('../db')

const router = Router();



router.get("/", async (req,res,next)=>{
    
    try { 
        
        const allDiets = await Diet.findAll()
        
        if(!allDiets.length){
            const newDiets = [
               "Gluten Free",
                "Ketogenic",
                "Vegetarian",
                "Lacto-Vegetarian",
                "Ovo-Vegetarian",
                "Vegan",
                "Pescetarian",
                "Paleo",
                "Primal",
                "Low Foodmap",
                "Whole 30"
            ]
            const dietsP = newDiets.map(diet=>{
                return Diet.create({name : diet})
            })
            await Promise.all(dietsP)
            const allDietsDb = await Diet.findAll()
            return res.json(allDietsDb)
        } 
            res.json(allDiets)
            
        } catch (error) {
            next(error)
        }
        
        
    })
    
    router.get("*", (req,res) =>{
     
        res.status(405).json("the path not exist")
     
     })
    
    
    module.exports = router;


//     const getnameRecipes = async()=> {
             
//         const re =  await axios(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`);
        
//         const nameRecipesAp = re.data.results.diets.map( dt =>{
              
//               return {
//                  nameDiets: dt
//               }
    
//         })
//          return nameRecipesAp
//     }
//     router.get("/", async (req,res,next)=>{ 
//         try { 
//             const {namediet}= req.query // Gluten Free 
//            if(namediet){                  ///nombres
//               const titleRecipes = await getnameRecipes.filter(el => el.namediet.toLowerCase().includes(namediet.toLowerCase()))
//              if(titleRecipes.length) return res.json(titleRecipes)          
//              else return res.send(`No se ha encontrado ninguna receta que sea de tipo: ${namediet}`)
//             }
//     } catch (error) {
//         next(error)
//     }
// })

