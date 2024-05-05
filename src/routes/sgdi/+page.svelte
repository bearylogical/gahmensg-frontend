<script lang="ts">
    /** @type {import('./$types').PageData} */
    import * as Select from "$lib/components/ui/select";
    import * as Card from "$lib/components/ui/card/index.js";
    import RadialTidyTree from "$lib/components/RadialTidyTree.svelte";
    import { apiURL } from "$lib/utils/constants";

    export let data;
    let selectedMinistry: string;
    let selectedMinistryId: number;
    let selectedData: [] = [];
    let focusElement: HTMLElement;

    let showLabels = false;
    let showNodes = false;
    let showTooltip = false;
    let showSelected = false;
    let strokeWidth = 3;

    // filter data based on selected ministry

    async function fetchMinistryLinks(id) {
        let response = await fetch(apiURL + `/sgdi/links/${id}`);
        let res = await response.json();
        return res;
    }

    async function handleSelect(e) {
        selectedMinistry = e.label;
        selectedMinistryId = e.value;
        fetchMinistryLinks(selectedMinistryId).then((res) => {
            selectedData = res;
        });
        focusElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
</script>

<div
    class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 mx-auto container pt-10"
>
    <div
        class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
    >
        <Card.Root class="col-span-2">
            <Card.Header>
                <Card.Title>Visualize the Government Directory</Card.Title>
                <Card.Description
                    >Drilldown government expenditure by filtering on year and
                    type</Card.Description
                >
            </Card.Header>
            <Card.Content>
                <div class="grid grid-cols-2 gap-10">
                    <div class="col-span-1">
                        <p class="text-sm pb-2">Ministry</p>
                        <Select.Root
                            typeahead={true}
                            onSelectedChange={(ministry) => {
                                handleSelect(ministry);
                            }}
                        >
                            <Select.Trigger>
                                <Select.Value placeholder="Select a Ministry" />
                            </Select.Trigger>
                            <Select.Content
                                class="overflow-y-auto"
                                sideOffset={8}
                            >
                                {#each data.ministries as opts}
                                    <Select.Item
                                        value={opts.id}
                                        label={opts.name}
                                    >
                                        {opts.name}
                                    </Select.Item>
                                {/each}
                            </Select.Content>
                        </Select.Root>
                    </div>
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</div>
<div class="mx-auto container pt-10" bind:this={focusElement}>
    {#if selectedData.length > 0}
        <div class="min-h-full border rounded content-center">
            <RadialTidyTree
                data={selectedData}
                {showLabels}
                {showNodes}
                {showTooltip}
                {showSelected}
                {strokeWidth}
            />
        </div>
    {:else}
        <div class="h-[900px] border rounded flex items-center justify-center">
            <p class="text-center text-4xl">No data available</p>
        </div>
    {/if}
</div>

<style>
</style>
