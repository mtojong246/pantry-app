import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./user-context";

const addGroceryItem = (groceryItems, itemToAdd) => {
    const existingGroceryItem = groceryItems.find((groceryItem) => groceryItem.name === itemToAdd);

    if(!existingGroceryItem) {
        let newGroceryItems = groceryItems.concat([{name: itemToAdd, quantity: 1}]);
        return newGroceryItems;
    } else {
        return groceryItems;
    }
}

const removeGroceryItem = (groceryItems, itemToRemove) => {
    if(groceryItems.length > 1) {
        return groceryItems.filter(item => item.name !== itemToRemove)
    }
    else {
        return [];
    }
}

export const GroceryContext = createContext({
    groceryItems: [],
    setGroceryItems: () => {},
    isListActive: false,
    addItemToGroceries: () => {},
    removeItemFromGroceries: () => {},
    clearItemsFromGroceries: () => {},
    activeList: [],
    setActiveList: () => {},
})

export const GroceryProvider = ({children}) => {
    const [groceryItems, setGroceryItems] = useState([]);
    const [isListActive, setIsListActive] = useState(false);
    const [ activeList, setActiveList ] = useState([]);
    const { user, isLoading } = useContext(UserContext);

    useEffect(() => {
        isLoading ? setGroceryItems([]) : setGroceryItems(user.groceryitems);
    }, [isLoading, user])

    useEffect(() => {
        isLoading ? setActiveList([]) : setActiveList(user.activelist);
    }, [isLoading, user])

    useEffect(() => {
        if (groceryItems === undefined) {
            console.log(groceryItems)
        } else if (groceryItems.length !== 0) {
            setIsListActive(true)
        } else {
            setIsListActive(false)
        }
    }, [groceryItems])

    const addItemToGroceries = async (itemToAdd) => {
        const addedItem = addGroceryItem(groceryItems, itemToAdd);
        const response = await fetch('https://still-hollows-61456.herokuapp.com/grocery-list', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                groceryItems: addedItem,
            })
        })
        const data = await response.json();
        setGroceryItems(data);
    }

    const removeItemFromGroceries = async (itemToRemove) => {
        const removedItem = removeGroceryItem(groceryItems, itemToRemove);
        const response = await fetch('https://still-hollows-61456.herokuapp.com/grocery-list', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                groceryItems: removedItem,
            })
        })
        const data = await response.json();
        setGroceryItems(data);

        const list = activeList.filter(activeItem => activeItem !== itemToRemove);

        const listResponse = await fetch('https://still-hollows-61456.herokuapp.com/active-list', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                activeList: list,
            })
        })
        const listData = await listResponse.json();
        setActiveList(listData);
    }

    const clearItemsFromGroceries = async () => {
        const response = await fetch('https://still-hollows-61456.herokuapp.com/grocery-list', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                groceryItems: [],
            })
        })
        const data = await response.json();
        setGroceryItems(data);

        const listResponse = await fetch('https://still-hollows-61456.herokuapp.com/active-list', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                activeList: [],
            })
        })
        const listData = await listResponse.json();
        setActiveList(listData);
    }

    const value = {groceryItems, setGroceryItems, isListActive, addItemToGroceries, removeItemFromGroceries, clearItemsFromGroceries, activeList, setActiveList }

    return (
        <GroceryContext.Provider value={value}>{children}</GroceryContext.Provider>
    )
}