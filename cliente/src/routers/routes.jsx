import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Inicio} from "../pages/Inicio"
import {Inventario} from "../pages/Inventario"
import {Aprobaciones} from "../pages/Aprobaciones"
import {Planificacion} from "../pages/Planificacion"
import {Informes} from "../pages/Informes"
import {Sidebar} from "../components/Sidebar"

export function MyRoutes(){
    return (
    <Routes>
        <Route path="/" element={<Inicio/>} />
        <Route path="/inventario" element={<Inventario/>} />
        <Route path="/aprobaciones" element={<Aprobaciones/>} />
        <Route path="/planificacion" element={<Planificacion/>} />
        <Route path="/informes" element={<Informes/>} />
    </Routes>
    );
}
