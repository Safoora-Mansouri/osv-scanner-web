/**
 * Composable: usePackageJsonUpload
 *
 * This composable encapsulates all logic related to:
 * - Validating the selected file (must be package.json)
 * - Reading file content via FileReader
 * - Parsing JSON safely in a try/catch block
 * - Emitting a typed PackageJson object via a callback
 *
 * The UI component remains responsible only for layout and events.
 */

import { ref } from 'vue'
import type { PackageJson } from '../types/packageJson'

export function usePackageJsonUpload(onLoaded: (data: PackageJson) => void) {
  // Reactive error message for validation or parsing issues
  const error = ref<string | null>(null)

  /**
   * handleFile
   *
   * Triggered when the user selects a file.
   * Steps:
   * 1. Ensure a file is present.
   * 2. Validate that its name is exactly "package.json".
   * 3. Read the file as text using FileReader.
   * 4. Parse JSON and forward it to the provided callback.
   */
  function handleFile(file: File | null) {
    if (!file) return

    // Validate the file name
    if (file.name !== 'package.json') {
      error.value = 'Please select a package.json file.'
      return
    }

    error.value = null

    const reader = new FileReader()

    /**
     * FileReader.onload:
     * Attempts to parse the file content as JSON.
     * Any parsing errors are caught and reported in the error state.
     */
    reader.onload = () => {
      try {
        const text = reader.result as string
        const json = JSON.parse(text) as PackageJson
        onLoaded(json)
      } catch {
        error.value = 'Invalid JSON file.'
      }
    }

    // Start reading the file as plain text
    reader.readAsText(file)
  }

  return {
    error,
    handleFile
  }
}
