<template>
  <q-list bordered padding class="rounded-borders fit">
    <q-item-label header>Actif</q-item-label>

    <q-item clickable v-ripple>
      <q-item-section avatar top>
        <q-avatar icon="assignment" color="grey" text-color="white" />
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1">Expenses spreadsheet</q-item-label>
        <q-item-label caption>March 2nd, 2019</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="info" />
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple>
      <q-item-section avatar top>
        <q-avatar icon="place" color="grey" text-color="white" />
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1">Places to visit</q-item-label>
        <q-item-label caption>February 22, 2019</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="info" color="amber" />
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple>
      <q-item-section avatar top>
        <q-avatar icon="library_music" color="grey" text-color="white" />
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1">My favorite song</q-item-label>
        <q-item-label caption>Singing it all day</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="info" />
      </q-item-section>
    </q-item>

    <q-separator spaced />

    <q-item-label header>Paramètre de l'algorithme</q-item-label>
    <q-item v-ripple>
      <q-item-section>
        <q-item-label lines="1">Nombre de génération</q-item-label>
        <q-item-label>
          <q-input color="green" type="number" outlined v-model="generation" min="0">
            <template v-slot:prepend>
              <q-btn rounded dense flat icon="remove" color="grey" class="bg-grey-3" />
            </template>
            <template v-slot:append>
              <q-btn
                rounded
                dense
                flat
                icon="add"
                color="green"
                class="bg-light-green-1"
              /> </template
          ></q-input>
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-ripple>
      <q-item-section>
        <q-item-label lines="1">Taille de la population</q-item-label>
        <q-item-label>
          <q-input color="green" type="number" outlined v-model="population" min="0">
            <template v-slot:prepend>
              <q-btn rounded dense flat icon="remove" color="grey" class="bg-grey-3" />
            </template>
            <template v-slot:append>
              <q-btn
                rounded
                dense
                flat
                icon="add"
                color="green"
                class="bg-light-green-1"
              /> </template
          ></q-input>
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-ripple>
      <q-item-section>
        <q-item-label lines="1">Taux de mutation (%)</q-item-label>
        <q-item-label>
          <q-input color="green" type="number" outlined v-model="mutation" min="0">
            <template v-slot:prepend>
              <q-btn rounded dense flat icon="remove" color="grey" class="bg-grey-3" />
            </template>
            <template v-slot:append>
              <q-btn
                rounded
                dense
                flat
                icon="add"
                color="green"
                class="bg-light-green-1"
              /> </template
          ></q-input>
        </q-item-label>
      </q-item-section>
    </q-item>

    <div>
      <q-btn @click="parameterChanged" label="Appliquer" color="positive" no-caps class="fit" />
    </div>
  </q-list>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const generation = ref('10')
const population = ref('5')
const mutation = ref('10')

const parameters = computed(() => ({
  generationSize: Math.sqrt(Math.pow(parseFloat(generation.value), 2)) || 0,
  populationSize: Math.sqrt(Math.pow(parseFloat(population.value), 2)) || 0,
  mutationRate: Math.sqrt(Math.pow(parseFloat(mutation.value), 2)) / 100 || 0,
}))

const emits = defineEmits(['parameter_changed'])

const parameterChanged = () => {
  emits('parameter_changed', parameters.value)
}
</script>
