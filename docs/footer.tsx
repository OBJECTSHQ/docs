import { useEffect, useRef, useState } from "react";

export default function Footer() {
	const commentsRef = useRef<HTMLDivElement>(null);
	const [pathname, setPathname] = useState("");

	useEffect(() => {
		// Track pathname changes for client-side navigation
		setPathname(window.location.pathname);

		const handleRouteChange = () => {
			setPathname(window.location.pathname);
		};

		// Listen for popstate (browser back/forward)
		window.addEventListener("popstate", handleRouteChange);

		// Listen for custom navigation events (if Vocs dispatches them)
		window.addEventListener("vocs:route-update", handleRouteChange);

		return () => {
			window.removeEventListener("popstate", handleRouteChange);
			window.removeEventListener("vocs:route-update", handleRouteChange);
		};
	}, []);

	useEffect(() => {
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
	}, [pathname]);

	return (
		<div>
			<div ref={commentsRef} />
			<div>OBJECTS © {new Date().getFullYear()}. All rights reserved.</div>
		</div>
	);
}
