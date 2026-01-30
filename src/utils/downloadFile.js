export const downloadJson = (filename, data) => {
  const plain = JSON.parse(JSON.stringify(data))

  const blob = new Blob(
    [JSON.stringify(plain, null, 2)],
    { type: "application/json;charset=utf-8" }
  )

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

