import { BrowserRouter, Route, Routes } from "react-router-dom";
import ImageSelector from "./pages/ImageSelector";
import { ImageProvider } from "./hooks/useImage";
import { PaletteConfigurator } from "./pages/PaletteConfigurator";
import { path } from "./constants";
import { Provider } from "react-redux";
import store from "./services/store";
import PaternsPage from "./pages/PaternsPage";
import LoginPage from "./pages/LoginPage";
import WorksPage from "./pages/WorksPage";
import WorkPage from "./pages/WorkPage";
import CutImagePage from "./pages/CutImagePage";
import ImageResolutionPage from "./pages/ImageResolutionPage";

function App() {

    return (
        <Provider store={store}>
            <ImageProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path={path.PATERNS} element={<PaternsPage />} />
                        <Route path={path.WORKS} element={<WorksPage />} />
                        <Route path={path.WORK} element={<WorkPage />} />
                        <Route path={path.LOGIN} element={<LoginPage />} />
                        <Route path={path.SELECT_IMAGE} element={<ImageSelector />} />
                        <Route path={path.CUT_IMAGE} element={<CutImagePage />} />
                        <Route path={path.PALETTE_CONFIGURATOR} element={<PaletteConfigurator />} />
                        <Route path={path.IMAGE_RESOLUTION} element={<ImageResolutionPage />} />
                    </Routes>
                </BrowserRouter>
            </ImageProvider>
        </Provider>
    )
}

export default App;
