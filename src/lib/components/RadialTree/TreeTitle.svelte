<script lang="ts">
	import { onMount } from "svelte";
	import { zoomStore } from "$lib/stores/dataStore.js";
	import { fade } from "svelte/transition";
	import { cubicIn, cubicOut } from "svelte/easing";
	import { min } from "d3";
	export let titleText: any;
	export let height: number;
	export let width: number;

	const maxFontSize = 20;
	let fontSize = Math.min(
		Math.min(window.innerWidth, window.innerHeight) * 0.2,
		maxFontSize,
	);
	onMount(() => {
		const resize = () => {
			fontSize = Math.min(
				Math.min(window.innerWidth, window.innerHeight) * 0.2,
				maxFontSize,
			); // Adjust the multiplier as needed
		};

		window.addEventListener("resize", resize);
		return () => {
			window.removeEventListener("resize", resize);
		};
	});

	$: ({ k, x, y } = $zoomStore || { k: 1, x: 0, y: 0 });
	let minZoom = 1;

	$: k = min([k, minZoom]);

	// $: console.log($zoomStore);

	let lines;
	$: {
		const segments = titleText.split(":");
		const wordsPerLine = 15;
		lines = [];
		for (let segment of segments) {
			const words = segment.split(" ");
			for (let i = 0; i < words.length; i += wordsPerLine) {
				lines.push(
					words
						.slice(i, i + wordsPerLine)
						.join(" ")
						.trimStart(),
				);
			}
		}
	}
</script>

{#key text}
	<text in:fade={{ duration: 300, delay: 50, easing: cubicIn }}>
		{#each lines as line, i}
			<tspan
				id="SGDItitle"
				y="-45%"
				x="-40%"
				dy={i > 0 ? "1.2em" : 0}
				class={i > 0
					? "inline text-md font-light fill-gray-400 dark:fill-white-600 "
					: "inline text-xl font-bold fill-black dark:fill-white-800"}
				>{line}
			</tspan>
		{/each}
	</text>
{/key}

<style>
</style>
