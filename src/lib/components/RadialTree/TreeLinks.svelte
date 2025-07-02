<script lang="ts">
  import * as d3 from "d3";
  import { cubicIn, cubicOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { draw } from "svelte/transition";
  import { toolTipData, hoverState } from "$lib/stores/hoverStore.js";
  import { dataStore, selectedNodeState } from "$lib/stores/dataStore.js";
  export let data: d3.tree.TreeLayout<any>;
  export let maxStrokeWidth = 3;
  const linkGenerator = d3
    .linkRadial()
    .angle((d: { x: any }) => d.x)
    .radius((d: { y: any }) => d.y);
  $: links = data.links();

  $: strokeWidth = Math.min(
    Math.min(window.innerWidth, window.innerHeight) * 0.015,
    maxStrokeWidth
  ); // Adjust the multiplier as needed

  onMount(() => {
    const resize = () => {
      strokeWidth = Math.min(
        Math.min(window.innerWidth, window.innerHeight) * 0.005,
        maxStrokeWidth
      ); // Adjust the multiplier as needed
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  // retrive current theme from local storage
  let theme = localStorage.getItem("color-theme") || "light";
  // $: console.log(theme);
</script>

{#each links as link}
  {#if $hoverState || $selectedNodeState}
    {#if ($toolTipData._ancestors.some((e) => e.data.id === link.source.data.id) && $toolTipData._ancestors.some((e) => e.data.id === link.target.data.id)) || ($toolTipData._descendants.some((e) => e.data.id === link.source.data.id) && $toolTipData._descendants.some((e) => e.data.id === link.target.data.id))}
      <path
        in:draw={{ duration: 300, delay: 50, easing: cubicIn }}
        out:draw={{ duration: 300, delay: 50, easing: cubicOut }}
        class="link"
        style={`stroke-width: ${strokeWidth}px;`}
        d={linkGenerator(link)}
      />

      <!-- color the parent and child notes on hover but ignores it when is selected-->
    {:else}
      <path
        class="link"
        d={linkGenerator(link)}
        opacity="0.08"
        style={`stroke-width: ${strokeWidth}px;`}
      />
    {/if}
  {:else}
    <path
      class="link"
      style={`stroke-width: ${strokeWidth}px;`}
      d={linkGenerator(link)}
    />
  {/if}

  <!-- {/if} -->
{/each}

<style>
  .link {
    fill: none;
    stroke: #555;
    stroke-opacity: 0.2;
    transition:
      top 300ms ease,
      left 300ms ease;
  }
</style>
