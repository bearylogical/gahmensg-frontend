<script lang="ts">
    import { onMount } from "svelte";
    import { fetchBudgetOverview } from "$lib/utils/handlers";
    import Treemap from "$lib/components/Treemap.svelte";

    let focusElement: HTMLElement;

    let budgetOverview: [] = [];
    onMount(async () => {
        budgetOverview = await fetchBudgetOverview("2024", "ESTIMATED");
    });
</script>

<div class="mx-auto container pt-10">
    {#if budgetOverview.length > 0}
        <Treemap data={budgetOverview} />
    {:else}
        <div class="h-[600px] border rounded flex items-center justify-center">
            <p class="text-center text-4xl">No data available</p>
        </div>
    {/if}
</div>
