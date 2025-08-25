import { NavigateNext } from "@mui/icons-material";
import { Box, Container, Fab, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImage } from "../../hooks/useImage";
import ImageSizeConfigurator from "../../lib/modules/ImageSizeConfigurator";
import { path } from "../../constants";

const ImageResolution = () => {
    const navigate = useNavigate();
    const [src, setSrc] = useImage();
    const rootRef = useRef<HTMLDivElement>(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const imageResolutionConfigurator = useRef<ImageSizeConfigurator>(null);

    useEffect(() => {
        if (src && rootRef.current) {
            const resolutionConfigurator = new ImageSizeConfigurator(rootRef.current, src);
            resolutionConfigurator
                .render()
                .then((instance) => {
                    setImageSize(instance.getSize());
                })
                .catch((error) => {
                    console.error("Error rendering ImageSizeConfigurator:", error);
                });
            imageResolutionConfigurator.current = resolutionConfigurator;
        }
    }, [src]);

    return (
        <Container
            sx={{
                bgcolor: "background.main",
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                padding: 3,
            }}
        >
            <Typography variant="h1" component={"h2"} sx={{ fontSize: "20px" }}>
                Image Resolution Configurator
            </Typography>
            <div
                ref={rootRef}
                style={{
                    width: "100%",
                    height: "70vh",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            ></div>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                    <TextField
                        type="number"
                        label="Width"
                        value={imageSize.width}
                        placeholder="Width"
                        onChange={(e) => {
                            const width = parseInt(e.target.value);
                            if (width > 0 && !isNaN(width) && imageResolutionConfigurator.current) {
                                imageResolutionConfigurator.current.setRowSize(width);
                            }
                            setImageSize({
                                width,
                                height:
                                    ((imageResolutionConfigurator?.current?.getSize?.()?.height || 0) /
                                        (imageResolutionConfigurator?.current?.getSize?.()?.width || 0)) *
                                    width,
                            });
                        }}
                    />
                    <TextField
                        type="number"
                        label="Height"
                        value={imageSize.height}
                        placeholder="Height"
                        onChange={(e) => {
                            const height = parseInt(e.target.value);
                            if (height > 0 && !isNaN(height) && imageResolutionConfigurator.current) {
                                imageResolutionConfigurator.current.setRowSize(
                                    ((imageResolutionConfigurator?.current?.getSize?.()?.width || 0) /
                                        (imageResolutionConfigurator?.current?.getSize?.()?.height || 0)) *
                                        height
                                );
                            }
                            setImageSize({
                                width:
                                    ((imageResolutionConfigurator?.current?.getSize?.()?.width || 0) /
                                        (imageResolutionConfigurator?.current?.getSize?.()?.height || 0)) *
                                    height,
                                height,
                            });
                        }}
                    />
                </Box>
                <Fab
                    size="medium"
                    color="secondary"
                    aria-label="navigateNext"
                    onClick={() => {
                        if (!imageResolutionConfigurator.current) {
                            console.error("ImageResolutionConfigurator instance is not initialized.");
                            return;
                        }
                        setSrc(imageResolutionConfigurator.current.toImageURL());
                        navigate(path.PALETTE_CONFIGURATOR);
                    }}
                >
                    <NavigateNext />
                </Fab>
            </Box>
        </Container>
    );
};

export default ImageResolution;
