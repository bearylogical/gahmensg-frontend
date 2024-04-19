<script lang="ts">
    import AccordionContent from "../ui/accordion/accordion-content.svelte";
    import { chartOptions } from "./chart_options";
    import ExpenditureWidget from "./ExpenditureWidget.svelte";
    import Summary from "./Summary.svelte";
    import {
        getPercentageDiff,
        getMostRecentYearData,
        getTopNData,
        getMostRecentYearDataNoSum,
    } from "./utils";
    import * as d3 from "d3";

    export let expenditureData;
    export let personnelData;
    export let projectData;
    export let title;
    export let subtitle;

    let summaryProjectData: [];
    let summaryPersonnelData: [];

    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let series = [];
    // filter data of "actual" and create a series
    function groupData(data) {
        let series = [];
        let actual = data.filter((d) => d.value_type === "ACTUAL");
        let revised = data.filter((d) => d.value_type === "REVISED");
        let estimated = data.filter((d) => d.value_type === "ESTIMATED");
        // fetch all the unique years and sort
        let years = [...new Set(data.map((d) => d.value_year))].sort();

        let actualData = [];
        // sort actual data by year
        actual.sort((a, b) => a.value_year - b.value_year);
        // iterate through the actual data and create a series by available year
        for (let i = 0; i < years.length; i++) {
            let year = years[i];
            let value = actual.find((d) => d.value_year === year);
            if (value) {
                actualData.push([year, value.value_amount]);
            }
        }
        series.push({
            name: "Actual",
            data: actualData,
            color: color("ACTUAL"),
            type: "area",
        });
        series.push({
            name: "Revised",
            data: revised.map((d) => [d.value_year, d.value_amount]),
            color: color("REVISED"),
            type: "scatter",
        });
        series.push({
            name: "Estimated",
            data: estimated.map((d) => [
                d.value_year,
                d.value_amount.toString(),
            ]),
            color: color("ESTIMATED"),
            type: "scatter",
        });
        return series;
    }

    let chart_options = chartOptions;
    // $: chart_options.xaxis.categories = createXAxis(data);
    $: chart_options.series = groupData(expenditureData);
    $: summaryProjectData = getTopNData(
        getMostRecentYearDataNoSum(projectData),
        5,
    );
    $: summaryPersonnelData = getTopNData(
        getMostRecentYearDataNoSum(personnelData),
        5,
    );

    // $: console.log(getTopNData(getMostRecentYearDataNoSum(projectData), 5));
</script>

<div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
    <div class="col-span-1">
        <ExpenditureWidget
            chartOptions={chart_options}
            {title}
            {subtitle}
            changeValue={getPercentageDiff(expenditureData).toFixed(2)}
            changeSince={"from " +
                (getMostRecentYearData(expenditureData).value_year - 1)}
        />
    </div>
    <div class="col-span-1">
        <Summary
            personnelData={summaryPersonnelData}
            projectData={summaryProjectData}
        ></Summary>
    </div>
</div>
