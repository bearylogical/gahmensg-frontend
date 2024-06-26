<script lang="ts">
	import { onMount } from "svelte";
	import { zoomStore } from "$lib/stores/dataStore.js";
	import { zoom, zoomIdentity } from "d3-zoom";
	import { select } from "d3-selection";
	import { Button, Popover } from "flowbite-svelte";
	import { toolTipData, hoverState } from "$lib/stores/hoverStore.js";
	import Title from "./TreeTitle.svelte";
	import d3ToPng from "d3-svg-to-png";
	import { getDateTimeString } from "$lib/utils/exporter.js";
	import { fade } from "svelte/transition";
	import * as d3 from "d3";

	export let dimensions: any;
	export let titleText: string;
	let placement;

	let svg;
	let g;

	const zoomFunction = zoom()
		.scaleExtent([0.5, 8])
		.translateExtent([
			[0, 0],
			[dimensions.width, dimensions.height],
		]);

	onMount(() => {
		if (svg && g) {
			select(svg).call(
				// @ts-ignore
				zoomFunction
					.filter((event) => {
						// only allow scroll mouse wheel
						if (event.type == "wheel") return true;
						return false;
					})
					.on("zoom", handleZoom),
			);
		}
	});

	function handleZoom(event) {
		const { k, x, y } = event.transform;
		zoomStore.set({ k, x, y });
		// 	select(g).attr("transform", `sca
		select(g).attr("transform", `scale(${event.transform.k}) `);
	}

	function resetZoom() {
		select(svg)
			.transition()
			.duration(600)
			.call(zoomFunction.transform, zoomIdentity);
	}

	// select(g).attr(
	// 	"transform",
	// 	`translate(${event.transform.x}, ${event.transform.y}) scale(${event.transform.k})`,
	// );

	function exportToPng(filename: string) {
		const formattedFilename = filename.replace(/ /g, "_");
		const finalFilename = `${formattedFilename}_${getDateTimeString()}`;

		d3ToPng(svg, finalFilename, {
			download: true,
			background: "white",
		});
	}
</script>

<div class="grid grid-cols-5 gap-5 p-5">
	<div>
		<Button
			color="alternative"
			on:click={() => exportToPng(titleText)}
			className="hover:bg-gray-800">Export Image</Button
		>
	</div>
	<div class="col-start-6">
		<Button
			color="alternative"
			id="placement-bottom"
			on:mouseenter={() => (placement = "bottom")}>How to use?</Button
		>
		<Popover
			class="w-64 text-sm font-light "
			title="Using DirectoryExplorer"
			triggeredBy="[id^='placement-']"
			{placement}
			>Scroll to zoom. <br /> Double click to reset zoom. <br /> Hover over
			the visualization to view details.
		</Popover>
	</div>
</div>

<!-- <button class="export" on:click={() => exportToPng(titleText)}>Export</button> -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg
	class="Chart"
	height={dimensions.height}
	width={dimensions.width}
	bind:this={svg}
	on:dblclick={resetZoom}
>
	<g
		in:fade={{ duration: 400 }}
		out:fade={{ duration: 200 }}
		transform={`translate(` +
			dimensions.width / 2 +
			"," +
			dimensions.height / 2 +
			`)`}
	>
		<g bind:this={g} on:dblclick={resetZoom}>
			<slot />
		</g>
		<g>
			<Title
				{titleText}
				height={dimensions.height}
				width={dimensions.width}
			/>
		</g>
		<g>
			<text x="10%" y="40%">
				<tspan fill="gray" class="font-light italic">
					Generated by GahmenExplorer
				</tspan>
			</text>
		</g>
	</g>
</svg>

<style>
	.export {
		margin-top: 0;
		margin-bottom: 0;
	}
	.Chart {
		display: block;
		margin: auto;
	}
</style>
