const BASE_URL = "https://sinul.es";
// const BASE_URL = "http://localhost:4005";

const path = {
    PATERNS: "/",
    WORKS: "/patern/:paternId/works",
    WORK: "/patern/:paternId/work/:workId",
    LOGIN: "/login",
    SELECT_IMAGE: "/select-image/:paternId",
    CUT_IMAGE: "/cut/:paternId",
    PALETTE_CONFIGURATOR: "/palette/:paternId",
    IMAGE_RESOLUTION: "/image-resolution/:paternId",
    PATERN: "/patern/:paternId/work/:workId",
};

const PaternStates = {
    CREATED: "CREATED",
    IMAGE_SELECTED: "IMAGE_SELECTED",
    CUTED: "CUTED",
    RESIZED: "RESIZED", 
    PALETTE_CONFIGURATED: "PALETTE_CONFIGURATED",
}

export { path, BASE_URL, PaternStates };
