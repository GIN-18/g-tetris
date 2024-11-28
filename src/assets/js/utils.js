export function preventDoubleTap() {
  let lastTouchEnd = 0

  document.documentElement.addEventListener(
    'touchend',
    (event) => {
      let now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    },
    {
      passive: false,
    },
  )
}

export function remapKeys(value) {
  const keys = {
    ' ': 'Space',
    ArrowLeft: '←',
    ArrowRight: '→',
    ArrowDown: '↓',
    ArrowUp: '↑',
  }

  return keys[value] || value
}
