<!--

https://dexie.org/docs/API-Reference

https://tabler.io/icons
https://tabler.io/docs/icons/libraries/vue
https://gradienty.codes/tailwind-colors
https://www.streamlinehq.com/?tab=free

https://dummyjson.com/docs

https://moment.github.io/luxon/#/
https://www.youtube.com/watch?v=akeLRzkBAz8&t=36s

-->

<template>
	<section class="app-root grid p-2">
		<router-view/>
	</section>
</template>


<style>


/*
LIST OF ALL TAILWIND BG COLOR CLASSES

Slate:
bg-slate-50    #f8fafc
bg-slate-100   #f1f5f9
bg-slate-200   #e2e8f0
bg-slate-300   #cbd5e1
bg-slate-400   #94a3b8
bg-slate-500   #64748b
bg-slate-600   #475569
bg-slate-700   #334155
bg-slate-800   #1e293b
bg-slate-900   #0f172a
bg-slate-950   #020617

Gray:
bg-gray-50     #f9fafb
bg-gray-100    #f3f4f6
bg-gray-200    #e5e7eb
bg-gray-300    #d1d5db
bg-gray-400    #9ca3af
bg-gray-500    #6b7280
bg-gray-600    #4b5563
bg-gray-700    #374151
bg-gray-800    #1f2937
bg-gray-900    #111827
bg-gray-950    #030712

Zinc:
bg-zinc-50     #fafafa
bg-zinc-100    #f4f4f5
bg-zinc-200    #e4e4e7
bg-zinc-300    #d4d4d8
bg-zinc-400    #a1a1aa
bg-zinc-500    #71717a
bg-zinc-600    #52525b
bg-zinc-700    #3f3f46
bg-zinc-800    #27272a
bg-zinc-900    #18181b
bg-zinc-950    #09090b

Stone:
bg-stone-50    #fafaf9
bg-stone-100   #f5f5f4
bg-stone-200   #e7e5e4
bg-stone-300   #d6d3d1
bg-stone-400   #a8a29e
bg-stone-500   #78716c
bg-stone-600   #57534e
bg-stone-700   #44403c
bg-stone-800   #292524
bg-stone-900   #1c1917
bg-stone-950   #0c0a09

Red:
bg-red-50      #fef2f2
bg-red-100     #fee2e2
bg-red-200     #fecaca
bg-red-300     #fca5a5
bg-red-400     #f87171
bg-red-500     #ef4444
bg-red-600     #dc2626
bg-red-700     #b91c1c
bg-red-800     #991b1b
bg-red-900     #7f1d1d
bg-red-950     #450a0a

Orange:
bg-orange-50   #fff7ed
bg-orange-100  #ffedd5
bg-orange-200  #fed7aa
bg-orange-300  #fdba74
bg-orange-400  #fb923c
bg-orange-500  #f97316
bg-orange-600  #ea580c
bg-orange-700  #c2410c
bg-orange-800  #9a3412
bg-orange-900  #7c2d12
bg-orange-950  #431407

Amber:
bg-amber-50    #fffbeb
bg-amber-100   #fef3c7
bg-amber-200   #fde68a
bg-amber-300   #fcd34d
bg-amber-400   #fbbf24
bg-amber-500   #f59e0b
bg-amber-600   #d97706
bg-amber-700   #b45309
bg-amber-800   #92400e
bg-amber-900   #78350f
bg-amber-950   #451a03

Yellow:
bg-yellow-50   #fefce8
bg-yellow-100  #fef9c3
bg-yellow-200  #fef08a
bg-yellow-300  #fde047
bg-yellow-400  #facc15
bg-yellow-500  #eab308
bg-yellow-600  #ca8a04
bg-yellow-700  #a16207
bg-yellow-800  #854d0e
bg-yellow-900  #713f12
bg-yellow-950  #422006

Lime:
bg-lime-50     #f7fee7
bg-lime-100    #ecfccb
bg-lime-200    #d9f99d
bg-lime-300    #bef264
bg-lime-400    #a3e635
bg-lime-500    #84cc16
bg-lime-600    #65a30d
bg-lime-700    #4d7c0f
bg-lime-800    #3f6212
bg-lime-900    #365314
bg-lime-950    #1a2e05

Green:
bg-green-50    #f0fdf4
bg-green-100   #dcfce7
bg-green-200   #bbf7d0
bg-green-300   #86efac
bg-green-400   #4ade80
bg-green-500   #22c55e
bg-green-600   #16a34a
bg-green-700   #15803d
bg-green-800   #166534
bg-green-900   #14532d
bg-green-950   #052e16

Emerald:
bg-emerald-50  #ecfdf5
bg-emerald-100 #d1fae5
bg-emerald-200 #a7f3d0
bg-emerald-300 #6ee7b7
bg-emerald-400 #34d399
bg-emerald-500 #10b981
bg-emerald-600 #059669
bg-emerald-700 #047857
bg-emerald-800 #065f46
bg-emerald-900 #064e3b
bg-emerald-950 #022c22

Teal:
bg-teal-50     #f0fdfa
bg-teal-100    #ccfbf1
bg-teal-200    #99f6e4
bg-teal-300    #5eead4
bg-teal-400    #2dd4bf
bg-teal-500    #14b8a6
bg-teal-600    #0d9488
bg-teal-700    #0f766e
bg-teal-800    #115e59
bg-teal-900    #134e4a
bg-teal-950    #042f2e

Cyan:
bg-cyan-50     #ecfeff
bg-cyan-100    #cffafe
bg-cyan-200    #a5f3fc
bg-cyan-300    #67e8f9
bg-cyan-400    #22d3ee
bg-cyan-500    #06b6d4
bg-cyan-600    #0891b2
bg-cyan-700    #0e7490
bg-cyan-800    #155e75
bg-cyan-900    #164e63
bg-cyan-950    #083344

Sky:
bg-sky-50      #f0f9ff
bg-sky-100     #e0f2fe
bg-sky-200     #bae6fd
bg-sky-300     #7dd3fc
bg-sky-400     #38bdf8
bg-sky-500     #0ea5e9
bg-sky-600     #0284c7
bg-sky-700     #0369a1
bg-sky-800     #075985
bg-sky-900     #0c4a6e
bg-sky-950     #082f49

Blue:
bg-blue-50     #eff6ff
bg-blue-100    #dbeafe
bg-blue-200    #bfdbfe
bg-blue-300    #93c5fd
bg-blue-400    #60a5fa
bg-blue-500    #3b82f6
bg-blue-600    #2563eb
bg-blue-700    #1d4ed8
bg-blue-800    #1e40af
bg-blue-900    #1e3a8a
bg-blue-950    #172554

Indigo:
bg-indigo-50   #eef2ff
bg-indigo-100  #e0e7ff
bg-indigo-200  #c7d2fe
bg-indigo-300  #a5b4fc
bg-indigo-400  #818cf8
bg-indigo-500  #6366f1
bg-indigo-600  #4f46e5
bg-indigo-700  #4338ca
bg-indigo-800  #3730a3
bg-indigo-900  #312e81
bg-indigo-950  #1e1b4b

Violet:
bg-violet-50   #f5f3ff
bg-violet-100  #ede9fe
bg-violet-200  #ddd6fe
bg-violet-300  #c4b5fd
bg-violet-400  #a78bfa
bg-violet-500  #8b5cf6
bg-violet-600  #7c3aed
bg-violet-700  #6d28d9
bg-violet-800  #5b21b6
bg-violet-900  #4c1d95
bg-violet-950  #2e1065

Purple:
bg-purple-50   #faf5ff
bg-purple-100  #f3e8ff
bg-purple-200  #e9d5ff
bg-purple-300  #d8b4fe
bg-purple-400  #c084fc
bg-purple-500  #a855f7
bg-purple-600  #9333ea
bg-purple-700  #7e22ce
bg-purple-800  #6b21a8
bg-purple-900  #581c87
bg-purple-950  #3b0764

Fuchsia:
bg-fuchsia-50  #fdf4ff
bg-fuchsia-100 #fae8ff
bg-fuchsia-200 #f5d0fe
bg-fuchsia-300 #f0abfc
bg-fuchsia-400 #e879f9
bg-fuchsia-500 #d946ef
bg-fuchsia-600 #c026d3
bg-fuchsia-700 #a21caf
bg-fuchsia-800 #86198f
bg-fuchsia-900 #701a75
bg-fuchsia-950 #4a044e

Pink:
bg-pink-50     #fdf2f8
bg-pink-100    #fce7f3
bg-pink-200    #fbcfe8
bg-pink-300    #f9a8d4
bg-pink-400    #f472b6
bg-pink-500    #ec4899
bg-pink-600    #db2777
bg-pink-700    #be185d
bg-pink-800    #9d174d
bg-pink-900    #831843
bg-pink-950    #500724

Rose:
bg-rose-50     #fff1f2
bg-rose-100    #ffe4e6
bg-rose-200    #fecdd3
bg-rose-300    #fda4af
bg-rose-400    #fb7185
bg-rose-500    #f43f5e
bg-rose-600    #e11d48
bg-rose-700    #be123c
bg-rose-800    #9f1239
bg-rose-900    #881337
bg-rose-950    #4c0519

Special:
bg-white       #ffffff
bg-black       #000000
bg-transparent transparent
*/


</style>