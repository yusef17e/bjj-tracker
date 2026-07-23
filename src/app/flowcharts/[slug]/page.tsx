import { getFlowchartBySlug } from '@/data/flowcharts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs/promises'
import path from 'path'

const CSS_VARS = `<style>
:root {
  --color-background-primary: #ffffff;
  --color-background-secondary: #f8f7f4;
  --color-background-tertiary: #f0ede6;
  --color-text-primary: #2c2c2a;
  --color-text-secondary: #6b6a66;
  --color-border-primary: #b4b2a9;
  --color-border-secondary: #d4d2ca;
  --color-border-tertiary: #e8e6de;
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-background-primary: #1a1918;
    --color-background-secondary: #242321;
    --color-background-tertiary: #2e2d2a;
    --color-text-primary: #f0ede6;
    --color-text-secondary: #a8a6a0;
    --color-border-primary: #4a4845;
    --color-border-secondary: #3a3836;
    --color-border-tertiary: #2e2d2a;
  }
}
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
svg text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; }
</style>`

export default async function FlowchartViewerPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const meta = getFlowchartBySlug(slug)
    if (!meta) notFound()

    const filePath = path.join(process.cwd(), 'public', 'flowcharts', meta.filename)
    const htmlContent = await fs.readFile(filePath, 'utf-8')

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20">
            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <Link
                        href="/flowcharts"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        ← Flowcharts
                    </Link>
                    <div className="text-right">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm leading-tight">
                            {meta.title}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {meta.instructor}
                        </div>
                    </div>
                </div>
            </div>

            {/* Flowchart content */}
            <div className="p-4 max-w-2xl mx-auto overflow-x-auto">
                <div
                    dangerouslySetInnerHTML={{ __html: CSS_VARS + htmlContent }}
                />
            </div>
        </div>
    )
}
