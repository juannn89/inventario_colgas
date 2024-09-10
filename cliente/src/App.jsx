import React, { useState, useEffect } from 'react';
import { MyRoutes } from "./routers/routes";
import styled from 'styled-components';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Light, Dark } from "./styles/Themes";
import { ThemeProvider } from "styled-components";

export const ThemeContext = React.createContext(null);

function App() {
    const [theme, setTheme] = useState("light");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const themeStyle = theme === "light" ? Light : Dark;

    useEffect(() => {
        // Verifica el token en el localStorage para determinar la autenticación
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            console.log('Usuario autenticado');
        } else {
            setIsAuthenticated(false);
            console.log('Usuario no autenticado');
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ setTheme, theme }}>
            <ThemeProvider theme={themeStyle}>
                <BrowserRouter>
                    <AppContent isAuthenticated={isAuthenticated} />
                </BrowserRouter>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

function AppContent({ isAuthenticated }) {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Ocultar el Sidebar en las rutas '/', '/login' y '/register'
    const showSidebar = !(location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register");

    return (
        <Container>
            {showSidebar && (
                <section className='sidebar'>
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                </section>
            )}
            <MainContent sidebarOpen={showSidebar}>
                <MyRoutes isAuthenticated={isAuthenticated} />
            </MainContent>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    width: 100%;
    background: ${({ theme }) => theme.bgtotal};
    background-size: cover;
    transition: all 0.4s;
    color: ${({ theme }) => theme.text};
`;

const MainContent = styled.section`
    flex-grow: 1;
    padding: ${({ sidebarOpen }) => (sidebarOpen ? '0 20px' : '0')};
`;

export default App;
