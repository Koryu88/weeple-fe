<script setup lang="ts">
import { ref, watch, computed, watchEffect, onMounted, onUnmounted, nextTick } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'

interface Props { src: string; query?: string }
const props = defineProps<Props>()

// --- NUOVO REF PER IL FULLSCREEN ---
const rootContainer = ref<HTMLElement | null>(null) // <--- Riferimento al div principale
const isFullscreen = ref(false)                     // <--- Stato del fullscreen

const container = ref<HTMLDivElement | null>(null)

// Viewer state
const page = ref(1)
const scale = ref(1)
const rotation = ref(0)

const { pdf, pages } = usePDF(props.src)
const loading = ref(true)
const loadError = ref<string | null>(null)

// --- LOGICA FULLSCREEN ---
function toggleFullscreen() {
  if (!rootContainer.value) return

  if (!document.fullscreenElement) {
    // Entra in fullscreen
    rootContainer.value.requestFullscreen().catch(err => {
      console.error(`Error enabling fullscreen mode: ${err.message}`);
    })
  } else {
    // Esci da fullscreen
    document.exitFullscreen()
  }
}

function onFullscreenChange() {
  // Aggiorna lo stato (utile se l'utente preme ESC)
  isFullscreen.value = !!document.fullscreenElement
  // Ricalcola la larghezza dopo un breve delay per permettere al browser di ridisegnare
  setTimeout(() => fitWidth(), 200)
}
// -------------------------

async function fitWidth() {
  if (!pdf.value || !container.value) return
  const pdfDoc = await getPdfDoc()
  if (!pdfDoc) return

  try {
    const pageProxy = await pdfDoc.getPage(1)
    const viewport = pageProxy.getViewport({ scale: 1 })

    const containerWidth = container.value.clientWidth
    const newScale = (containerWidth / viewport.width) * 0.99
    scale.value = newScale
  } catch (e) {
    console.error("Failed to fit to width", e)
  }
}

watchEffect(async () => {
  if (pdf.value) {
    const task: any = pdf.value
    try {
      if (task?.promise) {
        await task.promise
      }
      loading.value = false
      await nextTick()
      fitWidth()
    } catch (e: any) {
      loadError.value = e?.message || 'Errore caricamento PDF'
      loading.value = false
    }
  }
})

onMounted(() => {
  window.addEventListener('resize', fitWidth)
  document.addEventListener('fullscreenchange', onFullscreenChange) // <--- Listener aggiunto
})

onUnmounted(() => {
  window.removeEventListener('resize', fitWidth)
  document.removeEventListener('fullscreenchange', onFullscreenChange) // <--- Listener rimosso
})

function nextPage() { if (page.value < pages.value) page.value++ }
function prevPage() { if (page.value > 1) page.value-- }
function zoomIn() { scale.value = Math.min(scale.value + 0.1, 3) }
function zoomOut() { scale.value = Math.max(scale.value - 0.1, 0.5) }
function rotate() { rotation.value = (rotation.value + 90) % 360 }

// --- Ricerca multi-pagina con bounding boxes (INVARIATO) ---
const currentQuery = computed(() => props.query?.trim() || '')
const indexing = ref(false)
const textCache = ref<Record<number, any>>({})

interface Occurrence { start: number; length: number }
interface RawMatchItem {
  page: number;
  transform: number[];
  width: number;
  height: number;
  text: string;
  occurrences: Occurrence[];
}
interface BoxMatch {
  page: number; x: number; y: number; w: number; h: number; text: string; occurrenceIndex: number; globalIndex: number;
}
const rawMatches = ref<RawMatchItem[]>([])
const flatMatches = ref<BoxMatch[]>([])
const currentMatchIndex = ref(0)
let buildToken = 0

async function getPdfDoc(): Promise<any | null> {
  if (!pdf.value) return null
  const task: any = pdf.value
  if (task?.promise) return task.promise
  return task
}

async function ensurePageText(pageNumber: number) {
  if (textCache.value[pageNumber]) return
  const pdfDoc = await getPdfDoc()
  if (!pdfDoc) return
  try {
    const pg = await pdfDoc.getPage(pageNumber)
    const text = await pg.getTextContent()
    textCache.value[pageNumber] = { pageProxy: pg, text }
  } catch (e) { console.warn('Errore getTextContent pagina', pageNumber, e) }
}

