import { defineConfig } from "vocs";
import "./styles.css";

export default defineConfig({
	title: "OBJECTS Docs",
	description: "Build user friendly physical design apps with OBJECTS",
	head: (
		<>
			{/* Viewport with interactive-widget for mobile browser address bar handling */}
			<meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content" />
			{/* Color scheme for Safari dark mode detection */}
			<meta name="color-scheme" content="light dark" />
			{/* Open Graph */}
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content="OBJECTS Docs" />
			<meta property="og:url" content="https://docs.objects.foundation" />
			{/* Twitter Card */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@OBJECTS____" />
			<meta name="twitter:creator" content="@OBJECTS____" />
			{/* Additional SEO */}
			<meta name="keywords" content="OBJECTS, physical design, protocol, network, app development" />
			<meta name="author" content="OBJECTS" />
			<link rel="canonical" href="https://docs.objects.foundation" />
		</>
	),
	editLink: {
		pattern: "https://github.com/objects/docs/edit/main/docs",
		text: "Edit this page on GitHub",
	},
	font: {
		default: {
			google: "IBM Plex Sans",
		},
		mono: {
			google: "IBM Plex Mono",
		},
	},
	theme: {
		accentColor: {
			light: "black",
			dark: "white",
		},
		variables: {
			color: {
				background: {
					light: "white",
					dark: "#000000",
				},
			},
		},
	},
	ogImageUrl:
		"https://vocs.dev/api/og?logo=%logo&title=%title&description=%description",
	iconUrl: {
		light: "/Logo-Color.svg",
		dark: "/Logo-Color.svg",
	},
	logoUrl: {
		light: "/Wordmark.svg",
		dark: "/Wordmark-Dark.svg",
	},
	topNav: [
		{ text: "Overview", link: "/overview" },
		{ text: "Protocol", link: "/protocol" },
		{ text: "Network", link: "/network" },
		{ text: "App", link: "/app" },
	],
	sidebar: {
		"/overview": [{ text: "Introduction", link: "/overview" }],
		"/protocol": [
			{ text: "Overview", link: "/protocol" },
			{ text: "Identity", link: "/protocol/identity" },
			{ text: "Data", link: "/protocol/data" },
			{ text: "Sync", link: "/protocol/sync" },
			{ text: "Transport", link: "/protocol/transport" },
		],
		"/network": [
			{ text: "Overview", link: "/network" },
			{ text: "Registry", link: "/network/registry" },
			{ text: "Index", link: "/network/indexing" },
			{ text: "Relay", link: "/network/relay" },
			{ text: "Discovery", link: "/network/discovery" },
		],
		"/app": [{ text: "Overview", link: "/app" }],
	},
	socials: [
		{
			icon: "x",
			link: "https://twitter.com/OBJECTS____",
		},
		{
			icon: "github",
			link: "https://github.com/objectshq",
		},
		{
			icon: "warpcast",
			link: "https://warpcast.com/objects",
		},
	],
});
