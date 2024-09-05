import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchInventario } from '../utils/api';

export function Inventario() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchInventario();
                console.log(result); // Verifica los datos aquí
                setData(result); // Actualiza el estado con los datos
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Container>
            <h1>Inventario</h1>
            <div className='lista'>
                <ul>
                    {data.length > 0 ? (
                        data.map(item => (
                            <li key={item.id}>{item.nombre}</li> // Asegúrate de que `item.id` y `item.name` existan
                        ))
                    ) : (
                        <p>No hay datos disponibles.</p>
                    )}
                </ul>
            </div>
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
