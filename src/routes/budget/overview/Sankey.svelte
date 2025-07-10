<script lang="ts">
  import {
    Chart,
    Group,
    Link,
    Rect,
    Sankey,
    Svg,
    Text,
    Tooltip,
    graphFromHierarchy,
    graphFromNode,
    nodesFromLinks,
  } from "layerchart";
  import { Spinner } from "flowbite-svelte";
  import { scaleSequential } from "d3-scale";
  import type { SankeyNode, SankeyLink } from "d3-sankey";
  import { Icon } from "svelte-ux";
  import { mdiArrowRightBold } from "@mdi/js";
  import { onMount } from "svelte";
  import _ from "lodash"; // Example using lodash, or write your own
  import { interpolateCool } from "d3-scale-chromatic";
  import { cls } from "@layerstack/tailwind";
  import SankeyControls from "./SankeyControls.svelte";
  import { lab } from "d3-color";
  let data = null;

  function truncateLabel(label: string, maxLength: number = 20): string {
    if (label.length > maxLength) {
      return _.truncate(label, { length: maxLength, omission: "..." });
    }
    return label;
  }

  // variables

  let selectedNode: SankeyNode<{}, {}> | null = null;
  let rawSankeyData: { nodes: MyNode[]; links: MyLink[] } | null = null; // Holds all original data with full link arrays on nodes
  let filteredSankeyData: { nodes: MyNode[]; links: MyLink[] } | null = null; // Data passed to Sankey component
  let minValueThreshold = 5; // Example threshold in billions

  let nodeColorBy: string = "layer";
  let linkColorBy: string = "source";
  let highlightLinkIndexes: Array<number | undefined> = [];

  $: linkOpacity =
    linkColorBy === "static"
      ? {
          default: 0.1,
          inactive: 0.01,
        }
      : {
          default: 0.2,
          inactive: 0.01,
        };

  // Define types for clarity and to include the custom link arrays
  interface MyNode {
    id: string;
    name: string;
    value?: number; // Value will be calculated by Sankey layout
    x0?: number;
    x1?: number;
    y0?: number;
    y1?: number;
    // Custom properties to hold all *original* connections for tooltips
    allSourceLinks?: MyLink[];
    allTargetLinks?: MyLink[];
  }

  interface MyLink {
    source: string | MyNode; // Can be string (id) or node object
    target: string | MyNode;
    value: number;
  }

  const colorScale = scaleSequential([0, 1], interpolateCool);

  onMount(() => {
    // Ensure the data is structured correctly for the Sankey chart by importing from a JSON file
    fetch("https://data.bearylogical.net/sankey_data_raw_v3.json")
      .then((response) => response.json())
      .then((jsonData) => {
        rawSankeyData = prepareSankeyDataV2(jsonData);
        console.log("Sankey data:", rawSankeyData);
        // Alternatively, if you have a specific node structure:
        // data = graphFromNode(jsonData.nodes, jsonData.links);
      })
      .catch((error) => {
        console.error("Error fetching Sankey data:", error);
      });
  });

  function prepareSankeyDataV2(rawData: any[]): {
    nodes: MyNode[];
    links: MyLink[];
  } {
    const allNodeNames = new Set<string>();
    const ignoreKeywords = ["_Operating", "_Development"];

    const filteredRawData = rawData.filter(
      (d) =>
        (!ignoreKeywords.some((keyword) => d.parent.includes(keyword)) &&
          !ignoreKeywords.some((keyword) => d.child.includes(keyword))) ||
        (d.parent === "Total Expenditure" && d.child === "Revenue")
    );

    filteredRawData.forEach((d) => {
      allNodeNames.add(d.parent);
      allNodeNames.add(d.child);
    });

    filteredRawData.forEach((d) => {
      d.value = d.value / 1000000000; // Scale down to billions
    });

    const bridgeNodeName = "Reported Revenue";
    allNodeNames.add(bridgeNodeName);

    let nodes: MyNode[] = Array.from(allNodeNames).map((name) => ({
      id: name,
      name: name.split("_").pop(),
      allSourceLinks: [], // Initialize custom link arrays
      allTargetLinks: [],
    }));

    const nodeMap = new Map<string, MyNode>(nodes.map((n) => [n.id, n])); // For quick lookup

    const links: MyLink[] = [];

    const topRevenueParents = ["Revenue"];

    nodes = nodes.filter((node) => !topRevenueParents.includes(node.name));

    const expenditureBreakdownParentsKeyword = "Expenditure";

    filteredRawData.forEach((d) => {
      const sourceName = d.parent;
      const targetName = d.child;
      let newLink: MyLink | null = null;

      if (topRevenueParents.includes(sourceName)) {
        newLink = {
          source: targetName,
          target: bridgeNodeName,
          value: d.value,
        };
      } else if (sourceName === "Total Expenditure") {
        newLink = {
          source: bridgeNodeName,
          target: targetName,
          value: d.value,
        };
      } else if (targetName === "Total Expenditure") {
        newLink = {
          source: bridgeNodeName,
          target: targetName,
          value: d.value,
        };
      } else if (
        sourceName.includes(expenditureBreakdownParentsKeyword) ||
        targetName === "Surplus"
      ) {
        newLink = { source: sourceName, target: targetName, value: d.value };
      } else {
        if (allNodeNames.has(targetName) && allNodeNames.has(sourceName)) {
          newLink = { source: targetName, target: sourceName, value: d.value };
        } else {
          console.warn(
            `Skipping link due to missing node or unhandled type: ${targetName} -> ${sourceName}`
          );
        }
      }

      if (newLink) {
        links.push(newLink);
        // Directly populate the custom link arrays on the node objects
        const sourceNode = nodeMap.get(
          typeof newLink.source === "string"
            ? newLink.source
            : newLink.source.id
        );
        const targetNode = nodeMap.get(
          typeof newLink.target === "string"
            ? newLink.target
            : newLink.target.id
        );

        if (sourceNode) {
          sourceNode.allSourceLinks!.push(newLink); // Add to outgoing links
        }
        if (targetNode) {
          targetNode.allTargetLinks!.push(newLink); // Add to incoming links
        }
      }
    });

    // Filter nodes that have no original links at all
    nodes = nodes.filter((node) => {
      return node.allSourceLinks!.length > 0 || node.allTargetLinks!.length > 0;
    });

    return { nodes, links }; // Return all nodes and links with pre-calculated full connections
  }

  const formatExpenditureLabel = (label: string): string => {
    // Format expenditure labels to remove "Expenditure" and keep the rest
    return label.includes("Expenditure")
      ? (label.split("_").pop() ?? "")
      : label;
  };

  // Reactive statement to filter data for the Sankey component
  $: {
    if (rawSankeyData) {
      const tempFilteredLinks = rawSankeyData.links.filter(
        (link) => link.value >= minValueThreshold
      );

      // Get the IDs of nodes that are still connected by filtered links
      const connectedNodeIds = new Set<string>();
      tempFilteredLinks.forEach((link) => {
        connectedNodeIds.add(
          typeof link.source === "object" ? link.source.id : link.source
        );
        connectedNodeIds.add(
          typeof link.target === "object" ? link.target.id : link.target
        );
      });

      // Filter nodes: only include nodes that are part of the displayed links,
      // but ensure these nodes are references to the *original* rawSankeyData nodes
      // so they carry our custom 'allSourceLinks'/'allTargetLinks' properties.
      const tempFilteredNodes = rawSankeyData.nodes.filter((node) =>
        connectedNodeIds.has(node.id)
      );

      filteredSankeyData = {
        nodes: tempFilteredNodes,
        links: tempFilteredLinks,
      };
    }
  }
