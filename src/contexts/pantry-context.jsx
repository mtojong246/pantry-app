import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./user-context";

const addPantryItem = (pantryItems, itemToAdd) => {
    const existingPantryItem = pantryItems.find((pantryItem) => pantryItem === itemToAdd);

    if(!existingPantryItem) {
        let newPantryItems = pantryItems.concat([itemToAdd]);
        return newPantryItems;
    } else {
        return pantryItems;
    }
}

const removePantryItem = (pantryItems, itemToRemove) => {
    if(pantryItems.length > 1) {
        return pantryItems.filter(item => item !== itemToRemove)
    }
    else {
        return [];
    }
}

export const PantryContext = createContext({
    pantryItems: [],
    isPantryActive: false,
    addItemToPantry: () => {},
    removeItemFromPantry: () => {},
    clearItemsFromPantry: () => {},
    isPantryLoading: true,
})

export const PantryProvider = ({children}) => {
    const [pantryItems, setPantryItems] = useState([]);
    const [isPantryActive, setIsPantryActive] = useState(false);
    const { user, isLoading } = useContext(UserContext);

    
    useEffect(() => {
        isLoading ? setPantryItems([]) : setPantryItems(user.pantryitems);
    }, [isLoading, user])


    useEffect(() => {
        if (pantryItems === undefined) {
            console.log(pantryItems)
        } else if (pantryItems.length !== 0) {
            setIsPantryActive(true)
        } else {
            setIsPantryActive(false)
        }
    }, [pantryItems])

    const addItemToPantry = async (itemToAdd) => {
        const addedItem = addPantryItem(pantryItems, itemToAdd);
        const response = await fetch('https://still-hollows-61456.herokuapp.com/pantry-items', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                pantryItems: addedItem
            })
        })
        const data = await response.json();
        setPantryItems(data);
        
    }

    const removeItemFromPantry = async (itemToRemove) => {
        const removedItem = removePantryItem(pantryItems, itemToRemove);
        const response = await fetch('https://still-hollows-61456.herokuapp.com/pantry-items', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                pantryItems: removedItem
            })
        })
        const data = await response.json();
        setPantryItems(data);
    }

    const clearItemsFromPantry = async () => {
        const response = await fetch('https://still-hollows-61456.herokuapp.com/pantry-items', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                pantryItems: []
            })
        })
        const data = await response.json();
        setPantryItems(data);
    }

    const value = {pantryItems, isPantryActive, addItemToPantry, removeItemFromPantry, clearItemsFromPantry}

    return (
        <PantryContext.Provider value={value}>{children}</PantryContext.Provider>
    )
}