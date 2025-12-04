export interface OsvVulnerability {
  id: string
  summary?: string
  details?: string
  severity?: { type: string; score: string }[]
  references?: { type: string; url: string }[]
}

export interface PackageVulnerabilityResult {
  packageName: string
  version: string
  vulnerabilities: OsvVulnerability[]
}

const OSV_API_URL = 'https://api.osv.dev/v1/query'

// Parse semver range and extract a version string
function parseVersion(versionString: string): string {
  // Remove common semver prefixes and operators 
  const cleaned = versionString.replace(/^[\^~>=<\s]*/, '')
  const parts = cleaned.split(/[\s,]/)
  return (parts[0] || versionString).trim()
}

export async function fetchVulnerabilitiesForPackage(
  name: string,
  version: string
): Promise<PackageVulnerabilityResult> {
  const parsedVersion = parseVersion(version)

  const body = {
    package: {
      name,
      ecosystem: 'npm'
    },
    version: parsedVersion
  }

  try {
    console.log('[OSV] Request body:', body)

    const response = await fetch(OSV_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    console.log('[OSV] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[OSV] HTTP error:', response.status, errorText)

      return {
        packageName: name,
        version: parsedVersion,
        vulnerabilities: []
      }
    }

    const data = await response.json()
    console.log('[OSV] Raw response:', data)

    return {
      packageName: name,
      version: parsedVersion,
      vulnerabilities: data.vulns ?? []
    }
  } catch (error) {
    console.error('[OSV] Fetch failed:', error)
    return {
      packageName: name,
      version: parsedVersion,
      vulnerabilities: []
    }
  }
}

