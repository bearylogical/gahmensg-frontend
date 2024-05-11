<script lang="ts">
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import { HomeSolid } from "flowbite-svelte-icons";
    import { page } from "$app/stores";

    let breadcrumbs: { label: string; link: string }[] = [];
    const navCrumbs = [
        { label: "BudgetGoWhere", link: "/budget" },
        { label: "Ministries", link: "/budget/ministry" },
        { label: "Overview", link: "/budget/overview" },
    ];

    function getBreadcrumbs() {
        const currentPage = $page.route.id;
        const breadcrumbs = [];
        if (currentPage === "/budget") {
            breadcrumbs.push(navCrumbs[0]);
        } else if (currentPage === "/budget/ministry") {
            breadcrumbs.push(navCrumbs[0]);
            breadcrumbs.push(navCrumbs[1]);
        } else if (currentPage === "/budget/overview") {
            breadcrumbs.push(navCrumbs[0]);
            breadcrumbs.push(navCrumbs[2]);
        }

        return breadcrumbs;
    }
    $: if ($page) {
        breadcrumbs = getBreadcrumbs();
    }
    // $: breadcrumbs = getBreadcrumbs();
</script>

<div class="flex flex-col">
    <div class="bg-red-800">
        <div class="container">
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    {#each breadcrumbs as breadcrumb, idx}
                        {#if idx !== breadcrumbs.length - 1}
                            <Breadcrumb.Item
                                class="pt-3 pb-3 text-xl font-semibold text-gray-300"
                            >
                                {#if idx === 0}
                                    <Breadcrumb.Link
                                        class="hover:text-gray-300"
                                        href={breadcrumb.link}
                                    >
                                        <div>
                                            <HomeSolid
                                                class="w-6 h-6 inline margin-right-2 mb-1.5"
                                            />
                                            {breadcrumb.label}
                                        </div>
                                    </Breadcrumb.Link>
                                {:else}
                                    <Breadcrumb.Link
                                        class="hover:text-gray-300"
                                        href={breadcrumb.link}
                                        >{breadcrumb.label}</Breadcrumb.Link
                                    >
                                {/if}
                            </Breadcrumb.Item>

                            <Breadcrumb.Separator
                                class="pt-3 pb-3 text-xl font-semibold text-white"
                            />
                        {:else if idx === 0}
                            <Breadcrumb.Page
                                class="pt-3 pb-3 text-xl font-semibold text-white"
                            >
                                <div>
                                    <HomeSolid
                                        class="w-6 h-6 inline margin-right-2 mb-1.5"
                                    />
                                    {breadcrumb.label}
                                </div>
                            </Breadcrumb.Page>
                        {:else}
                            <Breadcrumb.Page
                                class="pt-3 pb-3 text-xl font-semibold text-white"
                                >{breadcrumb.label}</Breadcrumb.Page
                            >
                        {/if}
                    {/each}
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <!-- <h2>BudgetGoWhere</h2> -->
        </div>
    </div>
    <slot />
</div>
