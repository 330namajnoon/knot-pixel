import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";

type ImgLoaderProps = {
	src: string;
	style?: React.CSSProperties;
	alt?: string;
}

const Img = ({ src, style, alt }: ImgLoaderProps) => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const img = new Image();
		img.src = src;
		img.onload = () => setIsLoading(false);
	}, []);

	if (isLoading) {
		return (
			<Skeleton variant="rectangular" width={"45vw"} height={"30vh"} />
		);
	}
	return <img style={style} src={src} alt={alt} />;
}

export default Img;
