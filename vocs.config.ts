import { defineConfig } from "vocs";

export default defineConfig({
	baseUrl: "https://objects.foundation",
	basePath: "/docs",
	title: "OBJECTS Docs",
	description: "Build user friendly physical design apps with OBJECTS",
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
			{ text: "Data Model", link: "/protocol/data-model" },
			{ text: "Operations", link: "/protocol/operations" },
			{ text: "History", link: "/protocol/history" },
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
