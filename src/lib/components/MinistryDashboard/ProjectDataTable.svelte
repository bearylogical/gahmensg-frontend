<script>
  import { DataHandler, Th, Datatable, ThFilter } from "@vincjo/datatables";
  import * as d3 from "d3";
  import { round } from "svelte-ux";
  import { goto } from "$app/navigation";
  import ExternalLink from "lucide-svelte/icons/external-link";
  import * as Tooltip from "$lib/components/ui/tooltip";
  export let data;

  const handler = new DataHandler(data, { rowsPerPage: 5 });
  const rows = handler.getRows();

  $: data, handler.setRows(data);
  // $: console.log("Data for ProjectDataTable: ", data);
</script>

<div class="pt-2">
  <Datatable {handler}>
    <table class="table-fixed">
      <thead>
        <tr>
          <Th {handler} orderBy="name">Project Title</Th>
          <Th {handler} orderBy="value_amount">Amount (SGD)</Th>
          <Th {handler} orderBy="perc_diff">% Change from Previous</Th>
          <Th {handler} orderBy="parent_header">Category</Th>
        </tr>
        <tr>
          <ThFilter {handler} filterBy="name" />
          <th></th>
          <ThFilter {handler} filterBy="perc_diff" />
          <ThFilter {handler} filterBy="parent_header" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td>
              {#if row.project_id}
                <a
                  href="/budget/project?id={row.project_id}"
                  class="flex items-center gap-1"
                >
                  {row.project_title}
                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <ExternalLink class="w-4 h-4" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>Go to project page</p>
                    </Tooltip.Content>
                  </Tooltip.Root>
                </a>
              {:else}
                {row.project_title}
              {/if}
            </td>
            <td class="content-center">{d3.format("$,")(row.value_amount)}</td>
            <td class="content-center"
              >{row.perc_diff != "NA"
                ? round(row.perc_diff, 2) + "%"
                : "NA"}</td
            >
            <td class="content-center">{row.parent_header}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Datatable>
</div>

<style>
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  tbody tr:hover {
    background: #f5f5f5;
  }
  th {
    background-color: #f2f2f2;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
</style>
