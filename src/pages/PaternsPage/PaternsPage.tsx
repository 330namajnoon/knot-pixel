import { useNavigate } from "react-router-dom";
import { useGetPaternsQuery, useSetCreatePaternMutation } from "../../services/apiSlice/paternApiSlice";
import { BASE_URL, PaternStates, path } from "../../constants";
import { Box, Container, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import Img from "../../components/Img";
import Loading from "../../components/Loading";

const PaternsPage = () => {
    const navigate = useNavigate();
    const { data: paternsData } = useGetPaternsQuery();
    const [createPatern, { isLoading: isLoadingCreatePatern }] = useSetCreatePaternMutation();

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
                    onClick={() => {
                        if (!patern.path) {
                            navigate(path.SELECT_IMAGE.replace(":paternId", patern.id.toString()))
                        }
                        switch (patern.state) {
                            case PaternStates.CREATED:
                                navigate(path.SELECT_IMAGE.replace(":paternId", patern.id.toString()));
                                break;
                            case PaternStates.IMAGE_SELECTED:
                                navigate(path.CUT_IMAGE.replace(":paternId", patern.id.toString()))
                                break;
                            case PaternStates.CUTED:
                                navigate(path.IMAGE_RESOLUTION.replace(":paternId", patern.id.toString()))
                                break;
                            case PaternStates.RESIZED:
                                navigate(path.PALETTE_CONFIGURATOR.replace(":paternId", patern.id.toString()))
                                break;
                            case PaternStates.PALETTE_CONFIGURATED:
                                navigate(path.WORKS.replace(":paternId", patern.id.toString()))
                                break;
                        }
                    }}
                >
                    <Img style={{ width: "100%", borderRadius: "10px" }} src={`${BASE_URL}/${patern.path}`}  />
                </Box>
            ))}
            <Fab
                size="medium"
                color="secondary"
                aria-label="add"
                sx={{ position: "fixed", bottom: 20, right: 20 }}
                onClick={async () => {
                    try {
                        const response = await createPatern().unwrap();
                        if (response.success && response.insertId) {
                            navigate(path.SELECT_IMAGE.replace(":paternId", response.insertId.toString()));
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }}
            >
                <Add />
            </Fab>
            <Loading isLoading={isLoadingCreatePatern} />
        </Container>
    );
};

export default PaternsPage;
