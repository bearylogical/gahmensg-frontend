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
    interface for exploring various government data sources. The word <i
      >Gahmen</i
    > is a local colloquial term for "government" in Singapore.
  </p>

  <h2 class="text-3xl font-bold text-gray-900 dark:text-white pt-8 pb-6">
    Frequently Asked Questions
  </h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Accordion.Root class="w-full sm:max-w-[90%]">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Why GahmenExplorer?</Accordion.Trigger>
          <Accordion.Content>
            <p>
              The amount of information on the Singapore Government can be
              pretty overwhelming as the data can come from a variety of sources
              and it can be challenging to have it presented in a single
              overview. GahmenExplorer addresses that gap by consolidating
              information and summarizing it using data visualization
              techniques.
            </p>
            <br />
            <p>
              Over time, we hope to add more features and data sources as well
              as serve as a repository for data storytelling on Singapore
              grounded in public information to enable a more informed
              citizenry.
            </p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>Where does the data come from?</Accordion.Trigger>
          <Accordion.Content>
            The data is sourced from a number of government sources that are
            publicly available.

            <ul class="list-disc list-inside">
              <li>
                For the Government Directory:
                <a
                  class="text-blue-600 after:content-['_↗'] ..."
                  href="https://www.sgdi.gov.sg/"
                  target="_blank"
                  >Singapore Government Directory.
                </a>
              </li>
              <li>
                For the Singapore Budget:
                <a
                  class="text-blue-600 after:content-['_↗'] ..."
                  href="https://www.mof.gov.sg/singaporebudget"
                  target="_blank"
                  >Ministry of Finance.
                </a>
              </li>
            </ul></Accordion.Content
          >
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger>Can I have access to the data?</Accordion.Trigger>
          <Accordion.Content>
            Currently, the data is not available for download. However, we are
            working on making the data available for download in the future.
            <br />
            <br />
            This will likely be in the form of an Application Programming Interface
            (API) that will allow developers and researchers to access the data programmatically.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
    <div>
      <Accordion.Root class="w-full sm:max-w-[90%]">
        <Accordion.Item value="item-1">
          <Accordion.Trigger
            >I would like to contribute technically!</Accordion.Trigger
          >
          <Accordion.Content
            >Thanks for your enthusiasm in contributing! At present the site is
            still in very early stages of development and will likely have a lot
            of bugs and missing features. If you would like to contribute,
            please feel free to reach out to me <a
              class="text-blue-600 after:content-['_↗'] ..."
              href="mailto:bearylogical@duck.com"
              target="_blank"
              >here
            </a>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger
            >I have an idea, can we collaborate?</Accordion.Trigger
          >
          <Accordion.Content>
            That's great! I'm always open to new ideas - please feel free to
            reach out to me <a
              class="text-blue-600 after:content-['_↗'] ..."
              href="mailto:bearylogical@duck.com"
              target="_blank"
              >here
            </a>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger>How is this site created?</Accordion.Trigger>
          <Accordion.Content>
            The site is created using SvelteKit, a framework for building web
            applications. The data is sourced from various government sources
            and is processed and visualized using D3.js. The backend that powers
            the site is written in Golang.
            <br />
            <br />
            A brief technical writeup of the data sourcing process is available
            <a
              class="text-blue-600 after:content-['_↗'] ..."
              href="https://bearylogical.net/blog/budget-sg/parsing-budget-sg-aws-textract"
              target="_blank"
            >
              on my personal blog
            </a>.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  </div>
</div>
