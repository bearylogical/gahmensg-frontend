<script>
    import { DataHandler, Th, Datatable, ThFilter } from "@vincjo/datatables";
    import * as d3 from "d3";
    export let data;

    const handler = new DataHandler(data, { rowsPerPage: 10 });
    const rows = handler.getRows();

    $: data, handler.setRows(data);
</script>

<div class="p-6">
    <Datatable {handler}>
        <table class="table-fixed">
            <thead>
                <tr>
                    <th>Project Title</th>
                    <th>Category</th>
                    <th>Amount (SGD)</th>
                    <th>Expenditure Type</th>
                </tr>
                <tr>
                    <ThFilter {handler} filterBy="name" />
                    <th></th>
                    <th></th>
                    <th> </th>
                </tr>
            </thead>
            <tbody>
                {#each $rows as row}
                    <tr>
                        <td>{row.project_title}</td>
                        <td class="content-center"
                            >{d3.format("$,")(row.value_amount)}</td
                        >
                        <td class="content-center">{row.value_type}</td>
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
