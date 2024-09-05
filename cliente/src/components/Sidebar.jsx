import styled from 'styled-components'
import logocolgas from '../assets/colgas.png'
import {v} from "../styles/Variables"
import {AiOutlineDoubleLeft, AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import {MdPermDeviceInformation, MdOutlineCheckBox, MdCalendarMonth, MdOutlineAnalytics, MdOutlineInventory, MdLogout, MdSafetyDivider, MdOutlineSafetyDivider} from "react-icons/md";
import {NavLink, useLocation} from "react-router-dom";
import { useContext } from 'react';
import { ThemeContext } from '../App';

export function Sidebar({sidebarOpen, setSidebarOpen}){
    const ModSidebarOpen=()=>{
        setSidebarOpen(!sidebarOpen);
    };
    const {setTheme, theme} = useContext(ThemeContext);
    const CambiarTheme=()=>{
        setTheme((theme)=>(theme==="light"?"dark":"light"))
    };
    
    return (
    <Container isOpen={sidebarOpen} themeUse={theme}>
        <button className='Sidebarbutton'
                onClick={ModSidebarOpen}>
            <AiOutlineDoubleLeft/>
        </button>
        <div className='logocontent'>
            <div className='imgcontent' >
                <img src={logocolgas} width={40} />
            </div>
            <h2>colgas</h2>
        </div> 
        {linksArray.map(({icon, label, to})=>(
            <div className='HoverContainer'>
            <div className='LinkContainer' key={label}>
               <NavLink to={to} className={({isActive})=>`Links${isActive?` active`:``}`}>
                    <div className='Linkicon'>
                        {icon}
                    </div>
                    {sidebarOpen &&
                        <span className='TextContainer'>{label}</span>
                    }
               </NavLink> 
            </div>
            </div>
        ))}
        <Divider/>
        {secondarylinksArray.map(({icon, label, to})=>(
            <div className='HoverContainer'>
            <div className='LinkContainer' key={label}>
               <NavLink to={to} className={({isActive})=>`Links${isActive?` active`:``}`}>
                    <div className='Linkicon'>
                        {icon}
                    </div>
                    {sidebarOpen &&
                        <span className='TextContainer'>{label}</span>
                    }
               </NavLink> 
            </div>
            </div>
        ))}
        <Divider/>
        <div className='Themecontent'>
            {sidebarOpen && <span className='titleTheme'> Modo oscuro </span>}
            <div className='Togglecontent'>
                <div className='grid theme-container'>
                    <div className='content'>
                        <div className='demo'>
                            <label className='switch'>
                                <input type='checkbox' 
                                className='theme-switcher'
                                onClick={CambiarTheme}>
                                </input>
                                <span className='slider round'/>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    </Container>
    );
}
//#region DATA LINKS
const linksArray=[
    {
        label:"Inicio",
        icon:<AiOutlineHome/>,
        to: "/",
    },
    {
        label:"Inventario",
        icon:<MdOutlineInventory/>,
        to: "/inventario",
    },
    {
        label:"Planificación",
        icon:<MdCalendarMonth/>,
        to: "/planificacion",
    },
    {
        label:"Aprobaciones",
        icon:<MdOutlineCheckBox/>,
        to: "/aprobaciones",
    },
    {
        label:"Informes",
        icon:<MdPermDeviceInformation/>,
        to: "/informes",
    },
];
const secondarylinksArray=[
    {
        label:"Configuración",
        icon:<AiOutlineSetting/>,
        to: "/configuracion",
    },
    {
        label:"Salir",
        icon:<MdLogout/>,
        to: "/salir",
    },
];
//#endregion

//#region STYLED COMPONENTS
const Container = styled.div`
    color:${(props)=>props.theme.bg2};
    background:${(props)=>props.theme.bg};
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
        background:${(props)=>props.theme.bgtgderecha};
        color:${(props)=>props.theme.text};
        box-shadow: 0 0 4px ${(props)=>props.theme.bg3}, 0 0 7px ${(props)=>props.theme.bg};
        display:flex;
        justify-content:center;
        align-items:center;
        cursor: pointer;
        transition: all 0.3s;
        transform: ${({isOpen})=>(isOpen?`initial`:`rotate(180deg)`)};
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
            transform: ${({isOpen})=>(isOpen?`scale(0.8)`:`scale(1)`)}
        }
        h2{
            font-family: sans-serif;
            color:#02296C;
            display:${({isOpen})=>(isOpen?`block`:`none`)};
        }   
    }
    .HoverContainer{
        :hover{
                background: ${(props)=>props.theme.bg3};
        }
        .LinkContainer{
            margin: 2px 0;
            padding: 0 7%;
            .Links{
                display:flex;
                align-items:center;
                text-decoration: none;
                padding: calc(${v.smSpacing}-2px) 0;
                color:${(props)=>props.theme.text};
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
                            color:${(props)=>props.theme.bg4};
                        }
                        svg{
                            color:${(props)=>props.theme.bg4};
                        }   
                    }
                }
            }
        }
    }
    .Themecontent{
        color:${(props)=>props.theme.text};
        display:flex;
        align-items:center;
        margin: ${({isOpen})=>(isOpen?`auto 20px`:`auto auto`)};
        .titleTheme{
            display: block;
            padding: 10px;
            font-weight: 700;
            transition: 0.3s;
            white-space: nowrap;
            overflow: hidden;
        }
        .Togglecontent{
            margin: ${({isOpen})=>(isOpen?`auto 8px`:`auto 17px`)};
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
                            background: ${({themeUse})=>(themeUse==="light"? v.lightcheckbox:v.checkbox)};
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
    background: ${(props)=>props.theme.bg3};
    margin: ${v.lgSpacing} 0;
`;
//#endregion