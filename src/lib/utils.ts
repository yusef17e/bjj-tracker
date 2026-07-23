/**
 * Formats a technique list that might be stored as a JSON array or a comma-separated string.
 * If it's an array with duplicates, it counts them and displays as "Move (x2)".
 */
export function formatTechniqueList(data: string | null | undefined): string {
    if (!data) return ''

    try {
        const parsed = JSON.parse(data)
        if (Array.isArray(parsed)) {
            if (parsed.length === 0) return ''

            const counts = parsed.reduce((acc, curr) => {
                acc[curr] = (acc[curr] || 0) + 1
                return acc
            }, {} as Record<string, number>)

            return Object.entries(counts)
                .map(([tech, count]) => ((count as number) > 1 ? `${tech} (x${count})` : tech))
                .join(', ')
        }
    } catch (e) {
        // Not JSON, return as is
    }

    return data
}

/**
 * Parses a position sequence that might be stored as a JSON array.
 * Displays as "Pos1 -> Pos2 -> Pos3".
 */
export function formatPositionSequence(data: string | null | undefined): string {
    if (!data) return ''

    try {
        const parsed = JSON.parse(data)
        if (Array.isArray(parsed)) {
            return parsed.join(' → ')
        }
    } catch (e) {
        // Not JSON
    }

    return data
}
