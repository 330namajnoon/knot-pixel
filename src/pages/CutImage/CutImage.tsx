import { Box, Container, Fab, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useImage } from "../../hooks/useImage";
import ImageCuter from "../../lib/modules/ImageCuter";
import { ContentCut, NavigateNext } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { path } from "../../constants";

const CutImage = () => {
    const navigate = useNavigate();
    const [src, setSrc] = useImage();
    const rootRef = useRef<HTMLDivElement>(null);
    const imageCuterRef = useRef<ImageCuter>(null);

    useEffect(() => {
        if (src && rootRef.current) {
            const imageCuter = new ImageCuter(rootRef.current, src);
            imageCuter.render();
            imageCuterRef.current = imageCuter;
        }
    }, [src]);
    return (
        <Container
            sx={{
                bgcolor: "background.main",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
            }}
        >
            <Typography variant="h1" component={"h2"} sx={{ fontSize: "40px" }}>
                Cut Image
            </Typography>
            <div ref={rootRef} style={{ width: "100%", height: "70vh", position: "relative" }}></div>
            <Box sx={{ display: "flex", gap: 4 }}>
                <Fab
                    size="medium"
                    color="secondary"
                    aria-label="contentCut"
                    onClick={() => {
                        setSrc(imageCuterRef.current?.cut() || "");
                    }}
                >
                    <ContentCut />
                </Fab>
                <Fab
                    size="medium"
                    color="secondary"
                    aria-label="navigateNext"
                    onClick={() => {
                        navigate(path.IMAGE_RESOLUTION);
                    }}
                >
                    <NavigateNext />
                </Fab>
            </Box>
        </Container>
    );
};

export default CutImage;
