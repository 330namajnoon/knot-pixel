import { useEffect, useRef } from "react";
import { useGetPaternWorkQuery } from "../../services/apiSlice/paternApiSlice";
import { useParams } from "react-router-dom";
import { PaternCreator } from "../../lib";
import { BASE_URL } from "../../constants";
import Work from "../../lib/modules/Work";

const WorkPage = () => {
    const { paternId, workId } = useParams<{ paternId: string, workId: string }>();
    const { data: paternWorkData } = useGetPaternWorkQuery({ paternId: paternId || "", workId: workId || "" }, { skip: !paternId || !workId });
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (paternWorkData?.paternPath) {
            const paternCreator = new PaternCreator(`${BASE_URL}/${paternWorkData.paternPath}`);
            paternCreator
                .create()
                .then((patern) => {
                    console.log(patern)
                    if (rootRef.current) {
                        const work = new Work(patern, rootRef.current);
                        console.log(work);
                    }
                })
                .catch((error) => {
                    console.error("Error creating patern:", error); 
                });
        }
    }, [paternWorkData]);

    return <div ref={rootRef} id="workRoot" style={{ width: "100%", height: "100vh"}}></div>;
};

export default WorkPage;
