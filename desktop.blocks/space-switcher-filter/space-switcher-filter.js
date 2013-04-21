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

                self._items = self.findElem('item');
                self._navItems = self._items;
                self._input = self.findElem('input');
                self._organizations = self.findBlocksInside('organization');
                self._rowHeight = self._getRowHeight();

                self._redrawList()
            });
        },

        focused: {
            'yes': function() {
                var input = this._getInput();

                input.focus();

                this
                    .bindTo('keypress', function(e) {
                        this._onKeyPress(e);
                    })
                    .bindTo('keydown', function(e) {
                        this._onKeyDown(e);
                    })
                    .bindTo('keyup', function(e) {
                        this._onKeyUp(e);
                    })
            },
            '': function() {
                this.unbindFrom('keypress keydown keyup')
            }
        }
    },

    // json data from server
    _data: null,

    _items: null,

    _navItems: null,

    _input: null,

    _organizations: null,

    _curItemIndex: -1,

    _rowHeight: 23,

    _query: '',

    _redrawList: function() {
        var self = this;
        var items = self._getItems();

        self._curItemIndex = 0;

        self.bindTo(items, {
            'mouseover': function(e) {
                self._onEnterItem(e.data.domElem);
            },
            'mouseout': function(e) {
                self._onLeaveItem(e.data.domElem);
            }
        });

    },

    _focus: function() {
        return this.setMod('focused', 'yes');
    },

    _blur: function() {
        return this.delMod('focused');
    },

    _onEnterItem: function(item, byKeyboard) {
        var idx = this._curItemIndex;
        var items = this._getNavItems();

        idx > -1 && this.delMod(items.eq(idx), 'state');
        idx = this._getItemIndex(item);
        idx > -1 && this.setMod(items.eq(this._curItemIndex = idx), 'state', 'selected');

        if (byKeyboard) {
            this._scrollToCurrent();
        }
    },

    _onLeaveItem: function(item) {
        var idx = this._curItemIndex;
        var items = this._getNavItems();

        if (idx > -1 && idx === this._getItemIndex(item)) {
            this.delMod(items.eq(idx), 'state');
            this._curItemIndex = -1;
        }
    },

    _getItems: function() {
        return this._items;
    },

    _getNavItems: function() {
        return this._navItems;
    },

    _updateNavItems: function() {
        var self = this;
        var organizations = self._getOrganizations();
        var resultItems = self._getItems();
        var itemsToExclude = [];

        organizations.forEach(function(organization) {
            if (organization.hasMod('hidden', 'yes')) {
                itemsToExclude = organization.findBlockInside('list').findElem('item');
                resultItems = resultItems.not(itemsToExclude);
            } else {
                itemsToExclude =  organization.findBlockInside('list').findElem('item');
                itemsToExclude = itemsToExclude.filter(function(index, item) {
                    var $item = $(item);

                    return self.hasMod($item, 'hidden', 'yes');
                });
                resultItems = resultItems.not(itemsToExclude);
            }

        });

        this._navItems = resultItems;
    },

    _getInput: function() {
        return this._input;
    },

    _getOrganizations: function() {
        return this._organizations;
    },

    _getRowHeight: function() {
        var items = this._getItems();

        return items.outerHeight();
    },

    _getItemIndex: function(item) {
        var items = this._getNavItems();

        return $.inArray(item.get(0), items);
    },

    _onKeyPress: function(e) {
        var items = this._getNavItems();

        //enter
        if (e.keyCode === 13) {
            e.preventDefault();

            if (this._curItemIndex > -1) {
                this._onSelectItem(items.eq(this._curItemIndex))
            }
        }
    },

    _onKeyDown: function(e) {
        var items = this._getNavItems();

        //up and down
        if (e.keyCode === 38 || e.keyCode === 40) {
            e.preventDefault();

            var len = items.length;

            if (len) {
                var direction = e.keyCode - 39;
                var idx = this._curItemIndex;
                var i = 0;

                do {
                    idx += direction;
                } while(idx >= 0 && idx < len &&
                    this._onEnterItem(items.eq(idx), true) === false && ++i < len
                );
            }
        }
    },

    _onKeyUp: function(e) {
        switch(e.keyCode) {
            case 40: // down arrow
            case 38: // up arrow
            case 16: // shift
            case 17: // ctrl
            case 18: // alt
            case 9: // tab
            case 13: //enter
            case 27: //escape
                break;

            default:
              this._lookup()
          }
    },

    _lookup: function() {
        var input = this._getInput();

        this._query = input.val();

        this._process();
    },

    _process: function() {
        var self = this;
        var items = self._getItems();

        items = $.grep(items, function(item) {
            var $item = $(item);

            if (!$item.hasClass('organization__create-space')) {
                return self._matcher(item);
            }
        });

        self._render(items);
    },

    _render: function(items) {
        var self = this;
        var allItems = self._getItems();
        var filteredItems = allItems.not(items);
        var spaceSwitcher = self.findBlockOutside('space-switcher');
        var organiztions = self._getOrganizations();

        allItems.each(function(index, item) {
            var $item = $(item);

            self.delMod($item, 'hidden');
            self.delMod($item, 'state');
            self.delMod($item, 'matched');
            $item.html($item.html().replace('<strong>', '').replace('</strong>', ''));
        });

        filteredItems.each(function(index, item) {
            var $item = $(item);

            if (!($item.hasClass('organization__name') || $item.hasClass('organization__create-space'))) {
                self.setMod($item, 'hidden', 'yes');
            }
        });

        items.forEach(function(item) {
            var $item = $(item);

            if (this._query !== '') {
                self.setMod($item, 'matched', 'yes');
            }

            $item.html(self._highlight($item.text()));
        });

        organiztions.forEach(function(organization) {
            var list = organization.findBlockInside('list');
            var name = organization.findElem('name');
            var items = list.findElem('item');
            var itemsLength = items.length;
            var hiddenItemsLength = 0;


            items.each(function(index, item) {
                var $item = $(item);

                if (self.hasMod($item,'hidden', 'yes')) {
                    hiddenItemsLength++
                }
            });

            if (itemsLength === hiddenItemsLength + 2) {
                if (!self.hasMod(name, 'matched', 'yes')) {
                    organization.setMod('hidden', 'yes');
                }
            } else {
                organization.delMod('hidden');
            }
        });

        self._updateNavItems();
        self._curItemIndex = 0;

        self._onEnterItem(self._getNavItems().eq(0));

        spaceSwitcher._setPopupHeight();

    },

    _highlight: function (text) {
        var query = this._query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');

        return text.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>';
        });
    },

    _matcher: function(item) {
        return ~item.text.toLowerCase().indexOf(this._query.toLowerCase());
    },

    _onSelectItem: function(item) {
        window.location.href = item.attr('href');
    },

    _scrollToCurrent: function() {
        if (this._curItemIndex < 0) return;

        var curOffsetTop = this.findElem('item', 'state', 'selected').get(0).offsetTop;
        var spaces = this.findElem('spaces');
        var scrollTop = spaces.scrollTop();
        var disp = curOffsetTop - scrollTop;
        var fact = this._rowHeight * 2;
        var newScrollTop;

        if (disp > spaces.height() - fact) {
            newScrollTop = curOffsetTop - fact;
        } else if (scrollTop && disp < fact) {
            newScrollTop = curOffsetTop - spaces.height() + fact;
        }

        newScrollTop && spaces.scrollTop(newScrollTop);
    },

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
        return organizations.map(function(org, index) {
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
