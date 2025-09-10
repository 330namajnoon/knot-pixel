import { Box, Container, Fab, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useImage } from "../../hooks/useImage";
import ImageCuter from "../../lib/modules/ImageCuter";
import { ContentCut, NavigateNext } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, path } from "../../constants";
import { useGetPaternQuery, useSetPaternMutation } from "../../services/apiSlice/paternApiSlice";

const CutImage = () => {
    const navigate = useNavigate();
    const rootRef = useRef<HTMLDivElement>(null);
    const imageCuterRef = useRef<ImageCuter>(null);
    const { paternId } = useParams<{ paternId: string }>();
    const [setPatern] = useSetPaternMutation();
    const { data: paternData } = useGetPaternQuery({ paternId: paternId || "" }, { skip: !paternId });
    const [src, setSrc] = useState("");

    useEffect(() => {
        if (paternData?.path && rootRef.current) {
            const imageCuter = new ImageCuter(rootRef.current, src);
            imageCuter.render();
            imageCuterRef.current = imageCuter;
            setSrc(src);
        }
    }, [src]);

    useEffect(() => {
        if (paternData?.path) {
            setSrc(`${BASE_URL}/${paternData.path}`);
        }
    }, [paternData]);

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
                        setSrc(imageCuterRef.current?.cut().toDataURL() || "");
                    }}
                >
                    <ContentCut />
                </Fab>
                <Fab
                    size="medium"
                    color="secondary"
                    aria-label="navigateNext"
                    onClick={() => {
                        imageCuterRef.current?.cut()?.toBlob((blob) => {
                            if (blob) {
                                const file = new File([blob], "patern.png", { type: "image/png" });
                                const formData = new FormData();
                                formData.append("image", file);
                                setPatern({ imageData: formData, paternId: paternId || "" }).then((res) => {
                                    if (res.data && res.data?.success) {
                                        console.log("Image uploaded successfully");
                                        navigate(path.IMAGE_RESOLUTION.replace(":paternId", paternId || ""));
                                    } else {
                                        alert("Error uploading image");
                                    }
                                });
                            }
                        });
                    }}
                >
                    <NavigateNext />
                </Fab>
            </Box>
        </Container>
    );
};

export default CutImage;
