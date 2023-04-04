import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./user-context";


export const RecipeContext = createContext({
    recipeList: [],
    setRecipeList: () => {},
    pantryRecipes: [],
    setPantryRecipes: () => {},
    isRecipeListActive: false,
    favorites: [],
    setFavorites: () => {},
    isRecipeLoading: true,
    filteredRecipes: [],
    setFilteredRecipes: () => {},
    recipe: [],
    setRecipe: () => {},
})


export const RecipeProvider = ({children}) => {
    const [recipeList, setRecipeList] = useState([]);
    const [ pantryRecipes, setPantryRecipes ] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [ isRecipeListActive, setIsRecipeListActive ] = useState(false);
    const [ favorites, setFavorites ] = useState([]);
    const [ recipe, setRecipe ] = useState([]);
    const { user, isLoading } = useContext(UserContext);

    useEffect(() => {
        isLoading ? setPantryRecipes([]) : setPantryRecipes(user.pantryrecipes);
    }, [isLoading, user])

    useEffect(() => {
        isLoading ? setFavorites([]) : setFavorites(user.favorites);
    }, [isLoading, user])

    useEffect(() => {
        if (pantryRecipes.length !== 0) {
            setIsRecipeListActive(true)
        } else {
            setIsRecipeListActive(false)
        }
    }, [pantryRecipes])

    useEffect(() => {
        setFilteredRecipes(pantryRecipes)
    }, [pantryRecipes])


    const value = {recipeList, setRecipeList, pantryRecipes, setPantryRecipes, isRecipeListActive, favorites, setFavorites, filteredRecipes, setFilteredRecipes, recipe, setRecipe};

    return (
        <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
    )
}