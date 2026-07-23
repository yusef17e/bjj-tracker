import { FLOWCHARTS } from '@/data/flowcharts'
import Link from 'next/link'

const POSITION_COLORS: Record<string, string> = {
    Mount: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    'High Mount': 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    'Back Control': 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    Armbar: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    'Half Guard Top': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    'Half Guard Bottom': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    'Leg Locks': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    'Positional Escapes': 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
    'Closed Guard': 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300',
    'Pinning & Leg Rides': 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
    'Grip Fighting': 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
    'Side Control Top': 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
    'Turtle Attack': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
}

const INSTRUCTOR_COLORS: Record<string, string> = {
    'John Danaher': 'border-l-purple-400',
    'Gordon Ryan': 'border-l-blue-400',
    'Jeff Curran': 'border-l-teal-400',
    Various: 'border-l-zinc-400',
}

export default function FlowchartsPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pb-24">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                    Flowcharts
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                    Interactive technique maps from BJJ instructionals
                </p>

                <div className="space-y-3">
                    {FLOWCHARTS.map((chart) => (
                        <Link
                            key={chart.slug}
                            href={`/flowcharts/${chart.slug}`}
                            className={`block bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 border-l-4 ${
                                INSTRUCTOR_COLORS[chart.instructor] ?? 'border-l-zinc-400'
                            } hover:border-blue-500 dark:hover:border-blue-500 transition-colors active:scale-[0.99]`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-zinc-900 dark:text-zinc-50 mb-0.5">
                                        {chart.title}
                                    </div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                                        {chart.instructor}
                                    </div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-snug line-clamp-2">
                                        {chart.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {chart.positions.map((pos) => (
                                            <span
                                                key={pos}
                                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                    POSITION_COLORS[pos] ??
                                                    'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                                }`}
                                            >
                                                {pos}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <svg
                                    className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
