import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./components/Menu";
import Productos from "./components/Productos";
import Clientes from "./components/Clientes";
import Ventas from "./components/Ventas";

function App() {
    return (
        <BrowserRouter>
            <Menu />

            <Routes>
                {/* Ruta de bienvenida para la raíz */}
                <Route 
                    path="/" 
                    element={
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <h2>Bienvenido a Sandy</h2>
                            <p>Selecciona una opción en el menú superior para empezar.</p>
                        </div>
                    } 
                />

                <Route
                    path="/productos"
                    element={<Productos />}
                />

                <Route
                    path="/clientes"
                    element={<Clientes />}
                />

                <Route
                    path="/ventas"
                    element={<Ventas />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;