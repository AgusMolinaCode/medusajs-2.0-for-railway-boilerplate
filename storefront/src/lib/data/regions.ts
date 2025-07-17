import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { cache } from "react"
import { HttpTypes } from "@medusajs/types"

export const listRegions = cache(async function () {
  return sdk.store.region
    .list({}, { next: { tags: ["regions"] } })
    .then(({ regions }) => regions)
    .catch(medusaError)
})

export const retrieveRegion = cache(async function (id: string) {
  return sdk.store.region
    .retrieve(id, {}, { next: { tags: ["regions"] } })
    .then(({ region }) => region)
    .catch(medusaError)
})

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = cache(async function (countryCode: string) {
  try {
    // Always force Argentina region
    const regions = await listRegions()

    if (!regions) {
      return null
    }

    // Find Argentina region specifically
    const argentinaRegion = regions.find(region => 
      region.countries?.some(country => country.iso_2 === "ar")
    )

    return argentinaRegion || null
  } catch (e: any) {
    return null
  }
})
