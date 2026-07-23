'use client'

import { updatePartnerProfile } from '@/actions/partners'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
    partnerId: string
    currentBelt: string | null
    currentSize: string | null
    currentStyle: string | null
    currentRetention: string | null
}

const SIZE_OPTIONS = [
    { value: 'lighter', label: 'Lighter' },
    { value: 'similar', label: 'Similar' },
    { value: 'heavier', label: 'Heavier' },
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

function RadioGroup({
    name,
    options,
    value,
    onChange,
}: {
    name: string
    options: { value: string; label: string }[]
    value: string
    onChange: (v: string) => void
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(value === opt.value ? '' : opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        value === opt.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    )
}

export function EditPartnerProfile({
    partnerId,
    currentBelt,
    currentSize,
    currentStyle,
    currentRetention,
}: Props) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [belt, setBelt] = useState(currentBelt ?? '')
    const [size, setSize] = useState(currentSize ?? '')
    const [style, setStyle] = useState(currentStyle ?? '')
    const [retention, setRetention] = useState(currentRetention ?? '')
    const [saving, setSaving] = useState(false)

    async function handleSave() {
        setSaving(true)
        try {
            await updatePartnerProfile(partnerId, {
                belt: belt || null,
                size: size || null,
                physicalStyle: style || null,
                guardRetention: retention || null,
            })
            setIsOpen(false)
            router.refresh()
        } finally {
            setSaving(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full mb-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium py-2.5 px-4 rounded-lg text-sm active:scale-95 transition-transform"
            >
                Edit Profile
            </button>
        )
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Edit Profile
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Belt
                    </label>
                    <RadioGroup
                        name="belt"
                        options={[
                            { value: 'White', label: 'White' },
                            { value: 'Blue', label: 'Blue' },
                            { value: 'Purple', label: 'Purple' },
                            { value: 'Brown', label: 'Brown' },
                            { value: 'Black', label: 'Black' },
                        ]}
                        value={belt}
                        onChange={setBelt}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Size relative to you
                    </label>
                    <RadioGroup
                        name="size"
                        options={SIZE_OPTIONS}
                        value={size}
                        onChange={setSize}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Physical style
                    </label>
                    <RadioGroup
                        name="style"
                        options={STYLE_OPTIONS}
                        value={style}
                        onChange={setStyle}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Guard retention
                    </label>
                    <RadioGroup
                        name="retention"
                        options={RETENTION_OPTIONS}
                        value={retention}
                        onChange={setRetention}
                    />
                </div>

                <div className="flex gap-2 pt-1">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg active:scale-95 transition-transform disabled:opacity-50"
                    >
                        {saving ? 'Saving…' : 'Save'}
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
        </div>
    )
}
