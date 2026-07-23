export interface FlowchartMeta {
    slug: string
    filename: string
    title: string
    description: string
    instructor: string
    positions: string[]
    tags: string[]
}

export const FLOWCHARTS: FlowchartMeta[] = [
    {
        slug: 'danaher_4x4_submissions_detailed',
        filename: 'danaher_4x4_submissions_detailed.html',
        title: 'Danaher 4×4 Submissions',
        description: 'Complete systems for kata gatame, rear strangle, juji gatame, and mounted triangle — four primary submission pathways from dominant positions.',
        instructor: 'John Danaher',
        positions: ['Mount', 'High Mount', 'Back Control', 'Armbar'],
        tags: ['submissions', 'mount', 'back control', 'armbar', 'strangle'],
    },
    {
        slug: 'danaher_halfguard_dynamic_pinning',
        filename: 'danaher_halfguard_dynamic_pinning.html',
        title: 'Half Guard Dynamic Pinning',
        description: "Danaher's pinning approach from half guard top — cross-face, underhook, and knee cut sequences to generate movement and pass.",
        instructor: 'John Danaher',
        positions: ['Half Guard Top'],
        tags: ['half guard', 'passing', 'pinning', 'cross-face'],
    },
    {
        slug: 'danaher_positional_escapes',
        filename: 'danaher_positional_escapes.html',
        title: 'Positional Escapes',
        description: 'Systematic escape sequences from mount, side control, and back control — frame, hip escape, and guard recovery pathways.',
        instructor: 'John Danaher',
        positions: ['Positional Escapes'],
        tags: ['escapes', 'bottom position', 'guard recovery', 'hip escape'],
    },
    {
        slug: 'danaher_ude_gatame_master_the_move',
        filename: 'danaher_ude_gatame_master_the_move.html',
        title: 'Ude Gatame (Armbar)',
        description: 'Complete juji gatame system from high mount: entry mechanics, elbow path, pump flex vs elbow pull, and finishing details.',
        instructor: 'John Danaher',
        positions: ['Armbar', 'High Mount'],
        tags: ['armbar', 'juji gatame', 'high mount', 'submissions'],
    },
    {
        slug: 'forgotten_sweep_flowchart',
        filename: 'forgotten_sweep_flowchart.html',
        title: 'Forgotten Sweep System',
        description: "Jeff Curran's scissor sweep chain from closed guard — sweep mechanics, counters for every opponent reaction, and the full submission chain.",
        instructor: 'Jeff Curran',
        positions: ['Closed Guard'],
        tags: ['closed guard', 'sweeps', 'scissor sweep', 'triangle', 'kimura'],
    },
    {
        slug: 'gordon_ryan_half_guard_passing',
        filename: 'gordon_ryan_half_guard_passing.html',
        title: 'Half Guard Passing System',
        description: "Gordon Ryan's systematic half guard — whizzer vs underhook battle, push-pull theory, roll-throughs, and back takes from scrimmage positions.",
        instructor: 'Gordon Ryan',
        positions: ['Half Guard Top', 'Half Guard Bottom', 'Turtle Attack'],
        tags: ['half guard', 'passing', 'underhook', 'whizzer', 'back take', 'wrestling'],
    },
    {
        slug: 'gordon_ryan_leg_lock_system',
        filename: 'gordon_ryan_leg_lock_system.html',
        title: 'Leg Lock System',
        description: "Gordon Ryan's complete leg lock system — ashi garami entries, heel hook mechanics, inside/outside heel hooks, and position hierarchy.",
        instructor: 'Gordon Ryan',
        positions: ['Leg Locks'],
        tags: ['leg locks', 'heel hooks', 'ashi garami', 'lower body'],
    },
    {
        slug: 'grip_fighting_kuzushi_system',
        filename: 'grip_fighting_kuzushi_system.html',
        title: 'Grip Fighting & Kuzushi',
        description: 'The grip fighting formula — breaking grips, establishing inside position, and constant off-balancing to create attack opportunities.',
        instructor: 'Various',
        positions: ['Grip Fighting'],
        tags: ['grips', 'kuzushi', 'off-balancing', 'standing', 'wrestling'],
    },
    {
        slug: 'new_wave_pinning_system',
        filename: 'new_wave_pinning_system.html',
        title: 'New Wave Pinning System',
        description: 'Control-before-submission philosophy — split, ride, turk, shelf leg controls with cross-face, claw, open elbow, and Dagestani handcuff upper body tools.',
        instructor: 'Various',
        positions: ['Pinning & Leg Rides', 'Mount', 'Back Control', 'Side Control Top'],
        tags: ['pinning', 'leg rides', 'control', 'rear mount', 'Dagestani handcuff'],
    },
]

export function getFlowchartsByPosition(position: string): FlowchartMeta[] {
    return FLOWCHARTS.filter((f) => f.positions.includes(position))
}

export function getFlowchartBySlug(slug: string): FlowchartMeta | undefined {
    return FLOWCHARTS.find((f) => f.slug === slug)
}
