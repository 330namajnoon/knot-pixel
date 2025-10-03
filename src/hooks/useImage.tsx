import React, { createContext, useState } from "react";
import { BASE_URL } from "../constants";

const ImageContext = createContext<[string, React.Dispatch<React.SetStateAction<string>>] | null>(null);

export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
	const patern = location.pathname.split("/").pop();
    const [src, setSrc] = useState<string>(location.pathname.split("/").length > 2 ? `${BASE_URL}/patern/${patern}` : "");

    return <ImageContext.Provider value={[src, setSrc]}>{children}</ImageContext.Provider>;
};



