import { useGesture } from "@use-gesture/react";
import { useRef, useState } from "react";

const useZoomGesture = () => {
	const ref = useRef<HTMLDivElement>(null);
	const [zoom, setZoom] = useState(1);

	useGesture(
		{
			onPinch: ({ offset: [d], memo }) => {
				const newZoom = Math.min(Math.max(d / 10 + 1, 0.5), 5); // Clamp zoom between 0.5 and 5
				setZoom(newZoom);
				return memo;
			},
		},
		{
			target: ref,
			eventOptions: { passive: false },
			pinch: { scaleBounds: { min: 0.5, max: 5 }, rubberband: true },
		}
	);

	return { ref, zoom };
}

export default useZoomGesture;