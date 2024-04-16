<script>
	export let data;
	export let width;

	let tooltipWidth;
	// $: console.log(data);
	// $: console.log(data);
	const xNudge = 5;
	const yNudge = 15;

	$: x = data.event.layerX;
	$: y = data.event.layerY;

	$: xPosition = x + tooltipWidth > width ? x - tooltipWidth - xNudge : x + xNudge;
	$: yPosition = y + yNudge;
</script>

<div
	class="tooltip"
	style="top: {yPosition}px ; left: {xPosition}px;"
	bind:clientWidth={tooltipWidth}
>
	<h1>{data.data.id}</h1>
	<h2>Text Description:</h2>
</div>

<style>
	.tooltip {
		position: absolute;
		background: white;
		box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 8px; /* Gives a nice 3d effect */
		padding: 8px 6px; /* Adds space around content within tooltip */
		border-radius: 3px; /* Rounds corners */
		pointer-events: none; /* Prevents tooltip from blocking mouse events */
		transition:
			top 300ms ease,
			left 300ms ease;
	}
	h1 {
		margin: 0;
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 3px;
	}
	h2 {
		font-size: 0.8rem;
		font-weight: 300;
		text-transform: uppercase;
	}
</style>
