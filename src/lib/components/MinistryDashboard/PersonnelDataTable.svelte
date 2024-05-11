<script>
    import { DataHandler, Th, Datatable, ThFilter } from "@vincjo/datatables";
    import * as d3 from "d3";
    import { round } from "svelte-ux";
    export let data;

    const handler = new DataHandler(data, { rowsPerPage: 5 });
    const rows = handler.getRows();

    $: data, handler.setRows(data);
</script>

<div class="p-6">
    <Datatable {handler}>
        <table class="table-fixed">
            <thead>
                <tr>
                    <Th {handler} orderBy="name">Personnel Type</Th>
                    <Th {handler} orderBy="value_amount">Count of People</Th>
                    <Th {handler} orderBy="perc_diff">% Change from Previous</Th
                    >
                    <Th {handler} orderBy="percent_total">% of Total</Th>
                    <Th {handler} orderBy="parent_header">Category</Th>
                </tr>
                <tr>
                    <ThFilter {handler} filterBy="name" />
                    <th></th>
                    <ThFilter {handler} filterBy="perc_diff" />
                    <ThFilter {handler} filterBy="percent_total" />
                    <ThFilter {handler} filterBy="parent_header" />
                </tr>
            </thead>
            <tbody>
                {#each $rows as row}
                    <tr>
                        <td>{row.project_title}</td>
                        <td class="content-center">{row.value_amount}</td>
                        <td class="content-center"
                            >{row.perc_diff != "NA"
                                ? round(row.perc_diff, 2) + "%"
                                : "NA"}</td
                        >
                        <td class="content-center"
                            >{row.percent_total != "NA"
                                ? round(row.percent_total, 2) + "%"
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
