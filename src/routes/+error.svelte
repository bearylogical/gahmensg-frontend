<script>
    import { page } from "$app/stores";
    import Page404 from "$lib/components/layout/pages/Page404.svelte";
    import Page500 from "$lib/components/layout/pages/Page500.svelte";
    import { Button } from "flowbite-svelte";
</script>

<div class="mx-auto container pt-10">
    {#if $page.status === 404}
        <Page404>
            <svelte:fragment slot="h1">404</svelte:fragment>
            <svelte:fragment slot="paragraph">
                <p
                    class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white"
                >
                    Something's missing.
                </p>
                <p
                    class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400"
                >
                    Sorry, we can't find that page. You'll find lots to explore
                    on the home page.
                </p>
                <Button href="/" size="lg" color="red"
                    >Back to GahmenExplorer</Button
                >
            </svelte:fragment>
        </Page404>
    {:else if $page.status === 200}
        <slot />
    {:else}
        <Page500>
            <svelte:fragment slot="h1">{$page.status}</svelte:fragment>
            <svelte:fragment slot="paragraph">
                <p
                    class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white"
                >
                    Internal Server Error.
                </p>
                <p
                    class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400"
                >
                    We are already working to solve the problem.
                </p>
            </svelte:fragment>
        </Page500>
    {/if}
</div>
