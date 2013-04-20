({
    block: 'b-page',
    title: 'Podio puzzle',
    favicon: 'https://d2cmuesa4snpwn.cloudfront.net/images/favicon.ico',
    head: [
        { elem: 'css', url: '_index.css', ie: false },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: '_index.js' },
        { elem: 'js', url: '../client/_client.bemhtml.js' },
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
                                                    content: {
                                                        block: 'space-switcher-filter',
                                                        content: [
                                                            {
                                                                elem: 'input'
                                                            },
                                                            {
                                                                elem: 'spaces',
                                                                content: [
                                                                    {
                                                                        block: 'organization',
                                                                        content: [
                                                                            {
                                                                                elem: 'icon',
                                                                                src: ''
                                                                            },
                                                                            {
                                                                                block: 'list',
                                                                                content: [
                                                                                    {
                                                                                        elem: 'item',
                                                                                        elemMods: {
                                                                                            state: 'selected'
                                                                                        },
                                                                                        mix: [
                                                                                            {
                                                                                                block: 'organization',
                                                                                                elem: 'name'
                                                                                            }
                                                                                        ],
                                                                                        url: '/',
                                                                                        content: 'auchenberg'
                                                                                    },
                                                                                    {
                                                                                        elem: 'item',
                                                                                        url: '/',
                                                                                        content: 'auchenberg'
                                                                                    },
                                                                                    {
                                                                                        elem: 'item',
                                                                                        url: '/',
                                                                                        content: 'scrum'
                                                                                    },
                                                                                    {
                                                                                        elem: 'item',
                                                                                        url: '/',
                                                                                        content: 'visiolink'
                                                                                    },
                                                                                    {
                                                                                        elem: 'item',
                                                                                        mix: [
                                                                                            {
                                                                                                block: 'organization',
                                                                                                elem: 'create-space'
                                                                                            }
                                                                                        ],
                                                                                        url: '#create',
                                                                                        content: '+ New space'
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        block: 'organization',
                                                                        content: [
                                                                            {
                                                                                elem: 'icon',
                                                                                src: ''
                                                                            },
                                                                            {
                                                                                block: 'list',
                                                                                content: [
                                                                                    {
                                                                                        elem: 'item',
                                                                                        mix: [
                                                                                            {
                                                                                                block: 'organization',
                                                                                                elem: 'name'
                                                                                            }
                                                                                        ],
                                                                                        url: '/',
                                                                                        content: 'Podio'
                                                                                    },
                                                                                    {
                                                                                        elem: 'item',
                                                                                        url: '/',
                                                                                        content: 'Аuchenberg'
                                                                                    },
                                                                                    {
                                                                                        elem: 'item',
                                                                                        url: '/',
                                                                                        content: 'Launch'
                                                                                    },
                                                                                    {
                                                                                        elem: 'item',
                                                                                        url: '/',
                                                                                        content: 'visiolink'
                                                                                    },
                                                                                    {
                                                                                        elem: 'item',
                                                                                        mix: [
                                                                                            {
                                                                                                block: 'organization',
                                                                                                elem: 'create-space'
                                                                                            }
                                                                                        ],
                                                                                        url: '#create',
                                                                                        content: '+ New space'
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
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
