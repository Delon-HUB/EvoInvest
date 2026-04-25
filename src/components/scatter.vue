<template>
  <q-card flat>
    <p class="text-h5 text-bold text-center">{{ props.title }}</p>
    <canvas id="myChart" class="graph"></canvas>
    <p>
      Plus haut = plus rentable<q-icon name="arrow_upward" color="positive" size="24px" />Plus à
      gauche = Moins risqué<q-icon name="arrow_back" color="negative" size="24px" />
    </p>
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
          },
        },
        y: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          title: {
            display: true,
            text: 'Rendement(%)',
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

<style scoped>
.graph {
  max-height: 600px;
}
</style>
