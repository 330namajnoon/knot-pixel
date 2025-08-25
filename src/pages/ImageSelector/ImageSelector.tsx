import { Add, NavigateNext } from "@mui/icons-material";
import { Box, Container, Fab, Typography } from "@mui/material";
import { createRef } from "react";
import { useImage } from "../../hooks/useImage";
import { useNavigate } from "react-router-dom";
import { path } from "../../constants";

const ImageSelector = () => {
    const fileRef = createRef<HTMLInputElement>();
    const navigate = useNavigate();
    const [src, setSrc] = useImage();
    return (
        <Container
            sx={{
                bgcolor: "packground.main",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: 4,
            }}
        >
            <Typography variant="h1" component="h2" color="text" sx={{ fontSize: "40px" }}>
                Select an Image
            </Typography>
            {src && (
                <Box sx={{ width: "100%", maxWidth: "600px", maxHeight: "70vh", overflow: "hidden" }}>
                    <img src={src} style={{ objectFit: "cover", width: "100%" }} alt="" />
                </Box>
            )}
            {src ? (
                <Fab
                    size="medium"
                    color="secondary"
                    aria-label="NavigateNext"
                    onClick={() => {
						localStorage.setItem("imageSrc", src);
                        navigate(path.CUT_IMAGE);
                    }}
                >
                    <NavigateNext />
                </Fab>
            ) : (
                <Fab
                    size="medium"
                    color="secondary"
                    aria-label="add"
                    onClick={() => {
                        console.log(fileRef);
                        if (fileRef.current) {
                            fileRef.current.click();
                        }
                    }}
                >
                    <Add />
                </Fab>
            )}
            <input
                type="file"
                ref={fileRef}
                style={{ display: "none" }}
                onInput={(e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            if (event.target?.result) {
                                setSrc(event.target.result as string);
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                }}
            />
        </Container>
    );
};

export default ImageSelector;
