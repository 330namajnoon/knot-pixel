import { useNavigate, useParams } from "react-router-dom";
import { useGetPaternWorksQuery } from "../../services/apiSlice/paternApiSlice";
import { BASE_URL, path } from "../../constants";
import { Box, Container, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import Img from "../../components/Img";

const WorksPage = () => {
    const navigate = useNavigate();
    const { paternId } = useParams<{ paternId: string }>();
    const { data: paternWorksData } = useGetPaternWorksQuery({ paternId: paternId || "" }, { skip: !paternId });

    return (
        <Container
            sx={{
                display: "flex",
                alignContent: "start",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "10px",
                padding: 2,
                bgcolor: "packground.main",
                minHeight: "100vh",
                position: "relative",
            }}
        >
            {paternWorksData?.map((work) => (
                <Box
                    sx={{ cursor: "pointer", width: "45vw", height: "fit-content", overflow: "hidden" }}
                    key={work.id}
                    onClick={() => navigate(path.PATERN.replace(":paternId", work.paternId.toString()))}
                >
                    <Img style={{ width: "100%", borderRadius: "10px" }} src={`${BASE_URL}/${work.paternPath}`}  />
                </Box>
            ))}
            <Fab
                size="medium"
                color="secondary"
                aria-label="add"
                sx={{ position: "fixed", bottom: 20, right: 20 }}
                onClick={() => {
                    
                }}
            >
                <Add />
            </Fab>
        </Container>
    );
};

export default WorksPage;
