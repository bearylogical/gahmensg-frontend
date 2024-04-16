<script lang="ts">
	import * as d3 from "d3";
	import { cubicOut, cubicIn } from "svelte/easing";
	import { fade } from "svelte/transition";
	import { toolTipData, hoverState } from "$lib/stores/hoverStore.js";
	import { dataStore, selectedNodeState } from "$lib/stores/dataStore.js";
	export let data: d3.tree.TreeLayout<any>;
	export let showNodes = true;
	export let showSelected = true;
	// let hoveredData;
	// $: console.log(hoveredData);
	$: descendants = data.descendants().map((d) => {
		d.isActive = false;
		d.isSelected = false;
		return d;
	});

	function setHoveredData(d, event) {
		if (!$selectedNodeState) {
			d.event = event;
			d._ancestors = d.ancestors();
			d._descendants = d.descendants();
			d.isActive = true;
			toolTipData.set(d);
			hoverState.set(true);
		}

		// console.log($toolTipData);
		// console.log(d.ancestors());
	}
	function releaseHoveredState() {
		hoverState.set(false);
		toolTipData.set({});
	}

	function onClickCollapseExpand(d) {
		let _data = data.each((node) => {
			if (node.data.id === d.data.id) {
				if (node.children) {
					collapse(node);
				} else {
					expand(node);
				}
			}
		});

		dataStore.set(_data);
		// console.log(node);
	}

	function onClickSetActive() {
		if ($selectedNodeState) {
			selectedNodeState.set(false);
		} else {
			selectedNodeState.set(true);
			hoverState.set(false);
		}

		// dataStore.set(_data);
	}

	function expand(d) {
		if (d._children) {
			d.children = d._children;
			d.children.forEach(expand);
			d._children = null;
		}
		// Collapse nodes
	}
	function collapse(d) {
		if (d.children) {
			d._children = d.children;
			d._children.forEach(collapse);
			d.children = null;
		}
	}

	function fillCircle(d, activeToolTipData) {
		if (
			$selectedNodeState &&
			activeToolTipData.data.id === d.data.id &&
			showSelected
		) {
			return "#D71313";
		}
		if (activeToolTipData._ancestors.some((e) => e.data.id === d.data.id)) {
			if (d.children) {
				return "#555";
			} else {
				return "#555";
			}
		} else {
			return "#999";
		}
	}

	function opacityCircle(d, activeToolTipData) {
		if (
			activeToolTipData._ancestors.some((e) => e.data.id === d.data.id) ||
			activeToolTipData._descendants.some((e) => e.data.id === d.data.id)
		) {
			return 1;
		} else {
			return 0.1;
		}
	}

	function setRadius(d, activeToolTipData) {
		if (
			(($selectedNodeState || $hoverState) &&
				activeToolTipData._ancestors.some(
					(e) => e.data.id === d.data.id,
				)) ||
			activeToolTipData._descendants.some((e) => e.data.id === d.data.id)
		) {
			// console.log(d);
			return 5 / d.depth;
		}
		if (d.children) {
			return 2.5;
		} else {
			return 1;
		}
	}
</script>

{#key $selectedNodeState}
	{#each descendants as d}
		{#if $hoverState || $selectedNodeState}
			<circle
				in:fade={{ duration: 800, delay: 300, easing: cubicIn }}
				out:fade={{ duration: 800, delay: 300, easing: cubicOut }}
				transform="rotate({(d.x * 180) / Math.PI -
					90}) translate({d.y},0)"
				fill={fillCircle(d, $toolTipData)}
				opacity={opacityCircle(d, $toolTipData)}
				r={setRadius(d, $toolTipData)}
			/>
		{:else}
			<circle
				transform="rotate({(d.x * 180) / Math.PI -
					90}) translate({d.y},0)"
				fill={showNodes ? "#999" : "none"}
				r={d.children ? 2.5 : 1}
			/>
		{/if}

		{#if d.ancestors().length === 1}
			<circle
				transform="rotate({(d.x * 180) / Math.PI -
					90}) translate({d.y},0)"
				fill="#555"
				r="10"
			/>
		{/if}
		<!-- create the invisible tool tip region -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<circle
			transform="rotate({(d.x * 180) / Math.PI - 90}) translate({d.y},0)"
			fill-opacity="0"
			r="6"
			on:mouseover={(event) => {
				setHoveredData(d, event);
			}}
			on:focus={(event) => setHoveredData(d, event)}
			on:click={() => onClickSetActive(d)}
		/>
	{/each}
{/key}

<!-- {#if $hoverState}
	{#each $toolTipData.ancestors() as d}
		<circle transform="rotate({(d.x * 180) / Math.PI - 90}) translate({d.y},0)" fill="#999" r="6" />
	{/each}
{/if} -->

<style>
</style>
