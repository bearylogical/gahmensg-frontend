<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { ClipboardOutline } from "flowbite-svelte-icons";
    import { BuildingOutline } from "flowbite-svelte-icons";
    import { Button } from "$lib/components/ui/button";
</script>

<div class="container">
    <div class="px-10 sm:px-4 py-8 mx-auto md:px-12 lg:gap-8 xl:gap-0 lg:py-16">
        <h1
            class="text-4xl font-bold text-gray-900 dark:text-white text-center"
        >
            Explore the Singapore Budget.
        </h1>

        <h3 class="text-2xl text-gray-400 pt-8 text-center">
            BudgetGoWhere helps you to understand what the Singapore government
            is spending on.
        </h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <Card.Root class="bg-slate-200 ">
            <Card.Header>
                <div>
                    <div class="flex justify-center">
                        <ClipboardOutline
                            strokeWidth="1.5"
                            class="h-24 w-24 mr-2 justify-center"
                        ></ClipboardOutline>
                    </div>
                </div>

                <Card.Title class="text-2xl text-center"
                    >Overall Spending
                </Card.Title>
                <Card.Description class="text-xl text-center"
                    >Get an overview of the budget</Card.Description
                >
            </Card.Header>
            <Card.Content>
                <div class="flex justify-center">
                    <Button color="primary" href="/budget/overview">
                        View
                    </Button>
                </div>
            </Card.Content>
        </Card.Root>

        <Card.Root class="bg-slate-200">
            <Card.Header>
                <div>
                    <div class="flex justify-center">
                        <BuildingOutline
                            strokeWidth="1.5"
                            class="h-24 w-24 mr-2 justify-center"
                        ></BuildingOutline>
                    </div>
                </div>

                <Card.Title class="text-2xl text-center"
                    >Ministry / Organs of State
                </Card.Title>
                <Card.Description class="text-xl text-center"
                    >Get spending by Government body</Card.Description
                >
            </Card.Header>
            <Card.Content>
                <div class="flex justify-center">
                    <Button color="primary" href="/budget/ministry">
                        View
                    </Button>
                </div>
            </Card.Content>
        </Card.Root>
        <Card.Root class="bg-slate-200 ">
            <Card.Header>
                <div class="flex justify-center">
                    <ClipboardOutline
                        strokeWidth="1.5"
                        class="h-24 w-24 mr-2 justify-center"
                    ></ClipboardOutline>
                </div>

                <Card.Title class="text-2xl text-center">Projects</Card.Title>
                <Card.Description class="text-xl text-center"
                    >See in-depth spending by projects</Card.Description
                >
            </Card.Header>
            <Card.Content>
                <div class="flex justify-center">
                    <Button color="primary" href="/budget/project">View</Button>
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</div>
