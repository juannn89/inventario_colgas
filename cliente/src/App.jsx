import React, { useState } from 'react'
import {MyRoutes} from "./routers/routes"
import styled from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import {Light, Dark} from "./styles/Themes"
import {ThemeProvider} from "styled-components"

export const ThemeContext = React.createContext(null);

function App() {
  const [theme, setTheme] = useState("light")
  const themeStyle=theme==="light"?Light:Dark;
  

const [sidebarOpen, setSidebarOpen]=useState(true);

  return (
    <>
    <ThemeContext.Provider value={{setTheme, theme}}>
      <ThemeProvider theme={themeStyle}>
        <BrowserRouter>
          <Container className={sidebarOpen?"sidebarState active":""}>
              <section className='sidebar'>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
              </section>
              <section>
                <MyRoutes/>
              </section>
          </Container>
        </BrowserRouter>
      </ThemeProvider>   
    </ThemeContext.Provider>
    </>
  );
}

const Container = styled.div`
  display:grid;
  grid-template-columns: 70px auto;
  min-height: 100vh;
   width: 100%;
  background:${({theme})=>theme.bgtotal};
  background-size: cover;
  transition:all 0.4s;
  &.active{
    grid-template-columns:220px auto;
    background:${({theme})=>theme.bgtotal};
  }
  color:${({theme})=>theme.text};
`;

export default App;
