import axios from "axios"

export const exportFloorPlan = async (modelId, apiKey, config) => {
  const url = `https://api.cubi.casa/exporter/floorplan/${modelId}`


  const res = await axios.post(url, config, {
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json"
    }
  })

  return res.data
}
