import * as SecureStore from 'expo-secure-store'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useColorScheme } from 'nativewind'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { colorScheme, setColorScheme } = useColorScheme()
    const [theme, setThemeState] = useState<Theme>(colorScheme === 'dark' ? 'dark' : 'light')

    useEffect(() => {
        SecureStore.getItemAsync('app-theme').then((savedTheme) => {
            if (savedTheme === 'dark' || savedTheme === 'light') {
                setThemeState(savedTheme)
                setColorScheme(savedTheme)
            }
        })
    }, [setColorScheme])

    const setTheme = (nextTheme: Theme) => {
        setThemeState(nextTheme)
        setColorScheme(nextTheme)
        SecureStore.setItemAsync('app-theme', nextTheme)
    }

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used inside ThemeProvider')
    return context
}
