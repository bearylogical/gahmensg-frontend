<script lang="ts">
  import { onMount } from "svelte";
  import { fetchBudgetOverview } from "$lib/utils/handlers";
  import Treemap from "$lib/components/Treemap.svelte";

  let focusElement: HTMLElement;

  let budgetOverview: [] = [];
  onMount(async () => {
    // add delay to show loading state
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    budgetOverview = await fetchBudgetOverview("2025", "ESTIMATED");
  });
</script>

<div class="mx-auto container pt-10">
  {#await budgetOverview}
    <div>Loading...</div>
  {:then data}
    {#if budgetOverview.length > 0}
      <Treemap {data} />
    {:else}
      <div class="h-[600px] border rounded flex items-center">
        <div class="mx-auto">
          <p class="text-center text-4xl animate-pulse">Loading...</p>
        </div>
      </div>
    {/if}
  {:catch error}
    <div>Error: {error.message}</div>
  {/await}
  <div>
    <h3 class="text-2xl font-light">Data Source</h3>
    <span class="text-sm font-light text-gray-500 dark:text-gray-400"
      >Expenditure data is sourced from the <a
        class="text-blue-600 after:content-['_↗'] ..."
        href="https://www.mof.gov.sg/singaporebudget"
        target="_blank"
      >
        Ministry of Finance (MOF) Singapore Budget website
      </a>
    </span>
  </div>
</div>
