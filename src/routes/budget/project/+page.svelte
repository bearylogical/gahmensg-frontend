<script lang="ts">
    import Search from "lucide-svelte/icons/search";
    import Input from "$lib/components/ui/input/input.svelte";
    import { fetchProjects } from "$lib/utils/handlers";
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    import { Separator } from "$lib/components/ui/separator";
    import * as Resizable from "$lib/components/ui/resizable";
    import { projectStore } from "$lib/stores/projectStore";
    import { cn, digestMessage, formatTimeAgo } from "$lib/utils/utils";
    import ProjectDisplay from "./(components)/project-display.svelte";
    import { chartOptions } from "$lib/components/MinistryDashboard/chart_options";

    import { getMostRecentYearData, filterData } from "$lib/utils/dataUtils.js";
    import { entries } from "svelte-ux";
    // let focusElement: HTMLElement;
    const defaultLayout = [265, 655, 655];
    let results = [];
    let searchTerm: string;

    // create a function to retrieve all unique project ids in an array of objects
    const unique = (arr: any[], fn?: Function): any[] => {
        return arr
            .map(fn || ((x) => x))
            .filter((x, i, a) => a.slice(i + 1).findIndex((y) => y === x) < 0);
    };
    const uniqueProjectIds = (arr: any[]) =>
        unique(arr, (x) => x["project_id"]);

    const mapKeys = (obj, fn) =>
        Object.keys(obj).reduce((acc, k) => {
            acc[fn(obj[k], k, obj)] = obj[k];
            return acc;
        }, {});

    $: if (searchTerm && searchTerm.length > 2) {
        fetchProjects(searchTerm).then((data) => {
            let f = data.map((v) => ({
                ...v,
                stringIdentifier: (v.project_title + " " + v.ministry)
                    .replaceAll(/[^a-zA-Z]/g, "+")
                    .replaceAll(" ", "+")
                    .toLowerCase(),
            }));
            f = Object.groupBy(f, ({ stringIdentifier }) => stringIdentifier);

            // f = Object.keys(f).map((key) => f[key]);
            f = Object.assign(
                {},
                mapKeys(f, (val, key) => val[0]["project_title"]),
            );

            let transformed = [];
            for (const [key, value] of Object.entries(f)) {
                let recentYearData = getMostRecentYearData(value);
                let _res = {
                    values: value,
                    project_title: key,
                    project_identifier: recentYearData.stringIdentifier,
                    project_ids: uniqueProjectIds(value),
                    ministry: recentYearData.ministry,
                    recentYear: recentYearData.value_year,
                };
                digestMessage(recentYearData.stringIdentifier).then(
                    (message) => {
                        _res.project_hash = message;
                    },
                );

                transformed.push(_res);
            }

            // console.log("data", transformed);
            results = transformed;
        });
    } else {
        projectStore.clear();
        results = [];
    }
</script>

<div class="mx-auto container pt-4">
    <div class="px-10 sm:px-4 py-2 mx-auto md:px-12 lg:gap-8 xl:gap-0 lg:py-16">
        <h1
            class="text-4xl font-bold text-gray-900 dark:text-white text-center"
        >
            FindProject<sup class="font-thin">alpha</sup>
        </h1>
        <h3 class="text-1xl text-muted-foreground font-light pb-2 text-center">
            Discover and track project expenditure over time.
        </h3>
    </div>
    <div class="hidden md:block">
        <Resizable.PaneGroup
            direction="horizontal"
            class="h-full max-h-[800px] items-stretch rounded-md border "
        >
            <Resizable.Pane defaultSize={defaultLayout[0]}>
                <div class="relative">
                    <div class="grid w-full p-4">
                        <Search
                            class="absolute top-7 left-6 h-4 w-4 text-muted-foreground"
                        />
                        <!-- <div class="relative"> -->
                        <!--  -->
                        <Input
                            bind:value={searchTerm}
                            placeholder="Search for a project..."
                            class="pl-8"
                        />
                    </div>
                    <!-- </div> -->
                </div>
                <Separator />
                <ScrollArea class="p-4 h-screen" orientation="vertical">
                    <div class="flex flex-col gap-2 pt-0">
                        <!-- {#await results}
                    <p class="text-center text-muted-foreground">Loading...</p>
                {:then data} -->
                        {#if results.length > 2}
                            {#each results as item}
                                <button
                                    class={cn(
                                        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                                        $projectStore.selected ===
                                            item.project_hash && "bg-muted",
                                    )}
                                    on:click={() =>
                                        projectStore.setProject(
                                            item.project_hash,
                                        )}
                                >
                                    <div class="flex w-full flex-col gap-1">
                                        <div class="flex items-center">
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <div
                                                    class="line-clamp-1 font-semibold"
                                                    title={item.project_title}
                                                >
                                                    {item.project_title}
                                                </div>
                                                <!-- {#if !item.read}
                                            <span class="flex h-2 w-2 rounded-full bg-blue-600" />
                                        {/if} -->
                                            </div>
                                            <div
                                                class={cn(
                                                    "ml-auto text-xs",
                                                    $projectStore.selected ===
                                                        item.id
                                                        ? "text-foreground"
                                                        : "text-muted-foreground",
                                                )}
                                            >
                                                {item.recentYear}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-xs font-light">
                                        {item.ministry}
                                    </div>
                                </button>
                            {/each}

                            <!-- </div> -->
                        {:else if searchTerm === "" || searchTerm === " " || searchTerm === undefined}
                            <p class="text-muted-foreground m-auto">
                                Start searching!
                            </p>
                        {:else}
                            <div>
                                <!-- <div class="h-[calc(100dvh)] flex items-center"> -->
                                <p class="text-muted-foreground m-auto">
                                    No results found for "{searchTerm}". Try
                                    something else?
                                </p>
                                <!-- </div> -->
                            </div>
                        {/if}
                    </div>
                </ScrollArea></Resizable.Pane
            >
            <Resizable.Handle withHandle />
            <Resizable.Pane class="p-4 " defaultSize={defaultLayout[1]}>
                {#if $projectStore.selected !== null && results.length}
                    <div class="flex flex-col gap-2 pt-0">
                        <ProjectDisplay
                            chart_options={chartOptions}
                            expenditureData={results.find(
                                (item) =>
                                    item.project_hash ===
                                    $projectStore.selected,
                            ) || null}
                        />
                    </div>
                {/if}
            </Resizable.Pane>
        </Resizable.PaneGroup>
    </div>
    <div>
        <div class="pt-6">
            <h3 class="text-2xl font-light">Data Source</h3>
            <span class="text-sm font-light text-gray-500 dark:text-gray-400"
                >Expenditure data is sourced from the <a
                    class="text-blue-600 after:content-['_↗'] ..."
                    href="https://www.mof.gov.sg/singaporebudget"
                    target="_blank"
                >
                    Ministry of Finance (MOF) Singapore Budget website
                </a>
            </span>
        </div>
    </div>

    <div></div>

    <!-- </div> -->

    <!-- {#await budgetOverview}
        <div>Loading...</div>
    {:then data}
        {#if budgetOverview.length > 0}
            <Treemap {data} />
        {:else}
            <div class="h-[600px] border rounded flex items-center">
                <div class="mx-auto">
                    <p class="text-center text-4xl animate-pulse">Loading...</p>
                </div>
            </div>
        {/if}
    {:catch error}
        <div>Error: {error.message}</div>
    {/await} -->
</div>
