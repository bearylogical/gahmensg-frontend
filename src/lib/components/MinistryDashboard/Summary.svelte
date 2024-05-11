<script lang="ts">
    import {
        Card,
        Heading,
        Tabs,
        TabItem,
        Popover,
        Badge,
    } from "flowbite-svelte";

    import { QuestionCircleOutline } from "flowbite-svelte-icons";
    import { getArrowColor, getArrow, parseValue } from "./utils";
    export let personnelData: [] = [];
    export let projectData: [] = [];
    import * as d3 from "d3";

    // assign a color to each category from a list of known colors
    const colorMap = {
        "OTHER STATUTORY APPOINTMENTS": "yellow",
        OTHERS: "yellow",
        "POLITICAL APPOINTMENTS": "blue",
        "PARLIAMENTARY APPOINTMENTS": "blue",
        "TEMPORARY, DAILY-RATED & OTHER STAFF": "red",
        "TTEMPORARY DAILY-RATED & OTHER STAFF": "red",
        "PERMANENT STAFF": "green",
        "CIVIL LIST": "purple",
    };
    // create a color list
    const colors = ["red", "green", "indigo", "yellow", "purple"];

    function createColorMap(data) {
        let colorMap = {};
        let colorIndex = 0;
        data.forEach((d) => {
            if (!colorMap[d.parent_header]) {
                colorMap[d.parent_header] = colors[colorIndex];
                colorIndex++;
            }
        });
        return colorMap;
    }
    // dynamically create a categorical color map for each parent_header

    $: dynamicColorMap = createColorMap(projectData);
</script>

<Card size="xl">
    <div class="mb-4 flex items-center gap-2">
        <Heading tag="h3" class="w-fit text-lg font-semibold dark:text-white ">
            Agency Summary
        </Heading>
        <button>
            <span class="sr-only">Show information</span>
            <QuestionCircleOutline
                size="sm"
                class="text-gray-400 hover:text-gray-500"
            />
        </button>
        <Popover placement="bottom-start">
            <div
                class="w-72 space-y-2 text-sm font-normal text-gray-500 dark:text-gray-400"
            >
                <h3 class="font-semibold text-gray-900 dark:text-white">
                    Agency Summary
                </h3>
                <p>
                    Shows the top 5 personnel categories and projects in the
                    selected ministry
                </p>
            </div>
        </Popover>
    </div>

    <Tabs
        style="full"
        defaultClass="flex divide-x rtl:divide-x-reverse divide-gray-200 shadow dark:divide-gray-700 "
        contentClass="p-3 mt-3.5  "
    >
        <TabItem class="w-full" open>
            <span slot="title">Top personnel</span>
            <ul
                class="-m-3 divide-y divide-gray-300 dark:divide-gray-700 dark:bg-gray-800"
            >
                {#each personnelData as { project_title, parent_header, value_amount, perc_diff, value_year }}
                    <li class="py-3 sm:py-4">
                        <div class="flex items-center justify-between">
                            <div class="flex min-w-0 items-center">
                                <div class="ml-3">
                                    <p
                                        class="block truncate ... max-w-[400px] font-medium text-gray-900 dark:text-white hover:text-wrap"
                                    >
                                        {project_title}
                                    </p>
                                    {#if parent_header !== ""}
                                        <Badge
                                            class="truncate ... max-w-[200px] text-center hover:opacity-70"
                                            rounded
                                            color={colorMap[parent_header]}
                                        >
                                            <span class="text-xs">
                                                {parent_header}
                                            </span>
                                        </Badge>
                                    {/if}
                                </div>
                            </div>
                            <div
                                class="grid grid-rows-2 items-right text-base font-semibold text-right text-gray-900 dark:text-white"
                            >
                                <div>
                                    {d3.format(",")(value_amount)}
                                </div>

                                <div
                                    class="text-xs font-light text-muted-foreground"
                                >
                                    <span class={getArrowColor(perc_diff)}>
                                        {getArrow(perc_diff)}{parseValue(
                                            perc_diff,
                                        )}%</span
                                    >
                                    from {value_year - 1}
                                </div>
                            </div>
                        </div>
                    </li>
                {/each}
                {#if personnelData.length < 5}
                    {#each Array(5 - personnelData.length) as _}
                        <li class="py-3 sm:py-4">
                            <div class="flex items">
                                <div class="ml-3">
                                    <p
                                        class="truncate font-medium text-gray-900 dark:text-white"
                                    >
                                        -
                                    </p>
                                    <span
                                        class="text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        -
                                    </span>
                                </div>
                            </div>
                        </li>
                    {/each}
                {/if}
            </ul>
        </TabItem>
        <TabItem class="w-full">
            <span slot="title">Top projects</span>
            <ul
                class="-m-3 divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
            >
                {#each projectData as { project_title, parent_header, value_amount, perc_diff, value_year }}
                    <li class="py-3 sm:py-4">
                        <div class="flex items-center justify-between">
                            <div class="flex min-w-0 items-center">
                                <div class="ml-3">
                                    <p
                                        class="block truncate ... max-w-[400px] font-medium text-gray-900 dark:text-white hover:text-wrap"
                                    >
                                        <!-- <a
                                            class="hover:text-red-800 after:content-['_↗'] ..."
                                            href="/"
                                            target="_blank"
                                        > -->
                                        {project_title}
                                    </p>
                                    {#if parent_header !== ""}
                                        <Badge
                                            class="block truncate ... max-w-[200px] text-center hover:opacity-70"
                                            rounded
                                            color={dynamicColorMap[
                                                parent_header
                                            ]}
                                        >
                                            <span class="text-xs">
                                                {parent_header}
                                            </span>
                                        </Badge>
                                    {/if}
                                </div>
                            </div>
                            <div
                                class="grid grid-rows-2 items-right text-base font-semibold text-right text-gray-900 dark:text-white"
                            >
                                <div>
                                    {d3.format("$,")(value_amount)}
                                </div>

                                <div
                                    class="text-xs font-light text-muted-foreground"
                                >
                                    <span class={getArrowColor(perc_diff)}>
                                        {getArrow(perc_diff)}{parseValue(
                                            perc_diff,
                                        )}%</span
                                    >
                                    from {value_year - 1}
                                </div>
                            </div>
                        </div>
                    </li>
                {/each}
                {#if projectData.length < 5}
                    {#each Array(5 - projectData.length) as _}
                        <li class="py-3 sm:py-4">
                            <div class="flex items items-center">
                                <div class="ml-3">
                                    <p
                                        class="truncate font-medium text-gray-900 dark:text-white"
                                    >
                                        -
                                    </p>
                                    <span
                                        class="text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        -
                                    </span>
                                </div>
                            </div>
                        </li>
                    {/each}
                {/if}
            </ul>
        </TabItem>
    </Tabs>
</Card>
