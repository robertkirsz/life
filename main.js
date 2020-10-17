const life = new Life({ fps: 15, cellSize: 4, width: 50, height: 50 })

let inputs = {
  fps: { value: 15, min: 1, max: 60 },
  cellSize: { value: 4, min: 1, max: 30 },
  width: { value: 50, min: 1, max: 400 },
  height: { value: 50, min: 1, max: 400 }
}

const wrapper = document.getElementById('inputs-wrapper')

Object.entries(inputs).forEach(([name, props]) => {
  const id = `${name}-input`
  const documentFragment = document.createDocumentFragment()

  const label = document.createElement('label')
  label.setAttribute('for', id)
  label.innerHTML = `${name}: ${props.value}`

  const input = document.createElement('input')
  input.setAttribute('type', 'range')
  input.setAttribute('id', id)
  input.setAttribute('value', props.value)
  input.setAttribute('min', props.min)
  input.setAttribute('max', props.max)
  input.addEventListener('input', event => {
    const value = parseInt(event.target.value)
    label.innerHTML = `${name}: ${value}`
    inputs[name].value = value
    life.updateValues(name, value)
  })

  documentFragment.appendChild(label)
  documentFragment.appendChild(input)
  wrapper.appendChild(documentFragment)
})

document.getElementById('generate-button').addEventListener('click', life.generate)

document.getElementById('clear-button').addEventListener('click', life.clear)
document.getElementById('step-button').addEventListener('click', life.step)
document.getElementById('start-button').addEventListener('click', life.start)
document.getElementById('stop-button').addEventListener('click', life.stop)
document.getElementById('save-button').addEventListener('click', life.save)

const glider = [
  [0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0]
]

document.getElementById('load-button').addEventListener('click', () => life.load(glider))
