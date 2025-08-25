import { NavigateNext } from "@mui/icons-material";
import { Box, Container, Fab, TextField, Typography } from "@mui/material";
import { BASE_URL, path } from "../../constants";
import ImagePaletteConfigurator from "../../lib/modules/ImagePaletteConfigurator";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImage } from "../../hooks/useImage";

const PaletteConfigurator = () => {
    const navigate = useNavigate();
    const [src, setSrc] = useImage();
    const rootRef = useRef<HTMLDivElement>(null);
    const [paletteSize, setPaletteSize] = useState(4);
    const [palette, setPalette] = useState<number[][]>([]);
    const imagePaletteConfiguratorRef = useRef<ImagePaletteConfigurator>(null);

    useEffect(() => {
        if (src && rootRef.current) {
            const paletteConfigurator = new ImagePaletteConfigurator(rootRef.current, src);
            paletteConfigurator
                .render()
                .then((instance) => {
                    setPalette(instance.getPalette());
                })
                .catch((error) => {
                    console.error("Error rendering ImagePaletteConfigurator:", error);
                });
            imagePaletteConfiguratorRef.current = paletteConfigurator;
        }
    }, [src]);

    useEffect(() => {
        if (imagePaletteConfiguratorRef.current) {
            setPalette(imagePaletteConfiguratorRef.current.getPalette());
        }
    }, [paletteSize]);

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
            <Typography variant="h1" component={"h2"} sx={{ fontSize: "30px" }}>
                Palette Configurator
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
                <TextField
                    type="number"
                    value={paletteSize}
                    placeholder="(2, 4, 8, 16, 32…)"
                    onChange={(e) => {
                        const newSize = parseInt(e.target.value, 10);
                        if (newSize > 1 && imagePaletteConfiguratorRef.current) {
                            imagePaletteConfiguratorRef.current.setPaletteSize(newSize);
                        }
                        setPaletteSize(newSize);
                    }}
                />
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {palette.map((color, index) => (
                        <input
                            key={index}
                            type="color"
                            value={ImagePaletteConfigurator.rgbToHex(color)}
                            onChange={(e) => {
                                const newColor = e.target.value;
                                if (imagePaletteConfiguratorRef.current) {
                                    imagePaletteConfiguratorRef.current.changePaletteColor(index, newColor);
                                    setPalette((prevPalette) => {
                                        const newPalette = [...prevPalette];
                                        newPalette[index] = ImagePaletteConfigurator.hexToRgb(newColor);
                                        return newPalette;
                                    });
                                }
                            }}
                        />
                    ))}
                </Box>
                <Fab
                    size="medium"
                    color="secondary"
                    aria-label="navigateNext"
                    onClick={() => {
						if (!imagePaletteConfiguratorRef.current) {
                            console.error("ImagePaletteConfigurator instance is not initialized.");
                            return;
                        }
                        setSrc(imagePaletteConfiguratorRef.current.toImageURL());
                        const img = new Image();
                        img.src = imagePaletteConfiguratorRef.current.toImageURL();
                        img.onload = () => {
                            const canvas = document.createElement("canvas");
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext("2d");
                            if (ctx) {
                                ctx.drawImage(img, 0, 0);
                                canvas.toBlob((blob) => {
                                    if (blob) {
                                        const file = new File([blob], "patern.png", { type: "image/png" });
                                        const formData = new FormData();
                                        formData.append("image", file);
                                        fetch(`${BASE_URL}/patern`, { method: "POST", body: formData }).then((response) => {
                                            if (response.ok) {
                                                console.log("Image uploaded successfully");
                                                navigate(path.PATERN);
                                            } else {
                                                console.error("Failed to upload image:", response.statusText);
                                            }
                                        });
                                    }
                                }, "image/png");
                            }
                        };
                    }}
                >
                    <NavigateNext />
                </Fab>
            </Box>
        </Container>
    );
};

export default PaletteConfigurator;
