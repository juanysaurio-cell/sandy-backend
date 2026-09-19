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

