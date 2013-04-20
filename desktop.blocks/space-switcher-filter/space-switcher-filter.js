BEM.DOM.decl('space-switcher-filter', {

    onSetMod: {
        js: function() {
            var self = this;
            var spacesContainer = self.findElem('spaces-inner');

            $.when(self._loadData()).then(function() {
                var organizations = self._getData();
                var bemjson = self._buildOrganizationsBEMJSON(organizations);
                var html = BEMHTML.apply(bemjson);

                spacesContainer.append(html);
            });
        }
    },

    _data: null,

    _getData: function() {
        return this._data;
    },

    _loadData: function() {
        var self = this;
        var dfd = $.Deferred();

        if (!self._data) {
            $.ajax({
                url: '/data.json',
                dataType: 'json',
                success: function(data) {
                    self._data = data;
                    dfd.resolve();
                },
                error: function() {
                    dfd.reject();
                }
            })
        } else {
            dfd.resolve();
        }

        return dfd.promise();
    },

    _buildOrganizationsBEMJSON: function(organizations) {
        return organizations.map(function(org) {
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
                       content: [
                           {
                               elem: 'item',
                               mix: [
                                   {
                                       block: 'organization',
                                       elem: 'name'
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
