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
	// iconUrl: {
	// 	light: "/logo.svg",
	// 	dark: "/logo.svg",
	// },
	// logoUrl: {
	// 	light: "/logo.svg",
	// 	dark: "/logo.svg",
	// },
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
			icon: "github",
			link: "https://github.com/objectshq",
		},
		{
			icon: "x",
			link: "https://twitter.com/objectsvision",
		},
		{
			icon: "warpcast",
			link: "https://warpcast.com/objects",
		},
	],
});
