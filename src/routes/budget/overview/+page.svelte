<script lang="ts">
    import { onMount } from "svelte";
    import { fetchBudgetOverview } from "$lib/utils/handlers";
    import Treemap from "$lib/components/Treemap.svelte";

    let focusElement: HTMLElement;

    let budgetOverview: [] = [];
    onMount(async () => {
        // add delay to show loading state
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        budgetOverview = await fetchBudgetOverview("2024", "ESTIMATED");
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
</div>
