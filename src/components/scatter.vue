<template>
  <canvas id="myChart"></canvas>
  <h1>{{ props.title }}</h1>
</template>

<script setup lang="ts">
import type { IPoint } from '@/interfaces/types'
import { Chart } from 'chart.js/auto'
import { onMounted, watch } from 'vue'

const props = defineProps<{
  title: string
  population: IPoint[]
  pareto: IPoint[]
}>()

onMounted(() => {
  const chart = new Chart(document.getElementById('myChart') as HTMLCanvasElement, {
    data: {
      datasets: [
        {
          type: 'scatter',
          label: 'Solution testée',
          data: props.population,
        },
        {
          type: 'scatter',
          label: 'Meilleur solution',
          data: props.pareto.sort((a, b) => a.x - b.x),
          borderColor: 'green',
          backgroundColor: 'green',
        },
        {
          type: 'line',
          label: 'Meilleur solution',
          data: props.pareto.sort((a, b) => a.x - b.x),
          borderColor: 'red',
          backgroundColor: 'red',
        },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const point: IPoint = context.raw as IPoint
              return `Rendement: ${point.y}%\nRisque: ${point.x}%\nPoids: [${point.weights.map((w) => w + '%')}]`
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          title: {
            display: true,
            text: 'Risque',
            color: 'red',
          },
        },
        y: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          title: {
            display: true,
            text: 'Rendement',
            color: 'green',
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
            borderColor: 'green',
            backgroundColor: 'green',
          },
          {
            type: 'line',
            label: 'Meilleur solution',
            data: props.pareto.sort((a, b) => a.x - b.x),
            borderColor: 'red',
          },
        ],
      }
      chart.update()
    },
  )
})
</script>
