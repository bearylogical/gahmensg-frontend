<script lang="ts">
    /** @type {import('./$types').PageData} */
    import * as Select from "$lib/components/ui/select";
    import * as Card from "$lib/components/ui/card/index.js";
    import Treemap from "$lib/components/chart/Treemap.svelte";
    import { apiURL } from "$lib/utils/constants.js";
    export let data;
    let selectedYear = "";
    let availOpts: [];
    let drillDownData: [] = [];
    let selectedExpenditure = "";
    let disableSelect = true;

    async function fetchDrillDown(selectedYear, selectedExpenditure) {
        const queryURL =
            apiURL +
            "/budget?" +
            new URLSearchParams({
                valueType: selectedExpenditure,
                valueYear: selectedYear,
            });
        const res = await fetch(queryURL).then((res) => res.json());
        return res;
    }

    function fetchHandler() {
        fetchDrillDown(selectedYear, selectedExpenditure).then((res) => {
            drillDownData = res;
        });
    }

    function selectYearHandler(year) {
        selectedYear = year;
        availOpts = data.consolidatedOptionsArr.find(
            (yearOpts) => yearOpts.year == selectedYear,
        )?.options;
        disableSelect = false;
    }

    $: if (selectedYear && selectedExpenditure) {
        fetchHandler();
    }
    $: console.log(availOpts);
</script>

<div
    class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 mx-auto container"
>
    <div
        class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
    >
        <Card.Root class="col-span-2">
            <Card.Header>
                <Card.Title>Explore expenditure by year and type</Card.Title>
                <Card.Description
                    >Drilldown government expenditure by filtering on year and
                    type</Card.Description
                >
            </Card.Header>
            <Card.Content>
                <div class="grid grid-cols-2 gap-10">
                    <div class="col-span-1">
                        <p class="text-sm pb-2">Expenditure Year</p>
                        <Select.Root
                            typeahead={true}
                            onSelectedChange={(year) => {
                                selectYearHandler(year.value);
                            }}
                        >
                            <Select.Trigger>
                                <Select.Value placeholder="Select a year" />
                            </Select.Trigger>
                            <Select.Content
                                class="overflow-y-auto max-h-[10rem]"
                                sideOffset={8}
                            >
                                {#each data.consolidatedOptionsArr as opts}
                                    <Select.Item
                                        value={opts.year}
                                        label={opts.year}
                                    >
                                        {opts.year}
                                    </Select.Item>
                                {/each}
                            </Select.Content>
                        </Select.Root>
                    </div>
                    <div class="col-span-1">
                        <p class="text-sm pb-2">Expenditure Type</p>
                        <Select.Root
                            disabled={disableSelect}
                            onSelectedChange={(opt) =>
                                (selectedExpenditure = opt.value)}
                        >
                            <Select.Trigger>
                                <Select.Value
                                    placeholder={disableSelect
                                        ? "Select a year first"
                                        : availOpts
                                          ? "Select an option"
                                          : "No options available"}
                                />
                            </Select.Trigger>
                            {#if availOpts}
                                <Select.Content>
                                    {#each availOpts as opts}
                                        <Select.Item value={opts} label={opts}>
                                            {opts}
                                        </Select.Item>
                                    {/each}
                                </Select.Content>
                            {/if}
                        </Select.Root>
                    </div>
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</div>

{#if drillDownData.length > 0}
    <div class="mx-auto container pt-10">
        <Treemap data={drillDownData} />
    </div>
{:else}
    <div class="mx-auto container pt-10">
        <div class="h-[600px] border rounded content-center">
            <p class=" text-center text-4xl">No data available</p>
        </div>
    </div>
{/if}
