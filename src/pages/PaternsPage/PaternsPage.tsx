import { useNavigate } from "react-router-dom";
import { useGetPaternsQuery } from "../../services/apiSlice/paternApiSlice";
import { BASE_URL, path } from "../../constants";
import { Box, Container, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import Img from "../../components/Img";

const PaternsPage = () => {
    const navigate = useNavigate();
    const { data: paternsData } = useGetPaternsQuery();

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
            {paternsData?.map((patern) => (
                <Box
                    sx={{ cursor: "pointer", width: "45vw", height: "fit-content", overflow: "hidden" }}
                    key={patern.id}
                    onClick={() => navigate(path.PATERN.replace(":paternId", patern.id.toString()))}
                >
                    <Img style={{ width: "100%", borderRadius: "10px" }} src={`${BASE_URL}/${patern.path}`}  />
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

export default PaternsPage;
