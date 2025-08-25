import React, { createContext, useState } from "react";

const ImageContext = createContext<[string, React.Dispatch<React.SetStateAction<string>>] | null>(null);

export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
    const [src, setSrc] = useState<string>(localStorage.getItem("imageSrc") || "");

    return <ImageContext.Provider value={[src, setSrc]}>{children}</ImageContext.Provider>;
};

export const useImage = () => {
	const context = React.useContext(ImageContext);
	if (!context) {
		throw new Error("useImage must be used within an ImageProvider");
	}
	return context;
};



