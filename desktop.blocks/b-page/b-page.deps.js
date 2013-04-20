({
    mustDeps: [
        {
            block: 'i-bem',
            elem: 'dom',
            mods: { init: 'auto' }
        },
        { block: 'bemhtml' },
        {
            block: 'i-utils',
            elem: 'normalize-css'
        }
    ],
    shouldDeps: [
        {
            block: 'space-switcher'
        }
    ],
    noDeps: [
        {
            block: 'i-bem',
            elem: 'html'
        }
    ]
})
