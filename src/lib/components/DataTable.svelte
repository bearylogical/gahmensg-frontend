<script>
    import { DataHandler, Th, Datatable, ThFilter } from "@vincjo/datatables";
    export let data;

    const handler = new DataHandler(data, { rowsPerPage: 10 });
    const rows = handler.getRows();

    $: data, handler.setRows(data);
</script>

<div>
    <Datatable {handler}>
        <table class="table-fixed">
            <thead>
                <tr>
                    <Th {handler} orderBy="name">Item</Th>
                    <Th {handler} orderBy="amount">Amount (SGD)</Th>
                    <Th {handler} orderBy="percent_total"
                        >% of Overall Expenditure</Th
                    >
                </tr>
                <tr>
                    <ThFilter {handler} filterBy="name" />
                    <th></th>

                    <th> </th>
                </tr>
            </thead>
            <tbody>
                {#each $rows as row}
                    <tr>
                        <td>{row.name}</td>
                        <td class="content-center">{row.amount}</td>
                        <td class="content-center">{row.percent_total}</td>
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
