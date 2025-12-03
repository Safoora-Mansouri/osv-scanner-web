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

export async function fetchVulnerabilitiesForPackage(
  name: string,
  version: string
): Promise<PackageVulnerabilityResult> {
  const body = {
    package: {
      name,
      ecosystem: 'npm'
    },
    version
  }

  const response = await fetch(OSV_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
   
    return {
      packageName: name,
      version,
      vulnerabilities: []
    }
  }

  const data = await response.json()

  return {
    packageName: name,
    version,
    vulnerabilities: data.vulns ?? []
  }
}
