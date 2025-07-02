<script lang="ts">
  import Search from "lucide-svelte/icons/search";
  import X from "lucide-svelte/icons/x";
  import Input from "$lib/components/ui/input/input.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Separator } from "$lib/components/ui/separator";
  import * as Resizable from "$lib/components/ui/resizable";
  import { projectStore } from "$lib/stores/projectStore";
  import { cn } from "$lib/utils/utils";
  import ProjectDisplay from "./(components)/project-display.svelte";
  import { chartOptions } from "$lib/components/MinistryDashboard/chart_options";

  import { fetchProjects, fetchProjectById } from "$lib/utils/handlers";
  import { getMostRecentYearData } from "$lib/utils/dataUtils";
  import { digestMessage } from "$lib/utils/utils";

  import type { Project, ProjectRecord } from "$lib/stores/projectStore";

  export let data;
  let searchTerm: string = data.searchTerm || "";
  let projectId: string | null = data.projectId || null;
  let results: Project[] = [];
  let errorMessage: string | null = null;
  let singleProject: Project | null = null;
  let previousSearchTerm: string = "";

  const defaultLayout = [265, 655, 655];

  const unique = <T, K>(arr: T[], fn: (item: T) => K): K[] => {
    const seen = new Set<K>();
    return arr.filter((item) => {
      const key = fn(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    }).map(fn);
  };

  const uniqueProjectIds = (arr: ProjectRecord[]): number[] =>
    unique(arr, (x) => x["project_id"]).filter(
      (id): id is number => id !== undefined
    ) as number[];

  const mapKeys = <T>(
    obj: { [key: string]: T[] },
    fn: (val: T[], key: string, obj: { [key: string]: T[] }) => string
  ) =>
    Object.keys(obj).reduce((acc: { [key: string]: T[] }, k: string) => {
      acc[fn(obj[k], k, obj)] = obj[k];
      return acc;
    }, {});

  let timeout: NodeJS.Timeout;

  function clearSearch() {
    searchTerm = "";
    results = [];
    singleProject = null;
    errorMessage = null;
    projectId = null; // Clear projectId as well
    projectStore.clear();
  }

  async function handleSearch(event) {
    searchTerm = event.target.value;
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      if (searchTerm === previousSearchTerm) {
        return; // Do not send request if search term is unchanged
      }
      errorMessage = null; // Clear previous errors
      singleProject = null; // Clear single project view
      try {
        if (searchTerm && searchTerm.length > 2) {
          const data: ProjectRecord[] = await fetchProjects(searchTerm);
          let f = data.map((v) => ({
            ...v,
            stringIdentifier:
              (v.project_title + " " + v.ministry)
                .replaceAll(/[^a-zA-Z]/g, "+")
                .replaceAll(" ", "+")
                .toLowerCase(),
          }));
          f = Object.groupBy(
            f,
            ({ stringIdentifier }: { stringIdentifier: string }) =>
              stringIdentifier
          );

          f = Object.assign(
            {},
            mapKeys(f, (val: ProjectRecord[], key: string) => val[0]?.project_title || "")
          );

          let transformed = [];
          for (const [key, value] of Object.entries(f)) {
            let recentYearData = getMostRecentYearData(value);
            if (!recentYearData) continue; // Skip if no recent year data
            let _res: Project = {
              values: value,
              project_title: key,
              project_identifier: recentYearData.stringIdentifier || "",
              project_ids: uniqueProjectIds(value).filter(
                (id): id is number => id !== undefined
              ),
              ministry: recentYearData.ministry || "",
              recentYear: recentYearData.value_year || 0,
              project_hash: await digestMessage(recentYearData.stringIdentifier || ""),
            };
            transformed.push(_res);
          }
          results = transformed;
          previousSearchTerm = searchTerm; // Update previous search term on successful fetch
        } else {
          projectStore.clear();
          results = [];
          previousSearchTerm = searchTerm; // Update previous search term
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        errorMessage = "Failed to fetch projects. Please try again later.";
        results = [];
        previousSearchTerm = searchTerm; // Update previous search term even on error
      }
    }, 300);
  }

  // Initial load of results if a search term is present from the URL
  $: if (searchTerm && searchTerm.length > 2 && results.length === 0 && !errorMessage && !projectId) {
    handleSearch({ target: { value: searchTerm } });
  }

  // Handle project ID from URL
  $: if (projectId) {
    (async () => {
      errorMessage = null; // Clear previous errors
      try {
        const data: ProjectRecord[] = await fetchProjectById(projectId);
        if (data && data.length > 0) {
          let f = data.map((v) => ({
            ...v,
            stringIdentifier:
              (v.project_title + " " + v.ministry)
                .replaceAll(/[^a-zA-Z]/g, "+")
                .replaceAll(" ", "+")
                .toLowerCase(),
          }));
          f = Object.groupBy(
            f,
            ({ stringIdentifier }: { stringIdentifier: string }) =>
              stringIdentifier
          );

          f = Object.assign(
            {},
            mapKeys(f, (val: ProjectRecord[], key: string) => val[0]?.project_title || "")
          );

          let transformed = [];
          for (const [key, value] of Object.entries(f)) {
            let recentYearData = getMostRecentYearData(value);
            if (!recentYearData) continue; // Skip if no recent year data
            let _res: Project = {
              values: value,
              project_title: key,
              project_identifier: recentYearData.stringIdentifier || "",
              project_ids: uniqueProjectIds(value).filter(
                (id): id is number => id !== undefined
              ),
              ministry: recentYearData.ministry || "",
              recentYear: recentYearData.value_year || 0,
              project_hash: await digestMessage(recentYearData.stringIdentifier || ""),
            };
            transformed.push(_res);
          }
          singleProject = transformed[0]; // Assuming only one project for a given ID
          results = []; // Clear search results
          searchTerm = ""; // Clear search term
        } else {
          errorMessage = "Project not found for the given ID.";
          singleProject = null;
        }
      } catch (error) {
        console.error("Error fetching project by ID:", error);
        errorMessage = "Failed to fetch project by ID. Please try again later.";
        singleProject = null;
      }
    })();
  }
