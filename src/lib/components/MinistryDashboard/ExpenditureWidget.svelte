<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import ChangeText from "./ChangeText.svelte";
  import type { ApexOptions } from "apexcharts";
  import { Card, Chart, Heading } from "flowbite-svelte";

  export let title: string = "";
  export let subtitle: string = "";
  export let chartOptions: ApexOptions;
  export let changeValue: number = 0;
  export let changeSince: string = "";

  const dispatch = createEventDispatcher();

  // Add xAxis.labels.events.click to chartOptions
  $: if (chartOptions && chartOptions.xaxis) {
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
