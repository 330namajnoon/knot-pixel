import { BrowserRouter, Route, Routes } from "react-router-dom";
import ImageSelector from "./pages/ImageSelector";
import CutImage from "./pages/CutImage";
import { ImageProvider } from "./hooks/useImage";
import { PaletteConfigurator } from "./pages/PaletteConfigurator";
import { path } from "./constants";
import { ImageResolution } from "./pages/ImageResolution";
import PaternPage from "./pages/PaternPage";
import { Provider } from "react-redux";
import store from "./services/store";

function App() {

    return (
        <Provider store={store}>
            <ImageProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path={path.SELECT_IMAGE} element={<ImageSelector />} />
                        <Route path={path.CUT_IMAGE} element={<CutImage />} />
                        <Route path={path.PALETTE_CONFIGURATOR} element={<PaletteConfigurator />} />
                        <Route path={path.IMAGE_RESOLUTION} element={<ImageResolution />} />
                        <Route path={path.PATERN} element={<PaternPage />} />
                    </Routes>
                </BrowserRouter>
            </ImageProvider>
        </Provider>
    )
}

export default App;
