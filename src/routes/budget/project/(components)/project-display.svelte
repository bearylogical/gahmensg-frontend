<script lang="ts">
    import ExpenditureWidget from "./ExpenditureWidget.svelte";
    import { getPercentageDiff } from "$lib/components/MinistryDashboard/utils";
    import { type Project, type ProjectRecord } from "$lib/stores/projectStore";
    import * as d3 from "d3";

    export let chart_options;
    export let expenditureData: Project;
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    $: chart_options.chart.animations = {
        enabled: false,
    };

    function ffillData(data: ProjectRecord[], years: number[]) {
        let ffilledData: [] = [];
        for (let i = 0; i < years.length; i++) {
            let year = years[i];
            let value = data.find((d) => d.value_year === year);
            if (value) {
                ffilledData.push([year, value.value_amount]);
            } else {
                ffilledData.push([year, null]);
            }
        }
        return ffilledData;
    }

    function groupData(data: ProjectRecord[]) {
        let series = [];
        let actual = data.filter((d) => d.value_type === "ACTUAL");
        let revised = data.filter((d) => d.value_type === "REVISED");
        let estimated = data.filter((d) => d.value_type === "ESTIMATED");
        // fetch all the unique years and sort
        let years = [...new Set(data.map((d) => d.value_year))].sort();

        let actualData = [];
        // sort actual data by year
        actual.sort((a, b) => a.value_year - b.value_year);
        // sort revised data by year
        revised.sort((a, b) => a.value_year - b.value_year);
        // sort estimated data by year
        estimated.sort((a, b) => a.value_year - b.value_year);
        // iterate through the actual data and create a series by available year
        // for (let i = 0; i < years.length; i++) {
        //     let year = years[i];
        //     let value = actual.find((d) => d.value_year === year);
        //     if (value) {
        //         actualData.push([year, value.value_amount]);
        //     }
        // }
        series.push({
            name: "Actual",
            data: ffillData(actual, years),
            color: color("ACTUAL"),
            type: "area",
        });
        series.push({
            name: "Revised",
            data: ffillData(revised, years),
            color: color("REVISED"),
            type: "scatter",
        });
        series.push({
            name: "Estimated",
            data: ffillData(estimated, years),
            color: color("ESTIMATED"),
            type: "scatter",
        });
        return series;
    }
    

    $: chart_options.series = groupData(expenditureData.values);
</script>

<ExpenditureWidget
    chartOptions={chart_options}
    title={expenditureData.project_title}
    subtitle={expenditureData.ministry}
    changeValue={getPercentageDiff(expenditureData.values).toFixed(2)}
    changeSince={"from " + expenditureData.recentYear}
/>
