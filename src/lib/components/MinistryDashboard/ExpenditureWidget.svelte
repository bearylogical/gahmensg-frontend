<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import ChangeText from "./ChangeText.svelte";
  import type { ApexOptions } from "apexcharts";
  import { Card, Heading, Chart } from "flowbite-svelte";

  export let title: string = "";
  export let subtitle: string = "";
  export let chartOptions: ApexOptions;
  export let changeValue: number = 0;
  export let changeSince: string = "";

  const dispatch = createEventDispatcher();

  // Add chart events for both x-axis labels and data points
  $: if (chartOptions) {
    chartOptions.chart = {
      ...chartOptions.chart,
      events: {
        ...chartOptions.chart?.events,
        dataPointSelection: (event, chartContext, config) => {
          const { dataPointIndex, seriesIndex } = config;
          const series = chartContext.w.config.series[seriesIndex];
          const dataPoint = series.data[dataPointIndex];

          // Assuming the data point is a year, convert it to a number
          const year = parseInt(dataPoint, 10);
          // console.log(`Year clicked: ${year}`);
          if (!isNaN(year)) {
            dispatch("yearClick", year);
          }
        },
      },
    };

    // Keep your existing x-axis label click handler
    if (chartOptions.xaxis) {
      chartOptions.xaxis.labels = {
        ...(chartOptions.xaxis.labels || {}),
        events: {
          click: (event, chartContext, config) => {
            const clickedCategory =
              config.xaxis.categories[config.dataPointIndex];
            const year = Number(clickedCategory);
            if (!isNaN(year)) {
              dispatch("yearClick", year);
            }
          },
        },
      };
    }
  }
</script>

<Card size="xl" class="h-full">
  <div class="mb-6 flex items-center justify-between">
    <div class="flex-shrink-0">
      <Heading tag="h3" class="text-2xl truncate ...">{title}</Heading>
      <p class="text-base font-light text-gray-500 dark:text-gray-400">
        {subtitle}
      </p>
    </div>
    <ChangeText
      value={changeValue}
      since={changeSince}
      equalHeight={true}
      class="justify-right text-right font-medium"
    />
  </div>

  <Chart options={chartOptions}></Chart>
</Card>
