'use client'

import { Plus, Minus, X } from 'lucide-react'

interface TechniqueMultiEntryProps {
    label: string
    options: readonly string[]
    value: string[]
    onChange: (newValue: string[]) => void
}

export function TechniqueMultiEntry({
    label,
    options,
    value,
    onChange,
}: TechniqueMultiEntryProps) {
    // Count occurrences of each technique
    const counts = value.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const handleAdd = (technique: string) => {
        onChange([...value, technique])
    }

    const handleRemoveOne = (technique: string) => {
        const index = value.lastIndexOf(technique)
        if (index !== -1) {
            const newValue = [...value]
            newValue.splice(index, 1)
            onChange(newValue)
        }
    }

    const handleRemoveAll = (technique: string) => {
        onChange(value.filter((v) => v !== technique))
    }

    // Unique selected techniques in order of first appearance
    const selectedTechniques = Array.from(new Set(value))

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {label}
            </label>

            {/* Selected items (Tags) */}
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50">
                {selectedTechniques.length === 0 && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 italic self-center">
                        None selected
                    </span>
                )}
                {selectedTechniques.map((tech) => (
                    <div
                        key={tech}
                        className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-sm font-medium border border-blue-200 dark:border-blue-800/50 animate-in fade-in zoom-in duration-200"
                    >
                        <span>{tech}</span>
                        <span className="bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1 font-bold">
                            {counts[tech]}
                        </span>
                        <div className="flex items-center ml-1 border-l border-blue-200 dark:border-blue-800/50 pl-1 gap-1">
                            <button
                                type="button"
                                onClick={() => handleAdd(tech)}
                                className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                                title="Add another"
                            >
                                <Plus size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRemoveOne(tech)}
                                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                title="Remove one"
                            >
                                <Minus size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRemoveAll(tech)}
                                className="hover:text-red-600 dark:hover:text-red-400 transition-colors ml-0.5"
                                title="Remove all"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => handleAdd(option)}
                        className="text-xs py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all active:scale-95 text-left truncate"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    )
}
