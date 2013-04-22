BEM.DOM.decl('space-switcher', {
    onSetMod: {
        js: function() {
            var self = this;

            self._popup = self.findElem('popup');
            self._filter = self.findBlockInside('space-switcher-filter');

            self._popupHeightHandler();

            // binding to window click event
            self.bindToWin('click', self._onOutsideClick);
        },
        active: {
            'yes': function() {
                var self = this;
                var $popup = self._getPopup();
                var filter = self._getFilter();

                // wait until the data for block space-switcher-filter is loaded
                // and set our block to visible state
                $.when(filter.loadData()).then(function(){
                    self.toggleMod($popup, 'visible', 'yes');

                    // once it visible set focus to the input in space-switcher-filter block
                    filter.focus();
                });
            },
            '': function() {
                var self = this;
                var $popup = self._getPopup();
                var filter = self._getFilter();

                // set our block in invisible state
                // and remove focus from input in space-switcher-filter block
                self.toggleMod($popup, 'visible', 'yes');
                filter.blur();
            }
        }
    },

    /** {jQuery} popup element of block */
    _popup: null,

    /** {BEM} filter block instance, which implement searching through spaces functionality */
    _filter: null,

    /** @returns {boolean} */
    _isActive: function() {
        return this.hasMod('active');
    },

    _toggleActivity: function() {
        this.toggleMod('active', 'yes');
    },

    /** first popup resize and binding to window 'resize' event with throttling */
    _popupHeightHandler: function() {
        this.setPopupHeight();

        this.bindToWin('resize', $.throttle(100, this.setPopupHeight));
    },

    /**
     *
     * @returns {jQuery}
     * @private
     */
    _getPopup: function() {
        return this._popup;
    },

    /**
     *
     * @returns {BEM}
     * @private
     */
    _getFilter: function() {
        return this._filter;
    },

    /**
     * handler for clicks outside the block
     * @param {event} e
     * @private
     */
    _onOutsideClick: function(e) {
        var $target = $(e.target);

        // if space-switcher block doesn't contains clicked element and active, delete active mod
        if (!this.containsDomElem($target) && this._isActive()) {
            this.delMod('active');
        }
    },

    /**
     * calculate right height for popup:
     * max-height should be 80% of viewport
     */
    setPopupHeight: function() {
        var $popup = this._getPopup();
        var popupHeight = $popup.height(); // current height of popup
        var filter = this.findBlockInside('space-switcher-filter');
        var $spaces = filter.findElem('spaces');
        var $spacesInner = filter.findElem('spaces-inner');
        var input = filter.findElem('input');
        var inputHeight = input.outerHeight(true); // height with margins of input element in space-switcher-filter block
        var spacesHeight = $spacesInner.outerHeight(true); // height with margins of spaces element in space-switcher-filter block
        var spacesInnerHeight = spacesHeight + inputHeight;
        var viewportHeight = $(window).height();
        var maxPopupHeight = viewportHeight*0.8 - 40; // max-height of popup (80% viewport - header height)

        // if current height of popup is larger then max-height
        // or height of popup content not equal to popup height itself
        // we change spaces element height
        if (popupHeight > maxPopupHeight || spacesInnerHeight !== popupHeight) {

            // if spaces element is larger then max-height (consider height of input element)
            // then height of spaces element should be the same as max-height minus height of input element (variant with scroll)
            // else set spaces height to its inner content heigth
            $spaces.css(
                {
                    height: (maxPopupHeight - inputHeight < spacesInnerHeight) ?
                        maxPopupHeight - inputHeight :
                        spacesHeight
                }
            );
        }
    }
},
{
    live: function() {

        // activate block functionality when clicking on control element
        this.liveBindTo('control', 'click', function() {
            this._toggleActivity();
        })
    }
});