<script lang="ts">
  import { Spinner } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { fetchBudgetOverview } from "$lib/utils/handlers";
  import Treemap from "$lib/components/Treemap.svelte";
  import ScreenSize from "$lib/components/custom/ScreenSize.svelte";
  import Sankey from "./Sankey.svelte";
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import { mdiInformationSlabCircleOutline } from "@mdi/js";
  import { Icon } from "svelte-ux";

  let budgetOverview: [] = [];
  onMount(async () => {
    // add delay to show loading state
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    budgetOverview = await fetchBudgetOverview("2025", "ESTIMATED");
  });
</script>

<div class="mx-auto container pt-10">
  {#await budgetOverview}
    <div class="h-screen border rounded p-4 flex items-center justify-center">
      <Spinner color="red" size={16} aria-label="Loading data..." />
    </div>
  {:then data}
    <h2 class="text-3xl font-semibold mb-4">Singapore Budget Overview 2025</h2>
    <div class="mb-4">
      In March 2025, the Singapore government presented its budget for the
      fiscal year 2025. This overview provides a summary of the estimated
      revenue and expenditure breakdown, as well as a detailed view of
      expenditures by ministry.
    </div>
    <Accordion.Root class="w-full bg-slate-100 rounded-md px-8">
      <Accordion.Item value="item-1">
        <Accordion.Trigger class="no-underline ">
          <Icon
            data={mdiInformationSlabCircleOutline}
            class=" stroke-black dark:stroke-white"
            size={20}
          />Data and Methodology</Accordion.Trigger
        >
        <Accordion.Content>
          <p class="mt-1">
            The data is sourced from the <a
              class="text-blue-600 after:content-['_↗'] ..."
              href="https://www.mof.gov.sg/singaporebudget"
              target="_blank"
            >
              Ministry of Finance (MOF) Singapore Budget website
            </a>
          </p>
          <p class="mt-1">
            An explanation of how the data is obtained is available in the
            <a
              class="text-blue-600 after:content-['_↗'] ..."
              href="https://bearylogical.net/blog/budget-sg/parsing-budget-sg-aws-textract"
              target="_blank"
            >
              blog post
            </a>
          </p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>

    <div class="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10"></div>

    <h3 class="text-2xl font-light mb-2" id="estimated-revenue-expenditure">
      Estimated Revenue and Expenditure Breakdown for FY2025
    </h3>
    <p>
      As reported in <span class="text-blue-600">The Straits Times </span><a
        class="text-blue-600 after:content-['_↗'] ..."
        href="https://www.straitstimes.com/multimedia/graphics/2025/02/singapore-budget-revenue-and-spending-breakdown-2025/index.html?shell"
        target="_blank"
      >
      </a>, the Singapore government has estimated a total revenue of 150
      billion Singapore dollars (SGD) taking into account the Operating Revenue
      (122.8 billion SGD) and the Net Investment Returns Contribution (NIRC) of
      27.2 billion SGD. The total expenditure (inclusive of Special Transfers)
      is estimated to be 147 billion SGD which results in a budget surplus close
      to 3 billion SGD.
    </p>
    <p>
      The Sankey diagram below can be customized to show a more granular
      breakdown of the revenue and expenditure data. The default view allows the
      visual to be less cluttered by visualizing items larger than 5 billion
      SGD. You can adjust the threshold using the slider below.
    </p>
    <ScreenSize>
      <Sankey />
    </ScreenSize>

    <div class="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10"></div>
    <h3 class="text-2xl font-light mb-2" id="expenditure-breakdown-by-ministry">
      Expenditure Breakdown by Ministry for FY2025
    </h3>
    {#if budgetOverview.length > 0}
      <Treemap {data} />
    {:else}
      <div class="h-screen border rounded p-4 flex items-center justify-center">
        <Spinner color="red" size={20} aria-label="Loading Sankey data..." />
      </div>
    {/if}
  {:catch error}
    <div>Error: {error.message}</div>
  {/await}
</div>