</script>

{#if !filteredSankeyData}
  <div class="h-screen border rounded p-4 flex items-center justify-center">
    <Spinner color="red" size={16} aria-label="Loading Sankey data..." />
  </div>
{:else}
  <div class="py-4 flex flex-col">
    <div>
      <div class="pt-4 pb-2">
        <SankeyControls
          bind:value={minValueThreshold}
          sliderText={"Show items greater than (billion SGD)"}
        />
      </div>
      <div class="p-4 border rounded h-[600px] px-5">
        <Chart
          data={selectedNode ? graphFromNode(selectedNode) : filteredSankeyData}
          padding={{ right: 164 }}
          let:tooltip
        >
          <Svg>
            <Sankey
              nodeId={(d) => d.id}
              nodeWidth={15}
              nodeAlign={"left"}
              nodePadding={15}
              linkSort={(a, b) => b.value - a.value}
              let:links
              let:nodes
            >
              {#each links as link ([link.source.name, link.target.name].join("_"))}
                <Link
                  sankey={true}
                  data={link}
                  stroke={linkColorBy === "static"
                    ? "#000000"
                    : colorScale(link[linkColorBy][nodeColorBy])}
                  stroke-opacity={highlightLinkIndexes.length &&
                  !highlightLinkIndexes.includes(link.index)
                    ? linkOpacity.inactive
                    : linkOpacity.default}
                  strokeWidth={link.width}
                  orientation="horizontal"
                  class={cls(
                    "transition[stroke-opacity] duration-300",
                    linkColorBy === "static" && "stroke-surface-content"
                  )}
                  onpointerenter={() => (highlightLinkIndexes = [link.index])}
                  onpointerleave={() => {
                    highlightLinkIndexes = [];
                    tooltip.hide();
                  }}
                  onpointermove={(e) => tooltip.show(e, { link })}
                  tweened
                />
              {/each}

              {#each nodes as node (node.id)}
                {@const nodeWidth = (node.x1 ?? 0) - (node.x0 ?? 0)}
                {@const nodeHeight = (node.y1 ?? 0) - (node.y0 ?? 0)}
                <Group
                  x={node.x0}
                  y={node.y0}
                  onpointermove={(e) => tooltip.show(e, { node })}
                  onpointerleave={() => {
                    tooltip.hide();
                  }}
                  tweened
                >
                  <Rect
                    width={nodeWidth}
                    height={nodeHeight}
                    fill={colorScale(node[nodeColorBy])}
                    fillOpacity={highlightLinkIndexes.length &&
                    !highlightLinkIndexes.includes(node.index)
                      ? 0.5
                      : 0.7}
                    tweened
                    onpointerenter={() => {
                      highlightLinkIndexes = [
                        ...(node.sourceLinks?.map((l) => l.index) ?? []),
                        ...(node.targetLinks?.map((l) => l.index) ?? []),
                      ];
                    }}
                    onpointermove={(e) => tooltip.show(e, { node })}
                    onpointerleave={() => {
                      highlightLinkIndexes = [];
                      tooltip.hide();
                    }}
                    onclick={() => {
                      // Clicking a node gets the SankeyNode object (with layout props)
                      // This is fine for `graphFromNode` which expects a node with layout props.
                      selectedNode =
                        node === selectedNode || node.sourceLinks?.length === 0
                          ? null
                          : node;
                    }}
                  />

                  <Text
                    style="text-sm; font-weight: 500;"
                    value={node.depth < 2
                      ? truncateLabel(node.name, 10)
                      : truncateLabel(node.name, 25)}
                    fillOpacity={highlightLinkIndexes.length &&
                    !highlightLinkIndexes.includes(node.index)
                      ? 0.3
                      : 1}
                    x={node.height === 0
                      ? node.index < 4
                        ? -4
                        : nodeWidth + 4
                      : nodeWidth + 4}
                    y={nodeHeight / 2}
                    textAnchor={node.height === 0
                      ? node.index < 4
                        ? "end"
                        : "start"
                      : "start"}
                    verticalAnchor="middle"
                    class="pointer-events-none"
                  />
                </Group>
              {/each}
            </Sankey>
          </Svg>

          <Tooltip.Root
            let:data
            classes={{
              root: "bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded p-2",
            }}
          >
            <Tooltip.Header classes={{ root: "text-lg font-semibold" }}>
              {#if data.node}
                {data.node.name}
              {:else if data.link}
                {data.link.source.name}
                <Icon
                  data={mdiArrowRightBold}
                  class="text-white/50 stroke-black"
                />
                {data.link.target.name}
              {/if}
            </Tooltip.Header>

            <Tooltip.List>
              {#if data.node}
                <Tooltip.Item
                  label="Total in billion SGD"
                  value={data.node.value}
                  format="decimal"
                  classes={{
                    value: "font-semibold italic",
                    label: "font-semibold italic",
                  }}
                />

                {#if data.node.allSourceLinks?.length === 1}
                  <!-- handle revenue tooltip -->
                  {#if data.node.allTargetLinks.length}
                    <Tooltip.Separator />
                    <div class="col-span-full text-sm italic">
                      Sources in billion SGD (% of total)
                    </div>
                  {/if}
                  {#each data.node.allTargetLinks as link}
                    <Tooltip.Item
                      label={link.source.name ? link.source.name : link.source}
                      value={`${link.value.toFixed(2)} (${((link.value / (data.node.value || 1)) * 100).toFixed(1)}%)`}
                    />
                  {/each}
                  <Tooltip.Separator />
                  <div class="col-span-full text-sm italic">
                    Contribution towards
                    <span class="font-semibold">
                      {data.node.allSourceLinks[0].target.name}
                    </span>
                    (Billion SGD)
                  </div>
                  {#each data.node.allSourceLinks[0].target.allTargetLinks as targetLink}
                    <Tooltip.Item
                      label={targetLink.source.name
                        ? targetLink.source.name
                        : targetLink.source}
                      value={`${targetLink.value.toFixed(2)} (${((targetLink.value / data.node.allSourceLinks[0].target.value) * 100).toFixed(1)}%)`}
                      classes={targetLink.source.name === data.node.name
                        ? { label: "font-semibold", value: "font-semibold" }
                        : {}}
                    />
                  {/each}
                {:else if data.node.allTargetLinks?.length === 1}
                  <!-- handle expenditure tooltip -->
                  <Tooltip.Separator />
                  <div class="col-span-full text-sm italic">
                    Sub-Expenditure Items in billion SGD in billion SGD (% of
                    total)
                  </div>
                  {#each data.node.allSourceLinks as sourceLink}
                    <Tooltip.Item
                      label={formatExpenditureLabel(
                        sourceLink.target.name
                          ? sourceLink.target.name
                          : sourceLink.target
                      )}
                      value={`${sourceLink.value.toFixed(2)} (${((sourceLink.value / (data.node.value || 1)) * 100).toFixed(1)}%)`}
                    />
                  {/each}
                  <Tooltip.Separator />
                  <div class="col-span-full text-sm italic">
                    % Expenditure of {data.node.allTargetLinks[0].source.name} in
                    billion SGD (% of total)
                  </div>
                  {#each data.node.allTargetLinks[0].source.allSourceLinks as link}
                    <Tooltip.Item
                      label={link.target.name
                        ? formatExpenditureLabel(link.target.name)
                        : formatExpenditureLabel(link.target)}
                      value={`${link.value.toFixed(2)} (${((link.value / data.node.allTargetLinks[0].source.value) * 100).toFixed(1)}%)`}
                      classes={link.target.name === data.node.name
                        ? { label: "font-semibold", value: "font-semibold" }
                        : {}}
                    />
                  {/each}
                {:else if data.node.name === "Reported Revenue"}
                  <tooltip.Separator />
                  <div class="col-span-full text-sm italic">
                    Sources of Reported Revenue in billion SGD (% of total)
                  </div>
                  {#each data.node.allTargetLinks as link}
                    <Tooltip.Item
                      label={link.source.name ? link.source.name : link.source}
                      value={`${link.value.toFixed(2)} (${((link.value / (data.node.value || 1)) * 100).toFixed(1)}%)`}
                    />
                  {/each}
                  <Tooltip.Separator />
                  <div class="col-span-full text-sm italic">
                    Estimated Expenditure in billion SGD (% of total)
                  </div>
                  {#each data.node.allSourceLinks as link}
                    <Tooltip.Item
                      label={link.target.name ? link.target.name : link.target}
                      value={`${link.value.toFixed(2)} (${((link.value / (data.node.value || 1)) * 100).toFixed(1)}%)`}
                    />
                  {/each}
                {/if}
              {:else if data.link}
                <Tooltip.Item
                  label="Value in billion SGD"
                  value={data.link.value}
                  format="decimal"
                  classes={{
                    value: "font-semibold italic",
                    label: "font-semibold italic",
                  }}
                />
              {/if}
            </Tooltip.List>
          </Tooltip.Root>
        </Chart>
      </div>
    </div>
  </div>
{/if}
