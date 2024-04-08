<script lang="ts">
	import Chart from "./chart/Chart.svelte";
	import Tree from "./chart/Tree.svelte";
	import Tooltip from "./chart/Tooltip.svelte";
	import Title from "./chart/TreeTitle.svelte";
	import { toolTipData, hoverState } from "$lib/stores/hoverStore.js";
	import { selectedNodeState } from "$lib/stores/dataStore.js";
	import * as d3 from "d3";
	export let data: any;
	export let showLabels: boolean = true;
	export let showNodes: boolean = true;
	export let showTooltip: boolean = true;
	export let showSelected: boolean = true;
	export let strokeWidth: number = 3;

	let size: number;

	const width = 900;
	const height = width;
	const dimensions = {
		width,
		height,
		margin: {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10,
		},
	};
	function stratifyData(data) {
		return d3
			.stratify()
			.id((d) => d.child_url)
			.parentId((d) => d.parent_url)(data);
	}
	$: selectedData = stratifyData(data);

	function releaseHoveredState() {
		if (!$selectedNodeState) {
			hoverState.set(false);
			toolTipData.set({});
		}
	}

	$: titleText =
		$hoverState || $selectedNodeState
			? $toolTipData.data.data.child_name
			: selectedData.data.child_name;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="RadialTidyTree" on:mouseleave={() => releaseHoveredState()}>
	<Chart {dimensions} {titleText}>
		<Tree
			data={selectedData}
			{height}
			{width}
			{showLabels}
			{showNodes}
			{showSelected}
			{strokeWidth}
		/>
	</Chart>

	{#if $hoverState && showTooltip}
		<Tooltip data={$toolTipData} {width} />
	{/if}
</div>

<style>
	.RadialTidyTree {
		width: 100%;

		/* max-width: 100vw;
		max-height: 100vh; */
		/* margin: auto; */
	}
</style>
