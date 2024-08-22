import { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { getTheme, updateTheme } from '../operations/Theme';

export type Theme_t = 'light' | 'dark';

export const ThemeContext = createContext<{
    theme: Theme_t;
    toggleTheme: () => void;
}>({
    theme: 'dark', // default value
    toggleTheme: () => {},
});

export const ThemeProvider = ({ children, session }: { children: React.ReactNode, session: Session | null }) => {
    const colorScheme = Appearance.getColorScheme();
    const [theme, setTheme] = useState<Theme_t>(colorScheme === 'dark' ? 'dark' : 'light');

    // Fetch theme from the database
    useEffect(() => {
        if (session) getTheme(session, setTheme);
    }, [session]);

    // Save theme to the database
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        if (session) updateTheme(session, newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
