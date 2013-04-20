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
    noDeps: [
        {
            block: 'i-bem',
            elem: 'html'
        }
    ]
})