function findOccurrences(haystack: string, needle: string): Occurrence[] {
  const out: Occurrence[] = []
  if (!needle) return out
  const lowerHay = haystack.toLowerCase()
  const lowerNeedle = needle.toLowerCase()
  let idx = 0
  while (true) {
    idx = lowerHay.indexOf(lowerNeedle, idx)
    if (idx === -1) break
    out.push({ start: idx, length: lowerNeedle.length })
    idx += lowerNeedle.length
  }
  return out
}

async function buildIndex() {
  const q = currentQuery.value
  rawMatches.value = []
  flatMatches.value = []
  currentMatchIndex.value = 0
  if (!q) { removeOverlay(); return }
  const pdfDoc = await getPdfDoc()
  if (!pdfDoc) return
  indexing.value = true
  const localToken = ++buildToken
  for (let p = 1; p <= pages.value; p++) {
    if (localToken !== buildToken) return
    await ensurePageText(p)
    const cache = textCache.value[p]
    if (!cache) continue
    const items = cache.text.items || []
    items.forEach((item: any) => {
      const str: string = item.str || ''
      const occs = findOccurrences(str, q)
      if (!occs.length) return
      rawMatches.value.push({
        page: p,
        transform: item.transform || [1,0,0,1,0,0],
        width: item.width || 0,
        height: Math.abs(item.transform?.[3]) || 10,
        text: str,
        occurrences: occs
      })
    })
  }
  indexing.value = false
  generateFlatMatches()
  if (flatMatches.value.length) {
    const first = flatMatches.value[0]
    if (page.value !== first.page) page.value = first.page
    else await drawHighlightsForPage()
  } else {
    removeOverlay()
  }
}

function generateFlatMatches() {
  let idx = 0
  flatMatches.value = []
  rawMatches.value.forEach(rm => {
    rm.occurrences.forEach((occ, occIndex) => {
      flatMatches.value.push({
        page: rm.page,
        x: 0, y: 0, w: 0, h: 0,
        text: rm.text.substring(occ.start, occ.start + occ.length),
        occurrenceIndex: occIndex,
        globalIndex: idx++
      })
    })
  })
}

async function drawHighlightsForPage() {
  removeOverlay()
  const q = currentQuery.value
  if (!q || !flatMatches.value.length) return
  const pdfDoc = await getPdfDoc()
  if (!pdfDoc) return
  const pgEntry = textCache.value[page.value]
  if (!pgEntry) return
  const pg = pgEntry.pageProxy
  const viewport = await pg.getViewport({ scale: scale.value, rotation: rotation.value })
  const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
  const host = canvas?.parentElement
  if (!host) return
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative'
  const overlay = document.createElement('div')
  overlay.className = 'pdf-search-overlay'
  overlay.style.position = 'absolute'
  overlay.style.left = '0'
  overlay.style.top = '0'
  overlay.style.right = '0'
  overlay.style.bottom = '0'
  overlay.style.pointerEvents = 'none'
  overlay.style.zIndex = '10'
  host.appendChild(overlay)
  const pageRaw = rawMatches.value.filter(r => r.page === page.value)
  let globalCounter = 0
  const fudgeY = -10
  pageRaw.forEach(rm => {
    const t = rm.transform
    const fontHeight = Math.abs(t[3]) || rm.height
    const baseX = t[4]
    const baselineY = t[5]
    const topY = baselineY - fontHeight
    const itemWidth = rm.width
    rm.occurrences.forEach((occ, occIdx) => {
      const fracStart = occ.start / rm.text.length
      const fracWidth = occ.length / rm.text.length
      const subX = baseX + itemWidth * fracStart
      const subW = itemWidth * fracWidth
      const vpTopLeft = viewport.convertToViewportPoint(subX, topY)
      const vpBottomRight = viewport.convertToViewportPoint(subX + subW, baselineY)
      let x = vpTopLeft[0]
      let y = vpTopLeft[1] + fudgeY
      let w = vpBottomRight[0] - vpTopLeft[0]
      let h = vpBottomRight[1] - vpTopLeft[1]
      if (h < 0) { h = Math.abs(h); y = y - h }
      globalCounter++
      const isCurrent = flatMatches.value[currentMatchIndex.value]?.page === rm.page && flatMatches.value[currentMatchIndex.value].occurrenceIndex === occIdx
      const box = document.createElement('div')
      box.className = 'pdf-search-box'
      box.style.position = 'absolute'
      box.style.left = x + 'px'
      box.style.top = y + 'px'
      box.style.width = Math.max(2, w) + 'px'
      box.style.height = Math.max(2, h) + 'px'
      box.style.background = isCurrent ? 'rgba(249,115,22,0.65)' : 'rgba(250,204,21,0.45)'
      box.style.border = isCurrent ? '1px solid #000' : '1px solid rgba(0,0,0,0.25)'
      box.style.borderRadius = '2px'
      box.style.boxShadow = isCurrent ? '0 0 4px rgba(249,115,22,0.9)' : '0 0 2px rgba(0,0,0,0.4)'
      overlay.appendChild(box)
    })
  })
}

