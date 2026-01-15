import { useEffect, useRef } from "react";

export default function Footer() {
	const commentsRef = useRef<HTMLDivElement>(null);
	const initializedRef = useRef(false);

	useEffect(() => {
		if (!commentsRef.current || initializedRef.current) return;

		const loadUtterances = () => {
			if (!commentsRef.current) return;

			// Clear previous utterances instance safely
			while (commentsRef.current.firstChild) {
				commentsRef.current.removeChild(commentsRef.current.firstChild);
			}

			const script = document.createElement("script");
			script.src = "https://utteranc.es/client.js";
			script.setAttribute("repo", "OBJECTSHQ/docs");
			script.setAttribute("issue-term", "title");
			script.setAttribute("theme", "preferred-color-scheme");
			script.setAttribute("crossorigin", "anonymous");
			script.async = true;

			commentsRef.current.appendChild(script);
		};

		// Initial load
		loadUtterances();
		initializedRef.current = true;

		const handleRouteChange = () => {
			loadUtterances();
		};

		// Listen for popstate (browser back/forward)
		window.addEventListener("popstate", handleRouteChange);

		return () => {
			window.removeEventListener("popstate", handleRouteChange);
		};
	}, []);

	return (
		<div>
			<div ref={commentsRef} />
			<div>OBJECTS © {new Date().getFullYear()}. All rights reserved.</div>
		</div>
	);
}
