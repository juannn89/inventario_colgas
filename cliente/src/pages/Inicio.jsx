import styled from 'styled-components'

export function Inicio(){
    return (
        <Container>
            <h1>Inicio</h1>
            <h2>nfdsmasldmasodmaosmdasldmalsdmasmdasomdaosmasdmaosmdsokcoecow</h2>
            
        </Container>
        );
}

const Container = styled.div`
    height: 100%;
    width: 100%;
    background:${(props)=>props.theme.bg3};
    h1{
        display:grid;
        justify-content:center;
        align-items:center;
        padding: 2% 5%;
    }
    
`;