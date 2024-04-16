<script lang="ts">
    /** @type {import('./$types').PageData} */
    import * as Select from "$lib/components/ui/select";
    import * as Card from "$lib/components/ui/card/index.js";
    import { apiURL } from "$lib/utils/constants.js";
    import * as d3 from "d3";
    import Dashboard from "$lib/components/MinistryDashboard/Dashboard.svelte";
    import { parseValue } from "$lib/components/MinistryDashboard/utils.js";

    export let data;
    let selectedAgency = "";
    let selectedID: number;
    let drillDownData: [] = [];
    let personnelData: [] = [];
    let projectData: [] = [];
    let filteredData: [];
    let disableSelect = true;
    let pivotExpenditureData = [];
    let pivotPersonnelData = [];
    let recentYear: number;

    // create weights for each value_type
    const weight = {
        ACTUAL: 1,
        ESTIMATED: 3,
        REVISED: 2,
    };
    // filter the data such that only the lowest value_type is selected for each year
    function filterData(data) {
        let res = d3.rollups(
            data,
            (v) => d3.min(v, (d) => weight[d.value_type]),
            (d) => d.value_year,
        );
        // use the result to filter the data on the weight
        return data.filter((d) => {
            return (
                res.find((r) => r[0] === d.value_year)[1] ===
                weight[d.value_type]
            );
        });
    }
    // group by and sum the value_amount
    function groupDataSum(data) {
        let res = [];
        let grouped = d3
            .rollups(
                data,
                (v) => d3.sum(v, (d) => d.value_amount),
                (d) => d.value_year,
                (e) => e.value_type,
            )
            .map(([value_year, value_amount]) => ({
                value_year,
                value_amount,
            }));

        grouped.forEach((d) => {
            res.push({
                value_year: d.value_year,
                value_amount: d.value_amount[0][1],
                value_type: d.value_amount[0][0],
            });
        });
        // sort the data by year
        res.sort((a, b) => a.value_year - b.value_year);
        return res;
    }

    $: filteredData = filterData(drillDownData);
    $: pivotExpenditureData = groupDataSum(filteredData);
    $: pivotPersonnelData = groupDataSum(personnelData);
    // create a function to retrieve the most recent year data
    function getMostRecentYearData(data) {
        return data.reduce((acc, curr) => {
            return acc.value_year > curr.value_year ? acc : curr;
        });
    }

    async function fetchExpenditureDrillDown(selectedID) {
        const queryURL = apiURL + "/budget/" + selectedID;

        const res = await fetch(queryURL).then((res) => res.json());
        return res;
    }

    async function fetchPersonnelDrillDown(selectedID) {
        const queryURL =
            apiURL + "/personnel?ministryID=" + selectedID + "&startYear=2019";

        const res = await fetch(queryURL).then((res) => res.json());
        return res;
    }

    async function fetchProjectDrillDown(selectedID) {
        const queryURL = apiURL + "/budget/projects/" + selectedID;

        const res = await fetch(queryURL).then((res) => res.json());
        return res;
    }

    function fetchHandler() {
        fetchExpenditureDrillDown(selectedAgency, selectedID).then((res) => {
            drillDownData = res;
        });
        recentYear =
            drillDownData.length > 0
                ? getMostRecentYearData(drillDownData).value_year
                : 2024;
        fetchPersonnelDrillDown(selectedAgency, selectedID).then((res) => {
            personnelData = filterData(res);
            personnelData = getProjectDiff(
                personnelData,
                "personnel_type",
                "category",
            );
        });
        fetchProjectDrillDown(selectedAgency, selectedID).then((res) => {
            projectData = filterData(res);
            projectData = getProjectDiff(
                projectData,
                "project_title",
                "parent_header",
            );
        });
    }

    // get difference from previous year as a percentage
    function getPercentageDiff(data) {
        let mostRecentYear = getMostRecentYearData(data);
        let previousYear = data.find(
            (d) => d.value_year === mostRecentYear.value_year - 1,
        );
        return (
            ((mostRecentYear.value_amount - previousYear.value_amount) /
                previousYear.value_amount) *
            100
        );
    }

    // get unique project titles
    function getUniqueKeys(data, field_name) {
        return [...new Set(data.map((d) => d[field_name]))];
    }
    // for each project title, get the difference from the previous year
    function getProjectDiff(data, field_name, header_name) {
        let uniqueKeys = getUniqueKeys(data, field_name);
        let res = [];
        let years = [...new Set(data.map((d) => d.value_year))];
        // loop through each year and get the difference
        uniqueKeys.forEach((key) => {
            let temp = data.filter((d) => d[field_name] === key);
            let tempRes = [];
            years.forEach((year) => {
                let tempYear = temp.find((d) => d.value_year === year);
                let tempPrevYear = temp.find((d) => d.value_year === year - 1);
                if (tempYear && tempPrevYear) {
                    tempRes.push({
                        project_title: key,
                        parent_header: tempYear[header_name],
                        value_amount: tempYear.value_amount,
                        value_type: tempYear.value_type,
                        perc_diff:
                            ((tempYear.value_amount -
                                tempPrevYear.value_amount) /
                                tempPrevYear.value_amount) *
                            100,
                        value_year: year,
                    });
                }
            });
            res = res.concat(tempRes);
        });

        return res;
    }

    // return up and down arrow based on percentage difference
    function getArrow(data) {
        let diff = getPercentageDiff(data);
        if (diff > 0) {
            return "↑";
        } else if (diff < 0) {
            return "↓";
        } else {
            return "";
        }
    }

    // depending on the difference, return the color
    function getArrowColor(data) {
        let diff = getPercentageDiff(data);
        if (diff > 0) {
            return "text-green-500";
        } else if (diff < 0) {
            return "text-red-500";
        } else {
            return "text-gray-500";
        }
    }

    function selectMinistryHandler(agency) {
        selectedAgency = agency.value;
        selectedID = agency.label;
    }

    //group drilldown by value_type and year and sum the value_amount

    $: if (selectedAgency && selectedID) {
        fetchHandler();
    }
    $: console.log(pivotPersonnelData);
