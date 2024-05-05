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
        <Card.Root class="bg-slate-200">
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
        <div class="box">
            <div class="ribbon ribbon-top-right">
                <span>Coming Soon</span>
            </div>

            <Card.Root class="bg-slate-200 opacity-20">
                <Card.Header>
                    <div class="flex justify-center">
                        <ClipboardOutline
                            strokeWidth="1.5"
                            class="h-24 w-24 mr-2 justify-center"
                        ></ClipboardOutline>
                    </div>

                    <Card.Title class="text-2xl text-center"
                        >Projects</Card.Title
                    >
                    <Card.Description class="text-xl text-center"
                        >See in-depth spending by projects</Card.Description
                    >
                </Card.Header>
                <Card.Content>
                    <div class="flex justify-center">
                        <Button color="primary">View</Button>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>

<style>
    .box {
        position: relative;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    }

    /* common */
    .ribbon {
        width: 150px;
        height: 150px;
        overflow: hidden;
        position: absolute;
    }
    .ribbon::before,
    .ribbon::after {
        position: absolute;
        z-index: -1;
        content: "";
        display: block;
        border: 5px solid rgb(153 27 27 / var(--tw-bg-opacity));
    }
    .ribbon span {
        position: absolute;
        display: block;
        width: 225px;
        padding: 15px 0;
        background-color: rgb(153 27 27 / var(--tw-bg-opacity));
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        color: #fff;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        text-transform: uppercase;
        text-align: center;
    }

    /* top left*/
    .ribbon-top-left {
        top: -10px;
        left: -10px;
    }
    .ribbon-top-left::before,
    .ribbon-top-left::after {
        border-top-color: transparent;
        border-left-color: transparent;
    }
    .ribbon-top-left::before {
        top: 0;
        right: 0;
    }
    .ribbon-top-left::after {
        bottom: 0;
        left: 0;
    }
    .ribbon-top-left span {
        right: -25px;
        top: 30px;
        transform: rotate(-45deg);
    }

    /* top right*/
    .ribbon-top-right {
        top: -10px;
        right: -10px;
    }
    .ribbon-top-right::before,
    .ribbon-top-right::after {
        border-top-color: transparent;
        border-right-color: transparent;
    }
    .ribbon-top-right::before {
        top: 0;
        left: 0;
    }
    .ribbon-top-right::after {
        bottom: 0;
        right: 0;
    }
    .ribbon-top-right span {
        left: -25px;
        top: 30px;
        transform: rotate(45deg);
    }

    /* bottom left*/
    .ribbon-bottom-left {
        bottom: -10px;
        left: -10px;
    }
    .ribbon-bottom-left::before,
    .ribbon-bottom-left::after {
        border-bottom-color: transparent;
        border-left-color: transparent;
    }
    .ribbon-bottom-left::before {
        bottom: 0;
        right: 0;
    }
    .ribbon-bottom-left::after {
        top: 0;
        left: 0;
    }
    .ribbon-bottom-left span {
        right: -25px;
        bottom: 30px;
        transform: rotate(225deg);
    }

    /* bottom right*/
    .ribbon-bottom-right {
        bottom: -10px;
        right: -10px;
    }
    .ribbon-bottom-right::before,
    .ribbon-bottom-right::after {
        border-bottom-color: transparent;
        border-right-color: transparent;
    }
    .ribbon-bottom-right::before {
        bottom: 0;
        left: 0;
    }
    .ribbon-bottom-right::after {
        top: 0;
        right: 0;
    }
    .ribbon-bottom-right span {
        left: -25px;
        bottom: 30px;
        transform: rotate(-225deg);
    }
</style>
