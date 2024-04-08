<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion/index.js";
</script>

<div class="mx-auto container pt-10">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
        What is GahmenExplorer?
    </h2>
    <p
        class="text-lg font-light text-gray-500 dark:text-gray-400 whitespace-normal pt-4"
    >
        GahmenExplorer is a web application that aims to provide a user-friendly
        interface for exploring various government data sources.
    </p>
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white pt-8 pb-6">
        Frequently Asked Questions
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <Accordion.Root class="w-full sm:max-w-[90%]">
                <Accordion.Item value="item-1">
                    <Accordion.Trigger>Why GahmenExplorer</Accordion.Trigger>
                    <Accordion.Content
                        >Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content
                    >
                </Accordion.Item>
                <Accordion.Item value="item-2">
                    <Accordion.Trigger
                        >Where does the data come from?</Accordion.Trigger
                    >
                    <Accordion.Content>
                        Yes. It comes with default styles that matches the other
                        components' aesthetic.
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="item-3">
                    <Accordion.Trigger
                        >Can I have access to the data?</Accordion.Trigger
                    >
                    <Accordion.Content>
                        Yes. It's animated by default, but you can disable it if
                        you prefer.
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        </div>
        <div>
            <Accordion.Root class="w-full sm:max-w-[90%]">
                <Accordion.Item value="item-1">
                    <Accordion.Trigger
                        >I would like to contribute!</Accordion.Trigger
                    >
                    <Accordion.Content
                        >Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content
                    >
                </Accordion.Item>
                <Accordion.Item value="item-2">
                    <Accordion.Trigger
                        >I have an idea, can we collaborate?</Accordion.Trigger
                    >
                    <Accordion.Content>
                        Yes. It comes with default styles that matches the other
                        components' aesthetic.
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="item-3">
                    <Accordion.Trigger
                        >How is this site created?</Accordion.Trigger
                    >
                    <Accordion.Content>
                        Yes. It's animated by default, but you can disable it if
                        you prefer.
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        </div>
    </div>
</div>