</script>

<div
    class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 mx-auto container"
>
    <div
        class="grid gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-4"
    >
        <Card.Root class="col-span-4">
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
                            onSelectedChange={(agency) => {
                                selectMinistryHandler(agency);
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
        <div class="col-span-4">
            {#if drillDownData.length > 0}
                <Dashboard
                    expenditureData={pivotExpenditureData}
                    {personnelData}
                    {projectData}
                    title={selectedID}
                    subtitle="Expenditure by year"
                />
            {:else}
                <div
                    class="h-[600px] border rounded flex items-center justify-center"
                >
                    <p class="text-center text-4xl">No data available</p>
                </div>
            {/if}
        </div>

        <Card.Root class=" col-span-1">
            <Card.Header>
                <Card.Description
                    >Estd. Expenditure {#if pivotExpenditureData.length > 0}
                        ({getMostRecentYearData(pivotExpenditureData)
                            .value_year})
                    {/if}
                </Card.Description>
                <Card.Title class="text-4xl ">
                    {#if pivotExpenditureData.length > 0}
                        {d3
                            .format(
                                "$.3s",
                            )(getMostRecentYearData(pivotExpenditureData).value_amount)
                            .replace("G", "B")}
                    {:else}
                        No Agency Selected
                    {/if}
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <div class="text-xs text-muted-foreground">
                    {#if pivotExpenditureData.length > 0}
                        <span class={getArrowColor(pivotExpenditureData)}>
                            {getArrow(pivotExpenditureData)}{getPercentageDiff(
                                pivotExpenditureData,
                            ).toFixed(2)}%
                        </span>
                        from last year ({getMostRecentYearData(
                            pivotExpenditureData,
                        ).value_year - 1})
                    {:else}
                        No Agency Selected
                    {/if}
                </div>
            </Card.Content>
            <Card.Footer></Card.Footer>
        </Card.Root>
        <Card.Root class=" col-span-1">
            <Card.Header>
                <Card.Description
                    >Estd. Personnel Count {#if pivotPersonnelData.length > 0}
                        ({getMostRecentYearData(pivotPersonnelData).value_year})
                    {/if}
                </Card.Description>
                <Card.Title class="text-4xl ">
                    {#if pivotPersonnelData.length > 0}
                        {d3
                            .format(
                                ".2s",
                            )(getMostRecentYearData(pivotPersonnelData).value_amount)
                            .replace("G", "B")}
                    {:else}
                        No Agency Selected
                    {/if}
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <div class="text-xs text-muted-foreground">
                    {#if pivotPersonnelData.length > 0}
                        <span class={getArrowColor(pivotPersonnelData)}>
                            {getArrow(pivotPersonnelData)}{getPercentageDiff(
                                pivotPersonnelData,
                            ).toFixed(2)}%
                        </span>
                        from last year ({getMostRecentYearData(
                            pivotPersonnelData,
                        ).value_year - 1})
                    {:else}
                        No Agency Selected
                    {/if}
                </div>
            </Card.Content>
            <Card.Footer></Card.Footer>
        </Card.Root>
    </div>
</div>
