'use client'

import { addPartner } from '@/actions/partners'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SIZE_OPTIONS = [
    { value: 'lighter', label: 'Lighter than me' },
    { value: 'similar', label: 'Similar size' },
    { value: 'heavier', label: 'Heavier than me' },
]

const STYLE_OPTIONS = [
    { value: 'flexible', label: 'Flexible' },
    { value: 'strong', label: 'Strong' },
    { value: 'explosive', label: 'Explosive' },
    { value: 'defensive', label: 'Defensive' },
]

const RETENTION_OPTIONS = [
    { value: 'weak', label: 'Weak' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'strong', label: 'Strong' },
]

export function AddPartnerForm() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    async function handleSubmit(formData: FormData) {
        try {
            await addPartner(formData)
            setIsOpen(false)
            router.refresh()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to add partner')
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg active:scale-95 transition-transform"
            >
                + Add Partner
            </button>
        )
    }

    return (
        <form
            action={handleSubmit}
            className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800"
        >
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                Add New Partner
            </h3>
            <div className="space-y-4">
                {/* Name */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                        Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                    />
                </div>

                {/* Belt */}
                <div>
                    <label
                        htmlFor="belt"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                        Belt
                    </label>
                    <select
                        id="belt"
                        name="belt"
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select belt...</option>
                        <option value="White">White</option>
                        <option value="Blue">Blue</option>
                        <option value="Purple">Purple</option>
                        <option value="Brown">Brown</option>
                        <option value="Black">Black</option>
                    </select>
                </div>

                {/* Size */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Size relative to you
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {SIZE_OPTIONS.map((opt) => (
                            <label
                                key={opt.value}
                                className="flex items-center gap-2 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950"
                            >
                                <input
                                    type="radio"
                                    name="size"
                                    value={opt.value}
                                    className="accent-blue-600"
                                />
                                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Physical Style */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Physical style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {STYLE_OPTIONS.map((opt) => (
                            <label
                                key={opt.value}
                                className="flex items-center gap-2 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950"
                            >
                                <input
                                    type="radio"
                                    name="physicalStyle"
                                    value={opt.value}
                                    className="accent-blue-600"
                                />
                                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Guard Retention */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Guard retention
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {RETENTION_OPTIONS.map((opt) => (
                            <label
                                key={opt.value}
                                className="flex items-center gap-2 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950"
                            >
                                <input
                                    type="radio"
                                    name="guardRetention"
                                    value={opt.value}
                                    className="accent-blue-600"
                                />
                                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 pt-1">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg active:scale-95 transition-transform"
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-semibold py-3 px-4 rounded-lg active:scale-95 transition-transform"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    )
}
