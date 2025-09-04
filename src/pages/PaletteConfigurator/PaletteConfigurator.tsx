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
    const videoRef = useRef<HTMLVideoElement>(null);
    const [inChangingColor, setInChangingColor] = useState<{ index: number; color: number[] }>({
        index: -1,
        color: [],
    });
    const [detectedColor, setDetectedColor] = useState<number[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const requestAnimationFrameRef = useRef<number>(0);

    function getCenterColor() {
        if (!videoRef.current || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const { videoWidth, videoHeight } = videoRef.current;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

        // Centro de la imagen
        const size = 10;
        const x = Math.floor((videoWidth / 2) - (size / 2));
        const y = Math.floor((videoHeight / 2) - (size / 2));

        const data = ctx.getImageData(x, y, size, size).data;
        const rgb: number[] = new Array(3).fill(0);
        for (let i = 0; i < data.length; i += 4) {
            rgb[0]+= data[i];
            rgb[1]+= data[i + 1];
            rgb[2]+= data[i + 2];
        }
        
        rgb[0] = Math.floor(rgb[0]/(size * size));
        rgb[1] = Math.floor(rgb[1]/(size * size));
        rgb[2] = Math.floor(rgb[2]/(size * size));
        
        console.log(rgb);

        setDetectedColor(rgb);
        setInChangingColor((prev) => {
            if (prev.index !== -1) {
                requestAnimationFrame(getCenterColor);
            }
            return prev;
        });
    }

    const handleCaptureCamera = (index: number, color: number[]) => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setInChangingColor({ index, color });
            }
        });
    };

    useEffect(() => {
        imagePaletteConfiguratorRef.current?.changePaletteColor(
            inChangingColor.index,
            ImagePaletteConfigurator.rgbToHex(detectedColor)
        );
        setPalette((prevPalette) => {
            const newPalette = [...prevPalette];
            if (inChangingColor.index !== -1) {
                newPalette[inChangingColor.index] = detectedColor;
            }
            return newPalette;
        });
    }, [detectedColor]);

    useEffect(() => {
        if (src && rootRef.current) {
            const paletteConfigurator = new ImagePaletteConfigurator(rootRef.current, src, paletteSize);
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

    useEffect(() => {
        if (inChangingColor.index !== -1) {
            requestAnimationFrameRef.current = requestAnimationFrame(getCenterColor);
        }
    }, [inChangingColor]);

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
                        <Box key={index}>
                            <button
                                onClick={() =>
                                    inChangingColor.index === index
                                        ? setInChangingColor({ index: -1, color: [] })
                                        : handleCaptureCamera(index, color)
                                }
                            >
                                {inChangingColor.index === index ? "Cancel" : "Capture from Camera"}
                            </button>
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
                        </Box>
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
                                        fetch(`${BASE_URL}/patern`, { method: "POST", body: formData }).then(
                                            (response) => {
                                                if (response.ok) {
                                                    navigate(path.PATERN);
                                                } else {
                                                    console.error("Failed to upload image:", response.statusText);
                                                }
                                            }
                                        );
                                    }
                                }, "image/png");
                            }
                        };
                    }}
                >
                    <NavigateNext />
                </Fab>
            </Box>
            <video style={{ width: "100px", height: "100px", objectFit: "cover", position: "absolute", left: 0, top: 0 }} ref={videoRef}></video>
        </Container>
    );
};

export default PaletteConfigurator;
