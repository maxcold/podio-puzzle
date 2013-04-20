({
    block: 'b-page',
    title: 'Podio puzzle',
    favicon: 'https://d2cmuesa4snpwn.cloudfront.net/images/favicon.ico',
    head: [
        { elem: 'css', url: '_index.css', ie: false },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: '_index.js' },
        { elem: 'meta', attrs: { name: 'description', content: 'Podio front-end developer test' }}
    ],
    content:[
        {
            block: 'header',
            content: [
                {
                    block: 'grid',
                    mods: {
                        layout: '20-80'
                    },
                    content: [
                        {
                            elem: 'col',
                            mods: {
                                type: 'left'
                            },
                            content: [
                                {
                                    block: 'logo'
                                }
                            ]
                        },
                        {
                            elem: 'col',
                            mods: {
                                type: 'right'
                            },
                            content: [
                                {
                                    block: 'menu',
                                    content: [
                                        {
                                            elem: 'item',
                                            content: {
                                                elem: 'link',
                                                url: '/',
                                                content: 'Home'
                                            }
                                        },
                                        {
                                            elem: 'item',
                                            mix: [
                                                {
                                                    block: 'space-switcher',
                                                    js: true
                                                }
                                            ],
                                            content: [
                                                {
                                                    elem: 'link',
                                                    mix: [
                                                        {
                                                            block: 'space-switcher',
                                                            elem: 'control'
                                                        }
                                                    ],
                                                    url: '#',
                                                    content: 'Go to space'
                                                },
                                                {
                                                    block: 'space-switcher',
                                                    elem: 'popup',
                                                    content: 'test'
                                                }
                                            ]
                                        },
                                        {
                                            elem: 'item',
                                            content: {
                                                elem: 'link',
                                                url: '#',
                                                content: 'App store'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            block: 'content',
            content: [
                {
                    tag: 'img',
                    attrs: {
                        width: 1000,
                        src: '../../i/puzzle.jpg'
                    }
                }
            ]
        }
    ]
})
