<script setup lang="ts">
import { computed } from 'vue'
import type { PackageJson } from '../types/packageJson'

const props = defineProps<{
  packageJson: PackageJson | null
}>()

const dependencies = computed(() => {
  if (!props.packageJson?.dependencies) return []
  return Object.entries(props.packageJson.dependencies).map(
    ([name, version]) => ({ name, version })
  )
})

const devDependencies = computed(() => {
  if (!props.packageJson?.devDependencies) return []
  return Object.entries(props.packageJson.devDependencies).map(
    ([name, version]) => ({ name, version })
  )
})

const hasData = computed(
  () => dependencies.value.length > 0 || devDependencies.value.length > 0
)
</script>

<template>
  <section v-if="hasData" class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold mb-4">Dependencies</h2>

    <div v-if="dependencies.length">
      <h3 class="font-semibold mb-2">Dependencies</h3>
      <ul class="list-disc pl-5 mb-4">
        <li v-for="dep in dependencies" :key="dep.name">
          {{ dep.name }}: {{ dep.version }}
        </li>
      </ul>
    </div>

    <div v-if="devDependencies.length">
      <h3 class="font-semibold mb-2">Dev Dependencies</h3>
      <ul class="list-disc pl-5">
        <li v-for="dep in devDependencies" :key="dep.name">
          {{ dep.name }}: {{ dep.version }}
        </li>
      </ul>
    </div>
  </section>

  <section v-else class="text-sm text-gray-500 mt-4">
    No data yet. Please upload a package.json file.
  </section>
</template>

