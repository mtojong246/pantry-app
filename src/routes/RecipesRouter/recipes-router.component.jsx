import { Routes, Route } from "react-router";
import Recipes from "../Recipes/recipes.component";
import RecipePage from "../RecipePage/recipe-page.component";

const RecipesRouter = () => {
    return (
        <Routes>
            <Route index element={<Recipes />} />
            <Route path=':recipe' element={<RecipePage />} />
        </Routes>
    )
}

export default RecipesRouter;