function removeOverlay() {
  document.querySelectorAll('.pdf-search-overlay').forEach(el => el.remove())
}

function goToMatch(index: number) {
  if (!flatMatches.value.length) return
  if (index < 0) index = flatMatches.value.length - 1
  if (index >= flatMatches.value.length) index = 0
  currentMatchIndex.value = index
  const target = flatMatches.value[index]
  if (target.page !== page.value) {
    page.value = target.page
    setTimeout(() => drawHighlightsForPage(), 250)
  } else {
    drawHighlightsForPage()
  }
}
function nextMatch() { goToMatch(currentMatchIndex.value + 1) }
function prevMatch() { goToMatch(currentMatchIndex.value - 1) }

watch(currentQuery, () => { buildIndex().then(() => drawHighlightsForPage()) })
watch([page, scale, rotation], () => { drawHighlightsForPage() })
watch(pdf, () => { if (currentQuery.value) buildIndex() })
</script>

<template>
  <div ref="rootContainer" class="flex h-full flex-col bg-zinc-950">

    <div class="mb-2 flex flex-wrap gap-2 text-xs p-1">
      <button @click="prevPage" :disabled="page===1" class="rounded bg-zinc-800 px-2 py-1 disabled:opacity-40">Prev</button>
      <button @click="nextPage" :disabled="page===pages" class="rounded bg-zinc-800 px-2 py-1 disabled:opacity-40">Next</button>
      <span class="px-2 py-1 text-white">{{ page }} / {{ pages || '?' }}</span>
      <button @click="zoomOut" class="rounded bg-zinc-800 px-2 py-1">-</button>
      <button @click="zoomIn" class="rounded bg-zinc-800 px-2 py-1">+</button>
      <button @click="rotate" class="rounded bg-zinc-800 px-2 py-1">⟳</button>
      <button @click="toggleFullscreen" class="rounded bg-zinc-800 px-2 py-1" title="Fullscreen">
        <span v-if="isFullscreen">⤡</span>
        <span v-else>⤢</span>
      </button>
      <span v-if="currentQuery" class="px-2 py-1 text-white">Query: "{{ currentQuery }}"</span>
      <span v-if="indexing" class="px-2 py-1 text-amber-400">Indicizzazione...</span>
      <span v-if="!indexing && currentQuery && flatMatches.length" class="px-2 py-1 text-white">Match {{ currentMatchIndex+1 }} / {{ flatMatches.length }}</span>
      <button v-if="flatMatches.length" @click="prevMatch" class="rounded bg-zinc-800 px-2 py-1">◀</button>
      <button v-if="flatMatches.length" @click="nextMatch" class="rounded bg-zinc-800 px-2 py-1">▶</button>
      <span v-if="loadError" class="px-2 py-1 text-red-400">{{ loadError }}</span>
    </div>

    <div ref="container" class="flex-1 overflow-auto rounded bg-zinc-950 p-1 relative flex">

      <div class="relative m-auto shadow-lg">

        <VuePDF
            v-if="pdf && !loading && !loadError"
            :pdf="pdf"
            :page="page"
            :scale="scale"
            :rotation="rotation"
        />

        <div v-else-if="loading" class="p-8 text-center text-zinc-500 min-w-[200px]">
          Caricamento...
        </div>
        <div v-else-if="loadError" class="p-8 text-center text-red-400 min-w-[200px]">
          {{ loadError }}
        </div>
        <div v-else class="p-8 text-center text-zinc-500 min-w-[200px]">
          PDF non disponibile
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
button { transition: background .15s; color: white; }
button:hover:not(:disabled) { background: rgb(63 63 70); }
.pdf-search-overlay { position:absolute; inset:0; pointer-events:none; }
.pdf-search-box { animation: fadeIn .18s ease; }
@keyframes fadeIn { from { opacity:0; transform:scale(.98); } to { opacity:1; transform:scale(1); } }

/* Stile opzionale per il fullscreen su vecchi browser che non gestiscono bene il flex */
:fullscreen { overflow: hidden; }
</style>