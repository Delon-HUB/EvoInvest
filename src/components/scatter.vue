<template>
  <canvas id="myChart"></canvas>
  <h1>{{ props.title }}</h1>
</template>

<script setup lang="ts">
import { Chart, Title } from 'chart.js/auto'
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
          data: props.pareto.sort((a, b) => a.y - b.y),
        },
        {
          type: 'line',
          label: 'Pareto',
          data: props.pareto.sort((a, b) => a.y - b.y),
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          max: 50,
          title: {
            display: true,
            text: 'Rendement',
          },
        },
        y: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          max: 50,
          title: {
            display: true,
            text: 'Risque',
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
            data: props.pareto.sort((a, b) => a.y - b.y),
          },
          {
            type: 'line',
            label: 'Pareto',
            data: props.pareto.sort((a, b) => a.y - b.y),
          },
        ],
      }
      chart.update()
    },
  )
})
</script>
