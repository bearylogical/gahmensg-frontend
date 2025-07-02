<script lang="ts">
  import AccordionContent from "../ui/accordion/accordion-content.svelte";
  import { chartOptions } from "./chart_options";
  import ExpenditureWidget from "./ExpenditureWidget.svelte";
  import Summary from "./Summary.svelte";
  import { Card } from "flowbite-svelte";
  import {
    getPercentageDiff,
    getMostRecentYearData,
    getTopNData,
    getMostRecentYearDataNoSum,
  } from "./utils";
  import * as d3 from "d3";
  import ProgrammeTreemap from "./ProgrammeTreemap.svelte";
  import PersonnelTreemap from "./PersonnelTreemap.svelte";
  import PersonnelDataTable from "./PersonnelDataTable.svelte";
  import ProjectTreemap from "./ProjectTreemap.svelte";
  import ProjectDataTable from "./ProjectDataTable.svelte";

  export let expenditureData;
  export let personnelData;
  export let projectData;
  export let programmesData;
  export let title;
  export let subtitle;
  export let selectedAgency: string;
  export let selectedID: number;
  export let fetchHandler: (
    selectedAgency: string,
    year: number | null
  ) => void;

  let selectedChartYear: number | null = null;

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
      data: estimated.map((d) => [d.value_year, d.value_amount.toString()]),
      color: color("ESTIMATED"),
      type: "scatter",
    });
    return series;
  }
  let currentYearData: number;
  let chart_options = chartOptions;
  let transformedPersonnelData;
  let transformedProjectData;
  let transformedProgrammesData;
  let hierarchyProjectData;
  $: currentYearData = getMostRecentYearData(expenditureData)?.value_year;
  $: if (
    selectedAgency !== null &&
    selectedID !== null &&
    selectedChartYear !== null
  ) {
    fetchHandler(selectedAgency, selectedChartYear);
  } else if (selectedAgency !== null && selectedID !== null) {
    fetchHandler(selectedAgency, null);
  }

  $: if (selectedChartYear) {
    transformedPersonnelData = personnelData.filter(
      (d) => d.value_year === selectedChartYear
    );
    transformedProjectData = projectData.filter(
      (d) => d.value_year === selectedChartYear
    );
    transformedProgrammesData = programmesData.filter(
      (d) => d.value_year === selectedChartYear
    );
  } else {
    transformedPersonnelData = getMostRecentYearDataNoSum(personnelData);
    transformedProjectData = getMostRecentYearDataNoSum(projectData);
    transformedProgrammesData = getMostRecentYearDataNoSum(programmesData);
  }
  // $: chart_options.xaxis.categories = createXAxis(data);
  $: chart_options.series = groupData(expenditureData);
  $: summaryProjectData = getTopNData(transformedProjectData, 5);
  $: summaryPersonnelData = getTopNData(transformedPersonnelData, 5);
  // $: console.log(transformedProgrammesData);
  // $: console.log(getTopNData(getMostRecentYearDataNoSum(projectData), 5));

  function handleChartYearClick(year: number) {
    selectedChartYear = year;
  }
</script>

<div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
  <div class="lg:col-span-1 col-span-2">
    <ExpenditureWidget
      chartOptions={chart_options}
      {title}
      {subtitle}
      changeValue={getPercentageDiff(expenditureData).toFixed(2)}
      changeSince={"from " + (currentYearData - 1)}
      on:yearClick={(event) => handleChartYearClick(event.detail)}
    />
  </div>
  <div class="lg:col-span-1 col-span-2">
    <Summary
      personnelData={summaryPersonnelData}
      projectData={summaryProjectData}
    ></Summary>
  </div>
  <div class="col-span-2 border shadow-md rounded-lg">
    <h2 class="text-2xl font-bold pl-6 pt-6">
      Programme Expenditure ({selectedChartYear || currentYearData})
    </h2>
    <p class="text-base font-light pl-6 text-gray-500 dark:text-gray-400">
      Overview of <span class="italic underline">estimated</span> programme expenditure,
      sorted by amount.
    </p>
    <hr class="h-px my-6 bg-gray-200 border-0" />
    <div class="pl-4 pr-4">
      {#if transformedProgrammesData.length > 0}
        <ProgrammeTreemap data={transformedProgrammesData} />
      {:else}
        <div class="p-2">
          <ProjectDataTable data={transformedProgrammesData} />
        </div>
      {/if}
    </div>
  </div>
  <div class="col-span-2 border shadow-md rounded-lg">
    <h2 class="text-2xl font-bold pl-6 pt-6">
      Project Expenditure ({selectedChartYear || currentYearData})
    </h2>
    <p class="text-base font-light pl-6 text-gray-500 dark:text-gray-400">
      Overview of <span class="italic underline">estimated</span> project expenditure,
      sorted by amount.
    </p>
    <hr class="h-px my-6 bg-gray-200 border-0" />
    <div class="pl-4 pr-4">
      {#if transformedProjectData.length > 0}
        <ProjectTreemap data={transformedProjectData} />
      {:else}
        <div class="p-2">
          <ProjectDataTable data={transformedProjectData} />
        </div>
      {/if}
    </div>
  </div>
  <div class="col-span-2 border shadow-md rounded-lg">
    <h2 class="text-2xl font-bold pl-6 pt-6">
      Personnel Counts ({selectedChartYear || currentYearData})
    </h2>
    <p class="text-base font-light pl-6 text-gray-500 dark:text-gray-400">
      Overview of <span class="italic underline">estimated</span> headcount by category,
      arranged by number of personnel.
    </p>
    <hr class="h-px my-6 bg-gray-200 border-0" />
    <div class="pl-4 pr-4">
      {#if transformedPersonnelData.length > 0}
        <PersonnelTreemap data={transformedPersonnelData} />
      {:else}
        <div class="p-2">
          <PersonnelDataTable data={transformedPersonnelData} />
        </div>
      {/if}
    </div>
  </div>
</div>

