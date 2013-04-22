BEM.DOM.decl('space-switcher-filter', {

    onSetMod: {
        js: function() {
            var self = this;
            var $spacesContainer = self.findElem('spaces-inner');

            // wait for data loading and build html with this data
            $.when(self.loadData()).then(function() {
                var data = self._getData();
                var bemjson = BEM.blocks['organization']._build(data); // get bemjson data for organization blocks
                var html = BEMHTML.apply(bemjson); // build html with bemjson

                // append this html to space-inner element
                $spacesContainer.append(html);

                // kind of constructor for initialization block fields in one place
                self._initFields();

                self._bindToMouseEvents();
            });
        },

        focused: {

            /**
             * on focus set real focus to input element and binds to keyboards events
             */
            'yes': function() {
                var $input = this._getInput();

                $input.focus();

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

            /**
             * on focus remove unbind from keyboard events
             */
            '': function() {
                this.unbindFrom('keypress keydown keyup');
            }
        }
    },

    onElemSetMod: {
        'item': {

            /**
             * when item is matching search query
             */
            'matched': {

                /**
                 * highlight matched text with Google style highlighting
                 * @param {jQuery} $elem
                 */
                'yes': function($elem) {
                    $elem.html(this._highlight($elem.text()))
                },

                /**
                 * delete highlighting (<strong>text</strong>) after deleting mod 'matched'
                 * @param {jQuery} $elem
                 */
                '': function($elem) {
                    var clearedText = $elem.html().replace('<strong>', '').replace('</strong>', '');

                    $elem.html(clearedText);
                }
            }
        }
    },

    /** {Object} json data from server */
    _data: null,

    /** {jQuery} item elements */
    _items: null,

    /** {jQuery} visible elements to navigate with keyboard */
    _navItems: null,

    /** {jQuery} input element to filter with */
    _input: null,

    /** {BEM} organization blocks with name, icon and spaces */
    _organizations: null,

    /** {BEM} wrapper space-switcher block, which control visibility of this block */
    _spaceSwitcher: null,

    /** {Number} currently selected item */
    _curItemIndex: -1,

    /** {Number} height of one space row, 23px by default */
    _rowHeight: 23,

    /** {String} current search query */
    _query: '',

    /**
     * initialize block fields
     * @private
     */
    _initFields: function() {
        this._items = this.findElem('item');
        this._navItems = this._items;
        this._input = this.findElem('input');
        this._organizations = this.findBlocksInside('organization');
        this._spaceSwitcher = this.findBlockOutside('space-switcher');
        this._rowHeight = this._getRowHeight();
        this._curItemIndex = 0;
    },

    /**
     * bind to mouseover and mouseout events in item elements
     * @private
     */
    _bindToMouseEvents: function() {
        var self = this;
        var $items = self._getItems();

        self.bindTo($items, {
            'mouseover': function(e) {
                self._onEnterItem(e.data.domElem);
            },
            'mouseout': function(e) {
                self._onLeaveItem(e.data.domElem);
            }
        });

    },

    /**
     * handler for mouse enter event
     * @param {DOM} item
     * @param {boolean} byKeyboard
     * @private
     */
    _onEnterItem: function(item, byKeyboard) {
        var idx = this._curItemIndex;
        var $items = this._getNavItems();

        idx > -1 && this.delMod($items.eq(idx), 'state'); // delete state from old item
        idx = this._getItemIndex(item); // get index of new item
        idx > -1 && this.setMod($items.eq(this._curItemIndex = idx), 'state', 'selected'); //set state on new item and renew current index

        // scroll to selected item when navigate with keyboard
        if (byKeyboard) {
            this._scrollToCurrent();
        }
    },

    _onLeaveItem: function(item) {
        var idx = this._curItemIndex;
        var $items = this._getNavItems();

        // remove state selected from item with index, which have leaved item and renew current index (nothing selected)
        if (idx > -1 && idx === this._getItemIndex(item)) {
            this.delMod($items.eq(idx), 'state');
            this._curItemIndex = -1;
        }
    },

    /**
     *
     * @returns {jQuery}
     * @private
     */
    _getItems: function() {
        return this._items;
    },

    /**
     *
     * @returns {jQuery}
     * @private
     */
    _getNavItems: function() {
        return this._navItems;
    },

    /**
     * update list of navigate items (visible, with keyboard) after each filtering
     * @private
     */
    _updateNavItems: function() {
        var self = this;
        var organizations = self._getOrganizations();
        var $resultItems = self._getItems();
        var itemsToExclude = [];

        // exclude all hidden items and items from each hidden 'organization' block
        organizations.forEach(function(organization) {
            var $organization = $(organization.domElem);

            if (organization.hasMod('hidden', 'yes')) {
                itemsToExclude = self.findElem($organization, 'item');
            } else {
                itemsToExclude = self.findElem($organization, 'item', 'hidden', 'yes');
            }

            $resultItems = $resultItems.not(itemsToExclude);

        });

        // set the new set of visible items
        this._navItems = $resultItems;
    },

    /**
     *
     * @returns {jQuery}
     * @private
     */
    _getInput: function() {
        return this._input;
    },

    /**
     *
     * @returns {BEM}
     * @private
     */
    _getOrganizations: function() {
        return this._organizations;
    },

    /**
     *
     * @returns {BEM}
     * @private
     */
    _getSpaceSwitcher: function() {
        return this._spaceSwitcher;
    },

    _getRowHeight: function() {
        var $items = this._getItems();

        return $items.outerHeight();
    },

    /**
     * get index of passed item in navItemes set
     * @param {jQuery} $item
     * @returns {Number}
     * @private
     */
    _getItemIndex: function($item) {
        var $items = this._getNavItems();

        return $.inArray($item.get(0), $items);
    },

    /**
     * Handler for pressing 'enter' key event
     * go to the link of the active element
     * @param {Event} e
     * @private
     */
    _onKeyPress: function(e) {
        var $items = this._getNavItems();

        // enter
        if (e.keyCode === 13) {
            e.preventDefault();

            if (this._curItemIndex > -1) {
                this._onSelectItem($items.eq(this._curItemIndex));
            }
        }
    },

    /**
     * handler for pressing 'up' and 'down' keys event
     * navigate up and down in the list, and move the highlighting of the active item
     * @param {Event} e
     * @private
     */
    _onKeyDown: function(e) {
        var $items = this._getNavItems();

        //up and down
        if (e.keyCode === 38 || e.keyCode === 40) {
            e.preventDefault();

            var len = $items.length;

            if (len) {
                var direction = e.keyCode - 39; // -1 for up and 1 for down
                var idx = this._curItemIndex;
                var i = 0;

                // set the new index of selected element and enter in it like with mouse (mousover)
                // until the end or the beginning of items list
                do {
                    idx += direction;
                } while(idx >= 0 && idx < len &&
                    this._onEnterItem($items.eq(idx), true) === false && ++i < len
                );
            }
        }
    },

    /**
     * first step of filterind
     * handler for filtering (symbol key is pressed)
     * @param {Event} e
     * @private
     */
    _onKeyUp: function(e) {
        // tab, enter, shift, ctrl, alt, escape, up and down
        var nonSymbolKeys = [9, 13, 16, 17, 18, 27, 38, 40];

        // filter out system keys and lookup for typed text
        if (!~$.inArray(e.keyCode, nonSymbolKeys)) {
            this._lookup();
        }
    },

    /**
     * second step of filtering
     * set query to current value of input element and proceed to the next step
     * @private
     */
    _lookup: function() {
        var $input = this._getInput();

        this._query = $input.val();

        this._process();
    },

    /**
     * third step of filtering
     * grep matched with typed text items through all items and proceed to final step
     * @private
     */
    _process: function() {
        var self = this;
        var items = self._getItems().toArray();

        items = $.grep(items, function(item) {
            return self._matcher(item);
        });

        self._render(items);
    },

    /**
     * matching function for grep through items
     * @param {DOM} item
     * @returns {boolean}
     * @private
     */
    _matcher: function(item) {
        var $item = $(item);
        var query = this._query;
        var queryText = query.toLowerCase();
        var itemText = item.text.toLowerCase();

        // don't search in create-space link
        return ~itemText.indexOf(queryText) && !$item.hasClass('organization__create-space');
    },

    /**
     * final step of filtering
     * render list of spaces with matching items
     * @param {Array} items
     * @private
     */
    _render: function(items) {
        var self = this;
        var $allItems = self._getItems(); // all spaces in all oranizations
        var $filteredItems = $allItems.not(items); // spaces which are not matched with typed text
        var spaceSwitcher = self._getSpaceSwitcher();
        var organizations = self._getOrganizations();

        // clear all states of items
        $allItems.each(function(index, item) {
            var $item = $(item);

            self.delMod($item, 'hidden')
                .delMod($item, 'state')
                .delMod($item, 'matched');
        });

        // hide all not matched items, except organization name and create-space link
        $filteredItems.each(function(index, item) {
            var $item = $(item);

            if (!($item.hasClass('organization__name') || $item.hasClass('organization__create-space'))) {
                self.setMod($item, 'hidden', 'yes');
            }
        });

        // set mod matched to the mathed items, if query is not empty (it happens when user delete all text in input)
        items.forEach(function(item) {
            var $item = $(item);

            if (this._query !== '') {
                self.setMod($item, 'matched', 'yes');
            }
        });

        // hide all organization block if all items in it is hidden (excludes name and create-space link)
        // if name of organization don't match the query
        organizations.forEach(function(organization) {
            var $name = organization.findElem('name');
            var list = organization.findBlockInside('list');
            var $items = list.findElem('item');
            var itemsLength = $items.length;
            var hiddenItemsLength = 0;


            $items.each(function(index, item) {
                var $item = $(item);

                if (self.hasMod($item,'hidden', 'yes')) {
                    hiddenItemsLength++
                }
            });

            if (itemsLength === hiddenItemsLength + 2) {
                if (!self.hasMod($name, 'matched', 'yes')) {
                    organization.setMod('hidden', 'yes');
                }
            } else {
                organization.delMod('hidden');
            }
        });

        // update list if visible elements for navigation
        self._updateNavItems();

        // After a search/filter has been completed, the first item needs to be highlighted
        self._onEnterItem(self._getNavItems().eq(0));

        // renew popup height
        spaceSwitcher.setPopupHeight();

        // and scroll to new current element
        self._scrollToCurrent();

    },

    /**
     * Google style highlighting
     * @example
     * //returns 'Po<strong>di</strong>o'
     * this._query = 'di';
     * this._highlight('Podio');
     * @param {String} text
     * @returns {String}
     * @private
     */
    _highlight: function (text) {

        // replace all special RegExp symbols with \symbol {'text*' -> 'text\*'}
        var query = this._query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');

        return text.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>';
        });
    },

    /**
     * Enter/Return should go to the link of the active element
     * @param {jQuery} $item
     * @private
     */
    _onSelectItem: function($item) {
        window.location.href = $item.attr('href');
    },

    /**
     * scroll to current element in spaces list
     * @private
     */
    _scrollToCurrent: function() {
        if (this._curItemIndex < 0) return;

        var curOffsetTop = this.findElem('item', 'state', 'selected').get(0).offsetTop; // curren item offset in list
        var $spaces = this.findElem('spaces');
        var scrollTop = $spaces.scrollTop(); // scroll position of spaces element
        var disp = curOffsetTop - scrollTop; // disposition of current element relative to scroll position
        var fact = this._rowHeight * 2; // always show current element and next to it
        var newScrollTop;

        // if element position under the visible border update scroll position of spaces list
        if (disp > $spaces.height() - fact) {
            newScrollTop = curOffsetTop - fact;
        } else if (scrollTop && disp < fact) {
            newScrollTop = curOffsetTop - $spaces.height() + fact;
        }

        newScrollTop && $spaces.scrollTop(newScrollTop);
    },

    /**
     *
     * @returns {Object|null}
     * @private
     */
    _getData: function() {
        return this._data;
    },

    focus: function() {
        return this.setMod('focused', 'yes');
    },

    blur: function() {
        return this.delMod('focused');
    },

    /**
     * if data is loaded resolve promise,
     * else load it from 'data.json' file, set _data field and resolve promise
     * @returns {jQuery.Promise}
     */
    loadData: function() {
        var self = this;
        var dfd = $.Deferred();

        if (!self._data) {
            $.ajax({
                url: 'data.json',
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
    }

});
