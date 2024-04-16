<script lang="ts">
	import * as d3 from "d3";
	import { dataStore } from "$lib/stores/dataStore.js";
	import { hoverState, toolTipData } from "$lib/stores/hoverStore.js";
	import Links from "./TreeLinks.svelte";
	import Nodes from "./TreeNodes.svelte";
	import Labels from "./TreeLabels.svelte";

	export let data: d3.hierarchy;
	export let height: number;
	export let width: number;
	export let showLabels: boolean = true;
	export let showNodes: boolean = true;
	export let showSelected: boolean = true;
	export let strokeWidth: number = 3;

	let radius = Math.min(width, height) / 2;

	const tree = d3
		.tree()
		.size([2 * Math.PI, radius])
		.separation(
			(a: { parent: any; depth: number }, b: { parent: any }) =>
				(a.parent == b.parent ? 1 : 2) / a.depth,
		);
	$: dataStore.set(d3.hierarchy(data));

	let treeRoot = tree(d3.hierarchy({}));
	$: treeRoot = tree($dataStore).sort(
		(a: { data: { name: any } }, b: { data: { name: any } }) =>
			d3.ascending(a.data.name, b.data.name),
	);
</script>

{#key data}
	<Links data={treeRoot} maxStrokeWidth={strokeWidth} />

	<Nodes data={treeRoot} {showNodes} {showSelected} />

	{#if showLabels}
		<Labels data={treeRoot} />
	{/if}
{/key}

<style>
</style>
