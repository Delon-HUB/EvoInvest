<template>
  <canvas id="myChart"></canvas>
  <h1>{{ props.title }}</h1>
</template>

<script setup lang="ts">
import { Chart } from 'chart.js/auto'
import { onMounted, watch } from 'vue'

const props = defineProps<{
  title: string
  population: { x: number; y: number }[]
  pareto: { x: number; y: number }[]
}>()

onMounted(() => {
  const chart = new Chart(document.getElementById('myChart') as HTMLCanvasElement, {
    data: {
      datasets: [
        {
          type: 'scatter',
          label: 'Population',
          data: props.population,
        },
        {
          type: 'scatter',
          label: 'Pareto',
          data: props.pareto.sort((a, b) => a.x - b.x),
        },
        {
          type: 'line',
          label: 'Pareto',
          data: props.pareto.sort((a, b) => a.x - b.x),
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          title: {
            display: true,
            text: 'Risque',
          },
        },
        y: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          title: {
            display: true,
            text: 'Rendement',
          },
        },
      },
    },
  })

  watch(
    () => props.title,
    () => {
      chart.data = {
        datasets: [
          {
            type: 'scatter',
            label: 'Population',
            data: props.population,
          },
          {
            type: 'scatter',
            label: 'Pareto',
            data: props.pareto.sort((a, b) => a.x - b.x),
          },
          {
            type: 'line',
            label: 'Pareto',
            data: props.pareto.sort((a, b) => a.x - b.x),
          },
        ],
      }
      chart.update()
    },
  )
})
</script>
