import { Add, NavigateNext } from "@mui/icons-material";
import { Box, Container, Fab, Typography } from "@mui/material";
import { createRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { path } from "../../constants";
import { useSetPaternMutation } from "../../services/apiSlice/paternApiSlice";

const ImageSelector = () => {
    const navigate = useNavigate();
    const [setPatern] = useSetPaternMutation();
    const fileRef = createRef<HTMLInputElement>();
    const [src, setSrc] = useState<string>("");
    const { paternId } = useParams<{ paternId: string }>();

    const handleSetPatern = async () => {
        const img = new Image();
        img.src = src;
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
                        setPatern({ imageData: formData, paternId: paternId || "" }).then((res) => {
                            if (res.data && res.data?.success) {
                                navigate(path.CUT_IMAGE.replace(":paternId", paternId || ""));
                            } else {
                                alert("Error uploading image");
                            }
                        });
                    }
                }, "image/png");
            }
        };
    };

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
                <Fab size="medium" color="secondary" aria-label="NavigateNext" onClick={handleSetPatern}>
                    <NavigateNext />
                </Fab>
            ) : (
                <Fab
                    size="medium"
                    color="secondary"
                    aria-label="add"
                    onClick={() => {
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
