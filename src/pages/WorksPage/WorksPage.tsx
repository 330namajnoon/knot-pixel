import { useNavigate, useParams } from "react-router-dom";
import { useGetPaternWorksQuery, useSetCreatePaternWorkMutation } from "../../services/apiSlice/paternApiSlice";
import { BASE_URL, path } from "../../constants";
import { Box, Container, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import Img from "../../components/Img";
import Loading from "../../components/Loading";

const WorksPage = () => {
    const navigate = useNavigate();
    const { paternId } = useParams<{ paternId: string }>();
    const { data: paternWorksData } = useGetPaternWorksQuery({ paternId: paternId || "" }, { skip: !paternId });
    const [createWork, { isLoading: isLoadingCreateWork }] = useSetCreatePaternWorkMutation();

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
                    onClick={() => navigate(path.WORK.replace(":paternId", work.paternId.toString()).replace(":workId", work.id.toString()))}
                >
                    <Img style={{ width: "100%", borderRadius: "10px" }} src={`${BASE_URL}/${work.paternPath}`} />
                </Box>
            ))}
            <Fab
                size="medium"
                color="secondary"
                aria-label="add"
                sx={{ position: "fixed", bottom: 20, right: 20 }}
                onClick={async () => {
                    try {
                        if (paternId) {
                            const response = await createWork({ paternId }).unwrap();
                            if (response.success && response.insertId) {
                                navigate(
                                    path.WORK.replace(":paternId", paternId || "").replace(
                                        ":workId",
                                        response.insertId.toString()
                                    )
                                );
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }}
            >
                <Add />
            </Fab>
            <Loading isLoading={isLoadingCreateWork} />
        </Container>
    );
};

export default WorksPage;
