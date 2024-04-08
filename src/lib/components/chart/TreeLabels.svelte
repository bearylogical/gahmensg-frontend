<script lang="ts">
	import * as d3 from 'd3';

	export let data: d3.tree.TreeLayout<any>;
	// $: console.log(data);
	$: descendants = data.descendants();
	// $: console.log(descendants);
</script>

{#each descendants as d}
	<!-- {#if d.children} -->
	<text
		class="Node__label"
		transform="rotate({(d.x * 180) / Math.PI - 90}) translate({d.y},0) rotate({d.x >= Math.PI
			? 180
			: 0})"
		dy="0.31em"
		x={d.x < Math.PI === !d.children ? 6 : -6}
		paint-order="stroke"
		stroke="white"
		fill="currentColor"
		text-anchor={d.x < Math.PI === !d.children ? 'start' : 'end'}
	>
		{d.data.id}
	</text>
	<!-- {/if} -->
{/each}

<style>
	.Node__label {
		stroke-linejoin: round;
		stroke-width: 3px;
		font: 2px sans-serif;
	}
</style>
