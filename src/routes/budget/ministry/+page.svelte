<script lang="ts">
    /** @type {import('./$types').PageData} */
    import * as Select from "$lib/components/ui/select";
    import * as Card from "$lib/components/ui/card/index.js";
    import { apiURL } from "$lib/utils/constants.js";
    import MultilinePlot from "$lib/components/chart/Multiline/MultilinePlot.svelte";
    export let data;
    let selectedAgency = "";
    let selectedID: number;
    let drillDownData: [] = [];
    let disableSelect = true;

    async function fetchDrillDown(selectedID) {
        const queryURL = apiURL + "/budget/" + selectedID;

        const res = await fetch(queryURL).then((res) => res.json());
        return res;
    }

    function fetchHandler() {
        fetchDrillDown(selectedAgency, selectedID).then((res) => {
            drillDownData = res;
        });
    }

    function selectMinistryHandler(agency) {
        selectedAgency = agency.value;
        selectedID = agency.label;
    }

    $: if (selectedAgency && selectedID) {
        fetchHandler();
    }
</script>

<div
    class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 mx-auto container"
>
    <div
        class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
    >
        <Card.Root class="col-span-2">
            <Card.Header>
                <Card.Title>Explore expenditure by Ministry</Card.Title>
                <Card.Description
                    >Drilldown Ministerial/Government Agency expenditure by
                    filtering on Agency</Card.Description
                >
            </Card.Header>
            <Card.Content>
                <div class="grid grid-cols-2 gap-10">
                    <div class="col-span-1">
                        <p class="text-sm pb-2">Ministry / Agency</p>
                        <Select.Root
                            typeahead={true}
                            onSelectedChange={(year) => {
                                selectMinistryHandler(year);
                            }}
                        >
                            <Select.Trigger>
                                <Select.Value placeholder="Select Agency" />
                            </Select.Trigger>
                            <Select.Content
                                class="overflow-y-auto max-h-[20rem]"
                                sideOffset={8}
                            >
                                {#each data.agencies as agency}
                                    <Select.Item
                                        value={agency.id}
                                        label={agency.name}
                                    >
                                        {agency.name}
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

{#if drillDownData.length > 0}
    <div class="mx-auto container pt-10">
        <MultilinePlot data={drillDownData} />
    </div>
{:else}
    <div class="mx-auto container pt-10">
        <div class="h-[600px] border rounded content-center">
            <p class=" text-center text-4xl">No data available</p>
        </div>
    </div>
{/if}
