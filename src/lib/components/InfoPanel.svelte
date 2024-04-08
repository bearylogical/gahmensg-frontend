<script lang="ts">
	import * as Plot from '@observablehq/plot';
	import { fade } from 'svelte/transition';

	export let data = [];
	let div;
	$: {
		if (data.length > 0) {
			div?.firstChild?.remove(); // remove old chart, if any
			div?.append(
				Plot.plot({
					marginBottom: 60,
					y: { grid: true, label: 'Amount (in S$ million)' },
					x: {
						type: 'band',
						label: 'Financial Year',
						tickRotate: -30
					},
					color: { legend: true },
					marks: [
						Plot.rectY(data, {
							x: 'financial_year',
							y: 'amount',
							fill: 'type',
							tip: 'x'
						}),
						Plot.ruleY([0])
					]
				})
			); // add the new chart
		} else {
			div?.firstChild?.remove();
		}
	}
</script>

{#key data}
	<div in:fade={{ duration: 500 }} bind:this={div}></div>
{/key}
