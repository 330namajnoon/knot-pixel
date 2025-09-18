import LoadingImage from "../../assets/loading.gif";

type LoadingProps = {
    isLoading: boolean;
};

const Loading = ({ isLoading = false }: LoadingProps) => {
    if (isLoading) return <img style={{ width: "100vw", height: "100vh", position: "absolute", objectFit: "cover" }} src={LoadingImage} alt="" />;
	return null;
};

export default Loading;
