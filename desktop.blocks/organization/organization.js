BEM.DOM.decl('organization', {}, {

    /**
     * build BEMJSON for organization block with loaded data
     * @static
     * @param {Object} data
     * @returns {BEMJSON}
     */
    _build: function(data) {
        return data.map(function(org, index) {
            var spaces = org.spaces || [];
            var icon = (org.image && org.image.thumbnail_link) || '';
            var name = org.name || '';
            var url = org.url || '';

            return {
                block: 'organization',
                content: [
                    {
                       elem: 'icon',
                       src: icon
                    },
                    {
                        block: 'list',
                        js: true,
                        content: [
                            {
                                elem: 'item',
                                mix: [
                                    {
                                        block: 'organization',
                                        elem: 'name'
                                    },
                                    {
                                        block: 'space-switcher-filter',
                                        elem: 'item',
                                        elemMods: (index === 0) ? {
                                            state: 'selected'
                                        } : {}
                                    }
                                ],
                                url: url,
                                content: name
                            },
                            spaces.map(function(space) {
                                var name = space.name || '';
                                var url = space.url || '';

                                return {
                                    elem: 'item',
                                    mix: [
                                        {
                                            block: 'space-switcher-filter',
                                            elem: 'item'
                                        }
                                    ],
                                    url: url,
                                    content: name
                                };
                            }),
                            {
                                elem: 'item',
                                mix: [
                                    {
                                        block: 'organization',
                                        elem: 'create-space'
                                    },
                                    {
                                        block: 'space-switcher-filter',
                                        elem: 'item'
                                    }
                                ],
                                url: '#create',
                                content: '+ New space'
                            }
                        ]
                    }
                ]
            };
        });
    }
});