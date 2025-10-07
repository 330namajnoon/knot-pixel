import LoadingImage from "../../assets/loading.gif";

type LoadingProps = {
    isLoading: boolean;
};

const Loading = ({ isLoading = false }: LoadingProps) => {
    if (isLoading) return <img style={{ width: "100vw", height: "100vh", left: "0px", top: "0px", position: "fixed", objectFit: "cover", zIndex: 10000 }} src={LoadingImage} alt="" />;
	return null;
};

export default Loading;
