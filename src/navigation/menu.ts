import {
    mdiLibraryShelves,
    mdiChartLine,
    mdiDiceD20,
    mdiAccountCircle,
    mdiAccount,
    mdiAccountGroup,
} from '@mdi/js'

export interface MenuEntry {
    iconPath: string
    labelKey: string   // chiave i18n, es. 'menu.library'
    to: string         // URL fisso
    activeMatch: string // regex string per evidenziare attivo
}

export const MENU_ITEMS: MenuEntry[] = [
    {
        iconPath: mdiLibraryShelves,
        labelKey: 'menu.library',
        to: '/library',
        activeMatch: '^/library', // Evidenzia anche le sottopagine
    },
    {
        iconPath: mdiChartLine,
        labelKey: 'menu.stats',
        to: '/stats',
        activeMatch: '^/stats',
    },
    {
        iconPath: mdiDiceD20,
        labelKey: 'menu.tools',
        to: '/tools',
        activeMatch: '^/tools',
    },
    {
        iconPath: mdiAccountCircle,
        labelKey: 'menu.account',
        to: '/account',
        activeMatch: '^/account',
    },
    {
        iconPath: mdiAccount,
        labelKey: 'menu.players',
        to: '/players',
        activeMatch: '^/players',
    },
    {
        iconPath: mdiAccountGroup,
        labelKey: 'menu.teams',
        to: '/teams',
        activeMatch: '^/teams',
    },
]
