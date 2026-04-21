<template>
  <q-card flat style="width: 800px; height: 600px">
    <canvas id="myChart"></canvas>
    <p class="text-h5 text-bold text-center">{{ props.title }}</p>
  </q-card>
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
          backgroundColor: 'rgba(100,100,100,0.5)',
          pointRadius: 4,
        },
        {
          type: 'scatter',
          label: 'Meilleur solution',
          data: props.pareto.sort((a, b) => a.x - b.x),
          backgroundColor: 'green',
          borderColor: 'green',
          pointRadius: 5,
        },
        {
          type: 'line',
          label: 'Meilleur solution',
          data: props.pareto.sort((a, b) => a.x - b.x),
          borderColor: 'green',
          borderWidth: 2,
          fill: true,
          tension: 0.5,
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
            text: 'Risque(%)',
            color: 'red',
          },
        },
        y: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          title: {
            display: true,
            text: 'Rendement(%)',
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
            backgroundColor: 'rgba(100,100,100,0.5)',
            pointRadius: 4,
          },
          {
            type: 'scatter',
            label: 'Pareto',
            data: props.pareto.sort((a, b) => a.x - b.x),
            backgroundColor: 'green',
            borderColor: 'green',
            pointRadius: 5,
          },
          {
            type: 'line',
            label: 'Meilleur solution',
            data: props.pareto.sort((a, b) => a.x - b.x),
            borderColor: 'green',
            borderWidth: 2,
            fill: true,
            tension: 0.5,
          },
        ],
      }
      chart.update()
    },
  )
})
</script>
