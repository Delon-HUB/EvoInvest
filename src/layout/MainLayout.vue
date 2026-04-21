<template>
  <div>
    <q-layout view="lHh lpr lFf" container style="height: 100vh">
      <q-header>
        <q-toolbar>
          <q-avatar>
            <q-icon size="32px" name="account_balance_wallet" />
          </q-avatar>

          <q-toolbar-title class="text-bold">
            <q-item-label>EvoInvest</q-item-label>
            <q-item-label caption class="text-white">Optimisation de portefeuille</q-item-label>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-footer>
        <q-toolbar>
          <q-toolbar-title class="text-center">
            <q-icon name="copyright" />copyright@2026</q-toolbar-title
          >
        </q-toolbar>
      </q-footer>

      <q-page-container>
        <q-page class="q-pa-md">
          <slot></slot>
        </q-page>
        <q-card flat dark style="border-radius: 0px">
          <q-page class="text-center">
            <q-item-section>
              <p class="text-h5">À propos</p>
              Cette application vous aide à trouver la meilleure façon de répartir votre argent
              entre plusieurs investissements. Elle compare différentes options en tenant compte du
              rendement et du risque, puis met en évidence les choix les plus intéressants. Vous
              pouvez ainsi voir facilement les compromis possibles et choisir celui qui vous
              convient le mieux.
            </q-item-section>
          </q-page>
        </q-card>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts"></script>
