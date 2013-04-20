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
                            }
                        }
                    ]
                }
            ]
        },
        {
            block: 'content',
            content: [
                'main content'
            ]
        }
    ]
})
