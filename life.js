window.Life = function (config = {}) {
  const id = config.id || 'life'
  let fps = config.fps || 15
  let cellSize = config.cellSize || 4
  let width = config.width || 50
  let height = config.height || 50

  const colors = config.colors || [
    '#0047b3',
    '#0052cc',
    '#005ce6',
    '#0066ff',
    '#1a75ff',
    '#3385ff',
    '#4d94ff',
    '#66a3ff',
    '#80b3ff',
    '#99c2ff'
  ]

  let matrix = createMatrix()

  const canvas = document.getElementById(id)
  canvas.setAttribute('width', cellSize * width)
  canvas.setAttribute('height', cellSize * height)
  canvas.addEventListener('click', paint)
  canvas.addEventListener('mousedown', onMouseDown)
  canvas.addEventListener('mouseup', onMouseUp)
  canvas.addEventListener('mousemove', onMouseMove)

  function createMatrix() {
    return Array(height).fill(Array(width).fill(0))
  }

  const ctx = canvas.getContext('2d')

  function render() {
    canvas.setAttribute('width', cellSize * width)
    canvas.setAttribute('height', cellSize * height)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (!cell) return
        ctx.fillStyle = colors[cell - 1] || colors.slice(-1)[0]
        ctx.fillRect(
          cellIndex * cellSize,
          rowIndex * cellSize,
          cellSize,
          cellSize
        )
      })
    })
  }

  function generate() {
    matrix = Array(height)
      .fill()
      .map(() =>
        Array(width)
          .fill()
          .map(() => Number(Math.random() >= 0.7))
      )

    render()
  }

  function clear() {
    matrix = createMatrix()
    render()
  }

  function step() {
    matrix = matrix.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        const isAlive = Boolean(cell)
        // prettier-ignore
        const numberOfNeighbors = [
          matrix[rowIndex - 1] && matrix[rowIndex - 1][cellIndex - 1],
          matrix[rowIndex - 1] && matrix[rowIndex - 1][cellIndex],
          matrix[rowIndex - 1] && matrix[rowIndex - 1][cellIndex + 1],
          matrix[rowIndex]     && matrix[rowIndex][cellIndex - 1],
          matrix[rowIndex]     && matrix[rowIndex][cellIndex + 1],
          matrix[rowIndex + 1] && matrix[rowIndex + 1][cellIndex - 1],
          matrix[rowIndex + 1] && matrix[rowIndex + 1][cellIndex],
          matrix[rowIndex + 1] && matrix[rowIndex + 1][cellIndex + 1]
        ].filter(Boolean).length;
        if (isAlive && [2, 3].includes(numberOfNeighbors)) return cell + 1 // Survives
        if (!isAlive && numberOfNeighbors === 3) return 1 // Is born
        return 0 // Dies
      })
    )

    render()
  }

  let interval

  const start = () => {
    if (!matrix.length || interval) return
    interval = setInterval(step, 1000 / fps)
  }

  const stop = () => {
    clearInterval(interval)
    interval = null
  }

  function updateValues(name, value) {
    if (['fps', 'cellSize', 'width', 'height'].includes(name)) {
      stop()
      if (name === 'fps') fps = value
      if (name === 'cellSize') cellSize = value
      if (name === 'width') width = value
      if (name === 'height') height = value
      matrix = createMatrix()
      render()
    }
  }

  let isPainting = false

  function onMouseDown(event) {
    isPainting = true
    paint(event)
  }

  function onMouseMove(event) {
    if (isPainting) paint(event)
  }

  function onMouseUp() {
    isPainting = false
  }

  function paint(event) {
    const rect = event.target.getBoundingClientRect()
    const x = event.pageX - rect.left - window.pageXOffset
    const y = event.pageY - rect.top - window.pageYOffset

    matrix = matrix.map((row, rowIndex) =>
      row.map((cell, cellIndex) =>
        cellIndex === Math.floor(x / cellSize) &&
        rowIndex === Math.floor(y / cellSize)
          ? 1
          : cell
      )
    )

    render()
  }

  return { generate, step, render, start, stop, clear, updateValues }
}
