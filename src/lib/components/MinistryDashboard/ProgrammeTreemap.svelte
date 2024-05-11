<script lang="ts">
    import {
        Chart,
        Bounds,
        Treemap,
        Group,
        Rect,
        ChartClipPath,
        Svg,
        Text,
        RectClipPath,
        Tooltip,
        TooltipItem,
        findAncestor,
    } from "layerchart";
    import { cls, Button, table, round } from "svelte-ux";
    import ProjectDataTable from "./ProjectDataTable.svelte";
    import { cubicOut } from "svelte/easing";
    import { fade } from "svelte/transition";
    import { scaleSequential, scaleOrdinal } from "d3-scale";
    import * as chromatic from "d3-scale-chromatic";
    import { Breadcrumb } from "svelte-ux";
    import { hsl } from "d3-color";
    import * as d3 from "d3";
    import ProgrammeDataTable from "./ProgrammeDataTable.svelte";
    export let data;
    export let createRootNode = false;

    let selectedZoomable;
    let hierarchy;

    function convertData(data) {
        // convert any slashed in project_title or parent_header to underscore do not modify in place
        data = data.map((d) => {
            d.sanitized_header = d.project_title.replace(/\//g, "_");
            d.sanitized_parent_header = d.parent_header.replace(/\//g, "_");
            return d;
        });

        // add object_path to data
        data = data.map((d) => {
            d.object_path = d.sanitized_header;
            return d;
        });
        // add a root node to the data
        data.push({
            object_path: "/",
            parent: null,
            parent_header: null,
            project_title: null,
            value_amount: null,
            id: "Agency Projects",
        });
        const stratifyData = d3.stratify().path((d) => d.object_path)(data);

        const hierarchyData = d3
            .hierarchy(stratifyData)
            .sum((d) => (d.data ? d.data.value_amount : 0))
            .sort((a, b) => b.value - a.value);

        // add percentage of total
        hierarchyData.each((d) => {
            d.data.percentage = d.value / hierarchyData.value;
        });

        return hierarchyData;
    }

    $: hierarchy = convertData(data);

    // $: if (data) {
    //     selectedZoomable = null;
    // }

    function isNodeVisible(a, b) {
        while (b) {
            if (a.parent === b) return true;
            b = b.parent;
        }

        return false;
    }
    function formatTitle(d) {
        return d.data.id.split("/").pop();
    }

    let tile = "binary";
    let colorBy = "parent";
    let tableData = [];

    $: if (selectedZoomable) {
        tableData = parseTableData(selectedZoomable);
    }

    function parseTableData(data: any) {
        return data.children.map((d) => {
            return {
                name: d.data.id.split("/").pop(),
                project_title:
                    d.data?.data?.project_title ?? d.data.id.split("/").pop(),
                perc_diff: d.data?.data.perc_diff ?? 0,
                // amount: d3.format("$,")(d.value),
                value_amount: d.value,
                parent_header: d.data.id.split("/").slice(-2, -1)[0],
                percent_total: d.data.percentage * 100,
            };
        });
    }
    const sequentialColor = scaleSequential([3, -1], chromatic.interpolateGnBu);
    // filter out hard to see yellow and green
    const ordinalColor = scaleOrdinal(
        chromatic.schemeSpectral[9].filter(
            (c) => hsl(c).h < 60 || hsl(c).h > 90,
        ),
    );

    function getNodeColor(node, colorBy) {
        switch (colorBy) {
            case "children":
                return node.children
                    ? "hsl(var(--color-primary-500))"
                    : "hsl(var(--color-primary-400))";
            case "depth":
                return sequentialColor(node.depth);
            case "parent":
                const colorParent = findAncestor(node, (n) => n.depth === 1);
                return colorParent
                    ? hsl(ordinalColor(colorParent.data.id)).brighter(
                          node.depth * 0.3,
                      )
                    : "#ddd";
        }
    }
</script>

<Breadcrumb items={selectedZoomable?.ancestors().reverse() ?? []} class="pb-4">
    <Button
        slot="item"
        let:item
        on:click={() => (selectedZoomable = item)}
        base
        class="px-2 hover:bg-slate-200 hover:text-slate-40 hover:rounded"
    >
        <div class="text-left">
            <div class="text-2xl">
                {item.data.id == "/" ? "Total Expenditure" : formatTitle(item)}
            </div>
            <div class="text-sm font-light pb-2">
                {d3.format("$,")(item.value)}
            </div>
        </div>
    </Button>
</Breadcrumb>

{#key hierarchy}
    <div class="h-[300px] border rounded">
        <Chart data={hierarchy.copy()} tooltip={{ mode: "manual" }} let:tooltip>
            <Svg>
                <Bounds
                    domain={selectedZoomable}
                    tweened={{ duration: 800, easing: cubicOut }}
                    range={{ x: [0, 1], y: [0, 1] }}
                    let:xScale
                    let:yScale
                >
                    <ChartClipPath>
                        <Treemap
                            let:nodes
                            {tile}
                            bind:selected={selectedZoomable}
                        >
                            {#each nodes as node}
                                <Group
                                    x={xScale(node.x0)}
                                    y={yScale(node.y0)}
                                    on:click={() =>
                                        node.children
                                            ? (selectedZoomable = node)
                                            : null}
                                    on:mousemove={(e) => tooltip.show(e, node)}
                                    on:mouseleave={tooltip.hide}
                                >
                                    {@const nodeWidth =
                                        xScale(node.x1) - xScale(node.x0)}
                                    {@const nodeHeight =
                                        yScale(node.y1) - yScale(node.y0)}
                                    <RectClipPath
                                        width={nodeWidth}
                                        height={nodeHeight}
                                    >
                                        {@const nodeColor = getNodeColor(
                                            node,
                                            colorBy,
                                        )}
                                        {#if isNodeVisible(node, selectedZoomable)}
                                            <g
                                                transition:fade={{
                                                    duration: 600,
                                                }}
                                            >
                                                <Rect
                                                    width={nodeWidth}
                                                    height={nodeHeight}
                                                    stroke={colorBy ===
                                                    "children"
                                                        ? "hsl(var(--color-primary-content))"
                                                        : hsl(nodeColor).darker(
                                                              1,
                                                          )}
                                                    stroke-opacity={colorBy ===
                                                    "children"
                                                        ? 0.2
                                                        : 1}
                                                    fill={nodeColor}
                                                />
                                                <Text
                                                    value="{formatTitle(node)} "
                                                    class={cls(
                                                        "text-md",
                                                        colorBy === "children"
                                                            ? "fill-primary-content"
                                                            : "fill-slate-50 stroke-slate-200",
                                                    )}
                                                    verticalAnchor="start"
                                                    x={10}
                                                    y={10}
                                                />
                                                <Text
                                                    value={d3.format("$,")(
                                                        node.value,
                                                    )}
                                                    class={cls(
                                                        "text-sm font-extralight text-wrap",
                                                        colorBy === "children"
                                                            ? "fill-primary-content"
                                                            : "fill-slate-50 stroke-slate-200",
                                                    )}
                                                    verticalAnchor="start"
                                                    x={10}
                                                    y={30}
                                                />
                                            </g>
                                        {/if}
                                    </RectClipPath>
                                </Group>
                            {/each}
                        </Treemap>
                    </ChartClipPath>
                </Bounds>
            </Svg>
            <Tooltip
                header={(data) => formatTitle(data)}
                anchor="left"
                classes={{
                    container: "bg-slate-50 dark:bg-slate-800",
                    header: "text-slate-40 dark:text-white text-left",
                    content: "text-slate-40 dark:text-white text-left",
                }}
                let:data
            >
                <TooltipItem
                    label="Expenditure"
                    value={data.value}
                    format="currency"
                    valueAlign="left"
                />
                <TooltipItem
                    label="% of Total"
                    value={data.data.percentage}
                    format="percent"
                    valueAlign="left"
                />
            </Tooltip>
        </Chart>
    </div>
{/key}

<div class=" mx-auto py-8">
    <div class="col-span-2 rounded-lg">
        {#if selectedZoomable}
            <div class="p-2">
                <ProgrammeDataTable data={tableData} />
            </div>
        {/if}
    </div>
</div>

<style>
</style>
