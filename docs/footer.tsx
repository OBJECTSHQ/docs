import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

// Detect current Vocs theme
function getVocsTheme(): "github-dark" | "github-light" {
	// Check localStorage
	try {
		const stored = localStorage.getItem("vocs.theme");
		if (stored === "dark") return "github-dark";
		if (stored === "light") return "github-light";
	} catch {}

	// Check data-theme attribute
	const theme = document.documentElement.getAttribute("data-theme");
	if (theme === "dark") return "github-dark";
	if (theme === "light") return "github-light";

	// Check dark class
	if (document.documentElement.classList.contains("dark")) {
		return "github-dark";
	}

	// Fallback to system preference
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "github-dark"
		: "github-light";
}

export default function Footer() {
	const commentsRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	useEffect(() => {
		if (!commentsRef.current || location.pathname === "/") return;

		// Clear container - safe as we're only clearing, not inserting untrusted content
		commentsRef.current.innerHTML = "";

		const script = document.createElement("script");
		script.src = "https://utteranc.es/client.js";
		script.setAttribute("repo", "OBJECTSHQ/docs");
		script.setAttribute("issue-term", "title");
		script.setAttribute("theme", getVocsTheme());
		script.setAttribute("crossorigin", "anonymous");
		script.async = true;

		commentsRef.current.appendChild(script);

		// Sync theme changes with Utterances iframe (debounced)
		let timeoutId: ReturnType<typeof setTimeout>;
		const observer = new MutationObserver(() => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				const iframe = document.querySelector<HTMLIFrameElement>(
					".utterances-frame",
				);
				iframe?.contentWindow?.postMessage(
					{ type: "set-theme", theme: getVocsTheme() },
					"https://utteranc.es",
				);
			}, 100);
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "data-theme"],
		});

		return () => {
			observer.disconnect();
			clearTimeout(timeoutId);
		};
	}, [location.pathname]);

	if (location.pathname === "/") return null;

	return (
		<div>
			<div ref={commentsRef} />
			<div>OBJECTS © {new Date().getFullYear()}. All rights reserved.</div>
		</div>
	);
}
