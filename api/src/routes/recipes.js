const axios = require('axios');
const {Router} = require('express');
const {Recipe, Diet} = require("../db");
const {API_KEY} = process.env;


const router = Router();

const getAllRecipes = async()=> {
         
       const re =  await axios('https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5');
       
       const recipesAp = re.data.results.map( recipes =>{
       
             return {
                id: recipes.id,
                name: recipes.title,
                image: recipes.image,
                healthScore: recipes.healthScore,
                diets: recipes.diets 
                
             }
             

       })
        return recipesAp
}


const getAllRecipesDb = async()=>{
      try{
      const searchdb = await Recipe.findAll({
          include:{
              model: Diet,
              atributes: ['id','name'],
              through: {
                  atributes: [],
              }
          }
      })
      // var dato = JSON.parse(JSON.stringify(dbInfo, null, 2));
      // dato.forEach((el) => (el.diets = el.diets.map((el) => el.name)));
  
      // return dato;
      
      let infodb = await searchdb?.map((recipes) => {
      return{
         id: recipes.id,
         name: recipes.name,
         image: recipes.image,
         healthScore: recipes.healthScore,
         diets: recipes.diets 

      }
     }) 
    
  return infodb
  }
  catch(err){
  return err
  }
  }
      

     
   
      


const getAllRecipesApiDb = async ()=>{

    const recipesApi = await getAllRecipes() 
    const recipesDb = await getAllRecipesDb()
    const allRecipesAD = await recipesDb.concat(recipesApi) 

    return allRecipesAD;
}


router.get("/", async(req,res,next) =>{
    const {name} = req.query;
    
    try { 
       const allRecipes = await getAllRecipesApiDb()
       if(name){
          const recipes =  allRecipes.filter(re => re.name.toLowerCase().includes(name.toLowerCase()))
          if(recipes.length) return res.json(recipes)
          else return res.send(`The recipe with the title ${name} was not found`)

       }  
       res.json(allRecipes)      
        
    } catch (error) {
        
        next(error)
        
    }


}) 

router.get("/:idRecipe", async(req,res,next) =>{
     
   const id = req.params.idRecipe;
 
   try {  //id.length < 10
        if(id && id.length < 10){ 
             const re = await axios(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
            
            
             if(re){

               const recipe = {
                  id: re.data.id,
                  name: re.data.title,
                  image: re.data.image,
                  summary: re.data.summary,
                  healthScore: re.data.healthScore,
                  steps: re.data.analyzedInstructions[0] && re.data.analyzedInstructions[0].steps.map(st=> st.step),
                  diets: re.data.diets
               }
               return res.json(recipe)
              }    
         }
             let reDb = await Recipe.findByPk(id)
             if(reDb){
                  let dietsDb =await reDb.getDiets()
                  
                  let diets  = dietsDb.map(d => d.dataValues.name)
                  
                  return res.json({...reDb.dataValues, diets})
             }
             

   } catch (error) {
       next(error)
   }

      
})
  

// router.get("/", (req,res) =>{
     
//    res.status(405).json("the path not exist")

// })

module.exports = router;


