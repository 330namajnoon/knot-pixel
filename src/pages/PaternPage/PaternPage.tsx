import { useEffect, useState } from "react";
import PaternCreator, { type Knot, type Patern } from "../../lib/modules/PaternCreator";
import { BASE_URL } from "../../constants";
import { Container } from "@mui/material";
import { useGetPaternQuery } from "../../services/apiSlice/paternApiSlice";
import { useParams } from "react-router-dom";
import ImagePaletteConfigurator from "../../lib/modules/ImagePaletteConfigurator";

const PaternPage = () => {
    const [patern, setPatern] = useState<Patern | null>(null);
    const [src, setSrc] = useState("");
    const [selectedKnotGroup, setSelectedKnotGroup] = useState<Knot>();
    const { paternId } = useParams<{ paternId: string }>();
    const { data: paternData } = useGetPaternQuery({ paternId: paternId || "" }, { skip: !paternId });

    useEffect(() => {
        if (src) {
            const paternCreator = new PaternCreator(src);
            paternCreator
                .create()
                .then((patern) => {
                    const knots = patern.knots;
                    const pixel: Knot[] = [];
                    knots.forEach((row) => {
                        row.forEach((knotGroup) => {
                            knotGroup.forEach((knot) => {
                                pixel.push({
                                    x: knot.x,
                                    y: knot.y,
                                    color: knot.color,
                                });
                            });
                        });
                    });
                    setPatern(patern);
                    const map = new Map<string, string>();

                    pixel.forEach((p) => {
                        const key = p.color;
                        if (!map.has(key)) {
                            map.set(key, p.color);
                        }
                    });

                    setSelectedKnotGroup({ x: 0, y: knots.length - 40, color: "" });
                })
                .catch((error) => {
                    console.error("Error creating patern:", error);
                });
        }
    }, [src]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "s") {
                setSelectedKnotGroup((selectedKnotGroup) => {
                    if (!selectedKnotGroup) {
                        return selectedKnotGroup;
                    }
                    if (patern?.knots[selectedKnotGroup.y]?.[selectedKnotGroup.x + 1]) {
                        return {
                            x: selectedKnotGroup.x + 1,
                            y: selectedKnotGroup.y,
                            color: ""
                        };
                    } else if (patern?.knots[selectedKnotGroup.y - 1]) {
                        return {
                            x: 0,
                            y: selectedKnotGroup.y - 1,
                            color: ""
                        };
                    }
                });
            }
        }
        if (patern) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [patern]);

    useEffect(() => {
        if (paternData?.path) {
            setSrc(`${BASE_URL}/${paternData.path}`);
        }
    }, [paternData]);

    return (
        <Container sx={{ display: "flex", flexDirection: "column" }}>
            {patern?.knots.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex" }}>
                    {row.map((knotGroup, groupIndex) => (
                        <div key={groupIndex} style={{ display: "flex" }}>
                            {knotGroup.map((knot, knotIndex) => (
                                <div
                                    ref={(el) => {
                                        if (
                                            el &&
                                            groupIndex === selectedKnotGroup?.x &&
                                            rowIndex === selectedKnotGroup?.y &&
                                            knotIndex === knotGroup.length - 1
                                        ) {
                                            el.scrollIntoView({ behavior: "smooth", inline: "center", block: "center" });
                                        }
                                    }}
                                    key={knotIndex}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: ImagePaletteConfigurator.getContrastColor(knot.color),
                                        backgroundColor: knot.color,
                                        border:
                                            groupIndex === selectedKnotGroup?.x && rowIndex === selectedKnotGroup?.y
                                                ? "2px solid #9e9e9e"
                                                : "none",
                                    }}
                                >
                                    {groupIndex === selectedKnotGroup?.x &&
                                        rowIndex === selectedKnotGroup?.y &&
                                        knot.x + 1}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </Container>
    );
};

export default PaternPage;
