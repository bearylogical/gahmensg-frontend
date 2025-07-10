<script lang="ts">
  export let value: number = 0.01;
  export let sliderText: string = "Value";
</script>

<div class="sankey-controls">
  <div class="sankey-controls__row">
    <span class="sankey-controls__label">{sliderText}:</span>
    <span class="sankey-controls__value">{value.toLocaleString()}</span>
  </div>
  <div class="sankey-controls__row">
    <div class="sankey-controls__slider">
      <input type="range" min="0.3" max="10" step="0.01" bind:value />
    </div>
    <div class="sankey-controls__reset">
      <button on:click={() => (value = 5)}>Reset</button>
    </div>
  </div>
</div>

<style>
  .sankey-controls {
    display: flex;
    flex-direction: column; /* Changed to column */
    gap: 10px; /* Adds space between the rows */
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    width: fit-content; /* Make the container fit its content */
  }

  .sankey-controls__row {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Distribute items in the row */
    width: 100%; /* Ensure rows take full width of the parent */
  }

  .sankey-controls__label {
    font-size: 16px;
    margin-right: 10px; /* Add some space between label and value */
  }

  .sankey-controls__value {
    font-weight: bold;
    min-width: 50px; /* Give it a minimum width to prevent jumping */
    text-align: right; /* Align value to the right */
  }

  .sankey-controls__slider {
    flex-grow: 1; /* Allows the slider to take up available space */
    margin-right: 10px; /* Space between slider and reset button */
  }

  .sankey-controls__slider input[type="range"] {
    width: 100%; /* Make the slider fill its container */
  }

  .sankey-controls__reset button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  .sankey-controls__reset button:hover {
    background-color: #0056b3;
  }
  .sankey-controls__reset button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
  }
  .sankey-controls__reset button:active {
    background-color: #004085;
  }
</style>
