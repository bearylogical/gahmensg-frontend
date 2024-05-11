<script>
    import Section from "$lib/components/Section.svelte";
    import { Github } from "lucide-svelte";
    import Button from "$lib/components/ui/button/button.svelte";
</script>

<Section>
    <div class="container">
        <h1
            class="text-4xl font-bold text-gray-900 dark:text-white text-center"
        >
            Questions / Bugs / Feature Requests?
        </h1>
        <h3 class="pt-10 text-2xl text-gray-900 dark:text-white text-center">
            Leave a note in the GahmenExplorer repository.
        </h3>
        <div class="flex justify-center pt-10">
            <Button
                color="primary"
                href="https://github.com/bearylogical/gahmensg-frontend/issues"
                ><Github class="mr-2 h-5 w-5" />Go to Github</Button
            >
        </div>
    </div>
</Section>
