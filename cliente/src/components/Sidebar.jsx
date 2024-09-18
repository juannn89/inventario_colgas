import styled from 'styled-components';
import logocolgas from '../assets/colgas.png';
import { v } from "../styles/Variables";
import { AiOutlineDoubleLeft, AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { MdPermDeviceInformation, MdOutlineCheckBox, MdCalendarMonth, MdOutlineInventory, MdLogout } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../App';

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const ModSidebarOpen = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const { setTheme, theme } = useContext(ThemeContext);
    const CambiarTheme = () => {
        setTheme((theme) => (theme === "light" ? "dark" : "light"));
    };

    const navigate = useNavigate(); // Hook para navegación

    // Función de logout
    const handleLogout = (e) => {
        e.preventDefault(); // Evitar comportamiento por defecto del enlace
        console.log("Cerrando sesión..."); // Log para verificar que la función es llamada
        localStorage.removeItem("token");
        localStorage.removeItem("userRole"); // Asegúrate de eliminar también el rol
        console.log("Token y rol eliminados");
        navigate("/login"); // Redirige al usuario a la página de login
    };

    // Obtener el rol del usuario desde el localStorage
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []); // Se ejecuta solo una vez para obtener el rol cuando se carga el componente

    // Definir los enlaces según el rol
    const linksArray = [
        {
            label: "Inicio",
            icon: <AiOutlineHome />,
            to: "/inicio",
            roles: ['administrador', 'usuario'], // Ambos roles pueden ver este enlace
        },
        {
            label: "Inventario",
            icon: <MdOutlineInventory />,
            to: "/inventario",
            roles: ['administrador', 'usuario'], // Ambos roles pueden ver este enlace
        },
        {
            label: "Usuarios",
            icon: <MdCalendarMonth />,
            to: "/usuarios",
            roles: ['administrador'], // Solo el rol de administrador puede ver este enlace
        },
        {
            label: "Ingresos",
            icon: <MdPermDeviceInformation />,
            to: "/ingresos",
            roles: ['administrador'], // Solo el rol de administrador puede ver este enlace
        },
        {
            label: "Aprobaciones",
            icon: <MdOutlineCheckBox />,
            to: "/aprobaciones",
            roles: ['administrador'], // Solo el rol de administrador puede ver este enlace
        },
        {
            label: "Informes",
            icon: <MdPermDeviceInformation />,
            to: "/informes",
            roles: ['administrador'], // Solo el rol de administrador puede ver este enlace
        },
    ];

    // Filtrar enlaces según el rol del usuario
    const filteredLinks = linksArray.filter(link => {
        // Si no hay rol definido, no mostrar enlaces
        if (!userRole) return false;
        // Si el rol del usuario está en la lista de roles permitidos, mostrar el enlace
        return link.roles.includes(userRole);
    });

    const secondarylinksArray = [
        {
            label: "Configuración",
            icon: <AiOutlineSetting />,
            to: "/configuracion",
        },
        {
            label: "Salir",
            icon: <MdLogout />,
            to: "#", // No necesita ruta específica, se maneja con handleLogout
        },
    ];

    return (
        <Container isOpen={sidebarOpen} themeUse={theme}>
            <button className='Sidebarbutton' onClick={ModSidebarOpen}>
                <AiOutlineDoubleLeft />
            </button>
            <div className='logocontent'>
                <div className='imgcontent'>
                    <img src={logocolgas} width={40} />
                </div>
                <h2>colgas</h2>
            </div>
            {/* Mostrar solo si hay enlaces filtrados */}
            {filteredLinks.length > 0 ? (
                filteredLinks.map(({ icon, label, to }) => (
                    <div className='HoverContainer' key={label}>
                        <div className='LinkContainer'>
                            <NavLink to={to} className={({ isActive }) => `Links${isActive ? ` active` : ``}`}>
                                <div className='Linkicon'>
                                    {icon}
                                </div>
                                {sidebarOpen && <span className='TextContainer'>{label}</span>}
                            </NavLink>
                        </div>
                    </div>
                ))
            ) : (
                <p>No tienes acceso a estas rutas.</p>
            )}
            <Divider />
            {secondarylinksArray.map(({ icon, label }) => (
                <div className='HoverContainer' key={label}>
                    <div className='LinkContainer'>
                        {/* Cambiamos el comportamiento de "Salir" para que no redirija */}
                        <NavLink
                            to="#"
                            className="Links"
                            onClick={label === "Salir" ? handleLogout : null} // Llama a handleLogout solo en "Salir"
                        >
                            <div className='Linkicon'>
                                {icon}
                            </div>
                            {sidebarOpen && <span className='TextContainer'>{label}</span>}
                        </NavLink>
                    </div>
                </div>
            ))}
            <Divider />
            <div className='Themecontent'>
                {sidebarOpen && <span className='titleTheme'> Modo oscuro </span>}
                <div className='Togglecontent'>
                    <div className='grid theme-container'>
                        <div className='content'>
                            <div className='demo'>
                                <label className='switch'>
                                    <input type='checkbox' className='theme-switcher' onClick={CambiarTheme}></input>
                                    <span className='slider round' />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

//#region STYLED COMPONENTS
const Container = styled.div`
    color:${(props) => props.theme.bg2};
    background:${(props) => props.theme.bg};
    position: sticky;
    padding-top: 20px;
    min-height: 100vh;
    .Sidebarbutton{
        position: absolute;
        top: 70px;
        right:-16px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background:${(props) => props.theme.bgtgderecha};
        color:${(props) => props.theme.text};
        box-shadow: 0 0 4px ${(props) => props.theme.bg3}, 0 0 7px ${(props) => props.theme.bg};
        display:flex;
        justify-content:center;
        align-items:center;
        cursor: pointer;
        transition: all 0.3s;
        transform: ${({ isOpen }) => (isOpen ? `initial` : `rotate(180deg)`)};
        border: none;
        letter-spacing: inherit;
        font-size: inherit;
        text-align: inherit;
        padding: 0;
        font-family: inherit;
        outline: none;
    }
    .logocontent{
        display:flex;
        justify-content:center;
        align-items:center;
        padding-bottom:8%;
        .imgcontent{
            display:flex;
            img{
                max-width: 100%;
                height: auto;
            }
            cursor:pointer;
            transition: all 0.3s;
            transform: ${({ isOpen }) => (isOpen ? `scale(0.8)` : `scale(1)`)}
        }
        h2{
            font-family: sans-serif;
            color:#02296C;
            display:${({ isOpen }) => (isOpen ? `block` : `none`)};
        }   
    }
    .HoverContainer{
        :hover{
                background: ${(props) => props.theme.bg3};
        }
        .LinkContainer{
            margin: 2px 0;
            padding: 0 7%;
            .Links{
                display:flex;
                align-items:center;
                text-decoration: none;
                padding: calc(${v.smSpacing}-2px) 0;
                color:${(props) => props.theme.text};
                .Linkicon{
                    padding: ${v.smSpacing} ${v.mdSpacing};
                    display:flex;
                    svg{
                        font-size: 25px;
                    }
                }
                &.active{
                    .Linkicon{
                        .TextContainer{
                            color:${(props) => props.theme.bg4};
                        }
                        svg{
                            color:${(props) => props.theme.bg4};
                        }   
                    }
                }
            }
        }
    }
    .Themecontent{
        color:${(props) => props.theme.text};
        display:flex;
        align-items:center;
        margin: ${({ isOpen }) => (isOpen ? `auto 20px` : `auto auto`)};
        .titleTheme{
            display: block;
            padding: 10px;
            font-weight: 700;
            transition: 0.3s;
            white-space: nowrap;
            overflow: hidden;
        }
        .Togglecontent{
            margin: ${({ isOpen }) => (isOpen ? `auto 8px` : `auto 17px`)};
            width: 36px;
            height: 20px;
            border-radius: 10px;
            transition: all 0.4s;
            position: relative;
            .theme-container{
                background-blend-mode: multiply, multiply;
                transition: 0.4s;
                .grid{
                    display: grid;
                    justify-items: center;
                    align-content: center;
                    height: 100vh;
                    width: 100vw;
                    font-family: sans-serif;
                }
                .demo{
                    font-size:2 0px;
                    .switch{
                        position: relative;
                        display: inline-block;
                        width: 34px;
                        height: 19px;
                        .theme-switcher{
                            opacity: 0;
                            width: 0;
                            height: 0;
                            &:checked +.slider:before{
                                left:15px;
                                content: "🔥";
                                transform:traslateX(40px)
                            }
                        }
                        .slider{
                            position: absolute;
                            cursor: pointer;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: ${({ themeUse }) => (themeUse === "light" ? v.lightcheckbox : v.checkbox)};
                            transition: 0.4s;
                            &::before{
                                position: absolute;
                                content: "🔥";
                                height: 0px;
                                width: 0px;
                                left:-3px;
                                top: 10px;
                                line-height:0px;
                                transition: 0.4s;
                            }
                            &.round{
                                border-radius:30px;
                                &::before{
                                    border-radius:50%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

const Divider = styled.div`
    height: 1px;
    width: 100%;
    background: ${(props) => props.theme.bg3};
    margin: ${v.lgSpacing} 0;
`;
//#endregion
