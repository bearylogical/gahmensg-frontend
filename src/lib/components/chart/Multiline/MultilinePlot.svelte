<script lang="ts">
    import AccordionContent from "$lib/components/ui/accordion/accordion-content.svelte";
    import * as Plot from "@observablehq/plot";
    import { fade } from "svelte/transition";
    import * as d3 from "d3";
    export let data: any;

    let actualData: [];
    let estimatedData: [];
    let revisedData: [];
    console.log(data);
    function filterData(data, valueType) {
        return data
            .filter((d) => d.value_type === valueType)
            .sort((a, b) => a.value_year - b.value_year);
    }

    function subsetData(data) {
        const valueTypes = ["ACTUAL", "ESTIMATED", "REVISED"];
        const groupedData = valueTypes.map((valueType) => ({
            value_type: valueType,
            data: groupDataSum(filterData(data, valueType)),
        }));

        groupedData.forEach(({ value_type, data }) => {
            data.forEach((d) => {
                d.value_type = value_type;
            });
        });

        [actualData, estimatedData, revisedData] = groupedData.map(
            ({ data }) => data,
        );
    }

    function groupDataSum(data) {
        return d3
            .rollups(
                data,
                (v) => d3.sum(v, (d) => d.value_amount),
                (d) => d.value_year,
            )
            .map(([value_year, value_amount]) => ({
                value_year,
                value_amount,
            }));
    }

    // filter out only value_type of "ACTUAL"
    $: subsetData(data);
    $: console.log(actualData);

    let div;
    $: {
        if (data.length > 0) {
            div?.firstChild?.remove(); // remove old chart, if any
            div?.append(
                Plot.plot({
                    className: "Multiplot",
                    style: {
                        width: 800,
                    },
                    marginBottom: 50,
                    marginLeft: 100,
                    y: {
                        grid: true,
                        tickFormat: "$,f",

                        label: "Amount (in SGD$)",
                    },
                    x: {
                        tickFormat: "",
                        paddingOuter: 0.2,
                        label: "Year",
                    },

                    color: {
                        legend: true,
                        domain: ["ACTUAL", "ESTIMATED", "REVISED"],
                        scheme: "category10",
                        type: "categorical",
                    },
                    marks: [
                        Plot.ruleY([0]),
                        Plot.barY(actualData, {
                            x: "value_year",
                            y: "value_amount",
                            fill: "value_type",
                        }),
                        Plot.lineY(estimatedData, {
                            x: "value_year",
                            y: "value_amount",
                            stroke: "value_type",
                            strokeWidth: 3,
                            strokeOpacity: 0.4,
                            curve: "natural",
                        }),
                        Plot.lineY(revisedData, {
                            x: "value_year",
                            y: "value_amount",
                            stroke: "value_type",
                            curve: "natural",
                            strokeOpacity: 0.7,
                            strokeWidth: 3,
                        }),
                        Plot.do,
                    ],
                }),
            ); // add the new chart
        } else {
            div?.firstChild?.remove();
        }
    }
</script>

<div class="h-[600px] border rounded">
    {#key data}
        <div
            in:fade={{ duration: 200 }}
            bind:this={div}
            class="grid place-items-center h-full size-[100%]"
        ></div>
    {/key}
</div>

<style>
    .Multiplot {
        margin: 0 auto;
        font-family: "ui-sans-serif";
    }
</style>
