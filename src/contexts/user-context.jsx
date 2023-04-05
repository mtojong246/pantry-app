import { createContext, useState, useEffect } from "react";

const defaultUser = {
    id: '',
    email: '',
    password: '',
    activelist: [],
    favorites: [],
    foodlog: [],
    groceryitems: [],
    logvalues: {},
    setvalues: {},
    pantryitems: [],
    prevquantities: [],
    recipelist: [],
}

export const UserContext = createContext({
    user: {},
    setUser: () => {},
})

export const UserProvider = ({children}) => {
    const [ user, setUser ] = useState(defaultUser);
    const [ isLoading, setIsLoading ] = useState(true);

    console.log(user);

    useEffect(() => {
        const loadUser = async () => {
            const email = JSON.parse(localStorage.getItem('user'));

            if (email !== null) {
                const response = await fetch('https://still-hollows-61456.herokuapp.com/load-user', {
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        email: email,
                    })
                })
                const existingUser = await response.json();
                if (typeof existingUser === 'object') {
                    setUser(existingUser)
                    setIsLoading(false);
                }
            } else {
                setUser(defaultUser);
                setIsLoading(false);
            }
        }
        loadUser();
    }, [])

    const value = {user, setUser, isLoading};

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    )
}