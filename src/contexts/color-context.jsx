import { createContext, useState } from "react";


export const ColorContext = createContext({
    dark: '',
    toggleDarkMode: () => {},
})


export const ColorProvider = ({children}) => {
    const [ theme, setTheme ] = useState(false);
    const [ dark, setDark ] = useState('');

    const toggleDarkMode = () => setTheme(!theme)

    const value = {dark, toggleDarkMode};

    return (
        <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
    )
}