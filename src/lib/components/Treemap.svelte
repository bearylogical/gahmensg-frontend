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
    findAncestor,
  } from "layerchart";
  import { cls, Button, table, round } from "svelte-ux";
  import DataTable from "./DataTable.svelte";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { scaleSequential, scaleOrdinal } from "d3-scale";
  import * as chromatic from "d3-scale-chromatic";
  import { Breadcrumb } from "svelte-ux";
  import { hsl } from "d3-color";
  import * as d3 from "d3";
  export let data;
  function parseData(data) {
    // only select unique object paths
    data = data.filter(
      (d, i, self) =>
        i === self.findIndex((t) => t.object_path === d.object_path)
    );

    // reject data with object_code == 9999
    data = data.filter((d) => d.object_code !== "9999");
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

  function isNodeVisible(a, b) {
    while (b) {
      if (a.parent === b) return true;
      b = b.parent;
    }

    return false;
  }
  $: hierarchy = parseData(data);

  function formatTitle(val: string) {
    return val.split("/").pop();
  }

  let tile = "binary";
  let colorBy = "parent";
  let tableData = [];

  let selectedZoomable = null;

  $: if (selectedZoomable) {
    tableData = parseTableData(selectedZoomable);
  }

  function parseTableData(data: any) {
    return data.children.map((d) => {
      return {
        name: d.data.id.split("/").pop(),
        amount: d3.format("$,")(d.value),
        percent_total: round(d.data.percentage * 100, 2),
      };
    });
  }

  const sequentialColor = scaleSequential([3, -1], chromatic.interpolateGnBu);
  // filter out hard to see yellow and green
  const ordinalColor = scaleOrdinal(
    chromatic.schemeSpectral[9].filter((c) => hsl(c).h < 60 || hsl(c).h > 90)
  );
  // const ordinalColor = scaleOrdinal(chromatic.schemeSpectral[];

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
          ? hsl(ordinalColor(colorParent.data.id)).brighter(node.depth * 0.3)
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
    class="px-2 py-2 hover:bg-slate-200 hover:text-slate-40 hover:rounded"
  >
    <div class="text-left">
      <div class="text-2xl">
        {item.data.id == "/"
          ? "Government Expenditure"
          : formatTitle(item.data.id)}
      </div>
      <div class="text-sm font-light pb-2">
        {d3.format("$,")(item.value)}
      </div>
    </div>
  </Button>
</Breadcrumb>
<div class="h-[600px] p-4 border rounded">
  <Chart data={hierarchy.copy()} let:tooltip>
    <Svg>
      <Bounds
        domain={selectedZoomable}
        tweened={{ duration: 800, easing: cubicOut }}
        range={{ x: [0, 1], y: [0, 1] }}
        let:xScale
        let:yScale
      >
        <ChartClipPath>
          <Treemap let:nodes {tile} bind:selected={selectedZoomable}>
            {#each nodes as node}
              <Group
                x={xScale(node.x0)}
                y={yScale(node.y0)}
                onclick={() =>
                  node.children ? (selectedZoomable = node) : null}
                onpointermove={(e) => {
                  tooltip.show(e, node);
                }}
                onpointerleave={() => tooltip.hide()}
              >
                {@const nodeWidth = xScale(node.x1) - xScale(node.x0)}
                {@const nodeHeight = yScale(node.y1) - yScale(node.y0)}
                <RectClipPath width={nodeWidth} height={nodeHeight}>
                  {@const nodeColor = getNodeColor(node, colorBy)}
                  {#if isNodeVisible(node, selectedZoomable)}
                    <g transition:fade={{ duration: 600 }}>
                      <Rect
                        width={nodeWidth}
                        height={nodeHeight}
                        stroke="#000000"
                        stroke-opacity={colorBy === "children" ? 0.2 : 1}
                        fill={nodeColor}
                      />
                      <Text
                        value="{formatTitle(node.data.id)} ({node.children
                          ?.length ?? 0})"
                        class={cls(
                          "text-lg font-semibold text-wrap",
                          colorBy === "children"
                            ? "fill-primary-content"
                            : "fill-slate-900 "
                        )}
                        verticalAnchor="start"
                        x={10}
                        y={10}
                      />
                      <Text
                        value={d3.format("$,")(node.value)}
                        class={cls(
                          "text-sm text-wrap",
                          colorBy === "children"
                            ? "fill-primary-content"
                            : "fill-slate-700"
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
    <Tooltip.Root
      classes={{
        root: "bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded p-2",
      }}
      let:data
    >
      {#if data}
        <Tooltip.Header classes={{ root: "text-lg font-semibold" }}>
          {formatTitle(data.data.id)}
        </Tooltip.Header>
        <Tooltip.List>
          <Tooltip.Item
            label="Expenditure"
            value={data.value}
            format="currency"
            valueAlign="left"
          />
          <Tooltip.Item
            label="% of Total"
            value={data.data.percentage}
            format="percent"
            valueAlign="left"
          />
        </Tooltip.List>
      {/if}
    </Tooltip.Root>
  </Chart>
</div>
<div class=" mx-auto py-10">
  <div class="col-span-2 border shadow-md rounded-lg">
    {#if selectedZoomable}
      <div class="p-4">
        <DataTable data={tableData} />
      </div>
    {/if}
  </div>
</div>

<style>
</style>
