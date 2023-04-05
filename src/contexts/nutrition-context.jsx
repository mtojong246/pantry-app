import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./user-context";

const defaultValues = [{
    'Total Calories': 0,
    'Protein': 0,
    'Carbohydrates': 0,
    'Fat': 0,
}]


const defaultLog = [
    {
        id: 1,
        category: 'Breakfast',
        items: [],
    },
    {
        id: 2,
        category: 'Lunch',
        items: [],
    },
    {
        id: 3,
        category: 'Dinner',
        items: [],
    },
    {
        id: 4,
        category: 'Snacks',
        items: [],
    },
]

const getNutritionInfo = async (item) => {
    const response = await fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=a2f5c533&app_key=aea75c33426935311aa46ffbf39282a7&ingr=${item}&nutrition-type=cooking`)
    const data = response.json();
    return data;
}

const addToLog = async (foodLog, category, item) => {
    const parsedItem = JSON.parse(item);
    const prevObj = foodLog.find(foodCategories => foodCategories.category === category);
    const existingItem = prevObj.items.find(item => item.name === parsedItem);
    if (!existingItem) {
        const nutritionData = await getNutritionInfo(item);
        const newItems = prevObj.items.concat({name: parsedItem, category: category, quantity: 1, calories: Math.floor(nutritionData.parsed[0].food.nutrients['ENERC_KCAL']), protein: Math.floor(nutritionData.parsed[0].food.nutrients['PROCNT']), carbs: Math.floor(nutritionData.parsed[0].food.nutrients['CHOCDF']), fat: Math.floor(nutritionData.parsed[0].food.nutrients['FAT'])});
        return newItems;
    } else {
        return prevObj.items;
    }
}

const removeFromLog = (foodLog, category, item) => {
    const prevObj = foodLog.find(foodCategories => foodCategories.category === category);
    if (prevObj.items.length > 1) {
        let newArray = prevObj.items.filter(existingItem => existingItem.name !== item);
        return newArray;
    } else {
        return [];
    }
}

export const NutritionContext = createContext({
    nutritionValues: {},
    logValues: {},
    setLogValues: () => {},
    setNutritionValues: () => {},
    resetValues: () => {},
    foodCategory: '',
    setFoodCategory: () => {},
    foodLog: [],
    setFoodLog: () => {},
    addItemToLog: () => {},
    removeItemFromLog: () => {},
    prevQuantities: [],
    setPrevQuantities: () => {},
    servings: 1,
    setServings: () => {},
    isFoodLogLoading: true,
    isNutritionLoading: true,
    isLogValueLoading: true,
    isQuantityLoading: true,
})

export const NutritionProvider = ({children}) => {
    const [ nutritionValues, setNutritionValues ] = useState(defaultValues);
    const [ foodCategory, setFoodCategory ] = useState('');
    const [ foodLog, setFoodLog ] = useState(defaultLog);
    const [ logValues, setLogValues ] = useState(defaultValues);
    const [ prevQuantities, setPrevQuantities ] = useState([])
    const [ servings, setServings ] = useState(1);
    const { user, isLoading } = useContext(UserContext);
    

    useEffect(() => {
        isLoading ? setFoodLog(defaultLog) : setFoodLog(user.foodlog);
    }, [isLoading, user])

    useEffect(() => {
        isLoading ? setNutritionValues(defaultValues) : setNutritionValues(user.nutritionvalues);
    }, [isLoading, user])

    useEffect(() => {
        isLoading ? setLogValues(defaultValues) : setLogValues(user.logvalues);
    }, [isLoading, user])

    useEffect(() => {
        isLoading ? setPrevQuantities([]) : setPrevQuantities(user.prevquantities);
    }, [isLoading, user])

    const resetValues = async () => {
        const response = await fetch('https://still-hollows-61456.herokuapp.com/nutrition-values', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                nutritionValues: defaultValues,
            })
        })
        const data = await response.json();
        setNutritionValues(data);
    }

    const addItemToLog = async (category, itemToAdd) => {
        const newArray = await addToLog(foodLog, category, itemToAdd);
        const newLog = foodLog.map(foodCategory => foodCategory.category === category ? {...foodCategory, items: newArray} : foodCategory);
        const response = await fetch('https://still-hollows-61456.herokuapp.com/food-log', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                foodLog: newLog,
            })
        })
        const data = await response.json();
        setFoodLog(data);
    }

    const removeItemFromLog = async (category, item) => {
        const newArray = removeFromLog(foodLog, category, item);
        const newLog = foodLog.map(foodCategory => foodCategory.category === category ? {...foodCategory, items: newArray} : foodCategory);
        const response = await fetch('https://still-hollows-61456.herokuapp.com/food-log', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                foodLog: newLog,
            })
        })
        const data = await response.json();
        setFoodLog(data);
    }

    const value = { nutritionValues, setNutritionValues, resetValues, foodCategory, setFoodCategory, foodLog, setFoodLog, logValues, setLogValues, removeItemFromLog, addItemToLog, prevQuantities, setPrevQuantities, servings, setServings};

    return (
        <NutritionContext.Provider value={value}>{children}</NutritionContext.Provider>
    )
}