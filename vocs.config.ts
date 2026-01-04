import { defineConfig } from "vocs";

export default defineConfig({
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
		accentColor: "#000000",
	},
	ogImageUrl: {
		"/": "https://vocs.dev/api/og?logo=%logo&title=%title&description=%description",
		"/introduction":
			"https://vocs.dev/api/og?logo=%logo&title=%title&description=%description",
	},
	iconUrl: {
		light: "/Logo-Color.svg",
		dark: "/Logo-Color.svg",
	},
	logoUrl: {
		light: "/Wordmark.svg",
		dark: "/Wordmark.svg",
	},
	sidebar: [
		{
			text: "Introduction",
			link: "/introduction",
		},
		{
			text: "Core Concepts",
			items: [
				{
					text: "Overview",
					link: "/core-concepts/overview",
				},
				{
					text: "Accounts",
					link: "/core-concepts/accounts",
				},
			],
		},
		{
			text: "Architecture",
			items: [
				{
					text: "Overview",
					link: "/architecture/overview",
				},
			],
		},
	],
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