</script>

<div class="mx-auto container pt-4">
  <div class="px-10 sm:px-4 py-2 mx-auto md:px-12 lg:gap-8 xl:gap-0 lg:py-16">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white text-center">
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
            <Input
              value={searchTerm}
              on:input={handleSearch}
              placeholder="Search for a project..."
              class="pl-8 pr-8"
            />
            {#if searchTerm}
              <button on:click={clearSearch} class="absolute top-7 right-6 h-4 w-4 text-muted-foreground">
                <X />
              </button>
            {/if}
          </div>
        </div>
        <Separator />
        <ScrollArea class="p-4 h-screen" orientation="vertical">
          <div class="flex flex-col gap-2 pt-0">
            {#if singleProject}
              <button
                class={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  $projectStore.selected === singleProject.project_hash && "bg-muted"
                )}
                on:click={() => projectStore.setProject(singleProject.project_hash)}
              >
                <div class="flex w-full flex-col gap-1">
                  <div class="flex items-center">
                    <div class="flex items-center gap-2">
                      <div
                        class="line-clamp-1 font-semibold"
                        title={singleProject.project_title}
                      >
                        {singleProject.project_title}
                      </div>
                    </div>
                    <div
                      class={cn(
                        "ml-auto text-xs",
                        $projectStore.selected === singleProject.project_hash
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {singleProject.recentYear}
                    </div>
                  </div>
                </div>
                <div class="text-xs font-light">
                  {singleProject.ministry}
                </div>
              </button>
            {:else if results.length > 0}
              {#each results as item}
                <button
                  class={cn(
                    "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                    $projectStore.selected === item.project_hash && "bg-muted"
                  )}
                  on:click={() => projectStore.setProject(item.project_hash)}
                >
                  <div class="flex w-full flex-col gap-1">
                    <div class="flex items-center">
                      <div class="flex items-center gap-2">
                        <div
                          class="line-clamp-1 font-semibold"
                          title={item.project_title}
                        >
                          {item.project_title}
                        </div>
                      </div>
                      <div
                        class={cn(
                          "ml-auto text-xs",
                          $projectStore.selected === item.project_hash
                            ? "text-foreground"
                            : "text-muted-foreground"
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
            {:else if searchTerm === "" || searchTerm === " " || searchTerm === undefined}
              <p class="text-muted-foreground m-auto">Start searching!</p>
            {:else if errorMessage}
              <p class="text-red-500 m-auto">{errorMessage}</p>
            {:else}
              <div>
                <p class="text-muted-foreground m-auto">
                  No results found for "{searchTerm}". Try something else?
                </p>
              </div>
            {/if}
          </div>
        </ScrollArea></Resizable.Pane
      >
      <Resizable.Handle withHandle />
      <Resizable.Pane class="p-4 " defaultSize={defaultLayout[1]}>
        {#if singleProject}
          <div class="flex flex-col gap-2 pt-0">
            <ProjectDisplay
              chart_options={chartOptions}
              expenditureData={singleProject}
            />
          </div>
        {:else if $projectStore.selected !== null && results.length}
          <div class="flex flex-col gap-2 pt-0">
            <ProjectDisplay
              chart_options={chartOptions}
              expenditureData={results.find(
                (item) => item.project_hash === $projectStore.selected
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
</div>
