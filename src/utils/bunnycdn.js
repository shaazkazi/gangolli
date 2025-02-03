const BUNNY_STORAGE_ZONE = 'YOUR_STORAGE_ZONE'
const BUNNY_API_KEY = 'YOUR_API_KEY'
const BUNNY_ZONE_REGION = 'YOUR_REGION'

export const uploadToBunnyCDN = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${file.name}`, {
    method: 'PUT',
    headers: {
      'AccessKey': BUNNY_API_KEY
    },
    body: formData
  })

  return `https://${BUNNY_STORAGE_ZONE}.b-cdn.net/${file.name}`
}
