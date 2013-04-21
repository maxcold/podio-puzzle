BEM.DOM.decl('space-switcher', {
    onSetMod: {
        js: function() {
            var self = this;

            self._popup = self.findElem('popup');
            self._filter = self.findBlockInside('space-switcher-filter');

            self._popupHeightHandler();

            self.bindToWin('click', self._onOutsideClick);
        },
        active: {
            'yes': function() {
                var self = this;
                var popup = self._getPopup();
                var filter = self._getFilter();

                $.when(filter._loadData()).then(function(){
                    self.toggleMod(popup, 'visible', 'yes');
                    filter._focus();
                });
            },
            '': function() {
                var self = this;
                var popup = self._getPopup();
                var filter = self._getFilter();

                self.toggleMod(popup, 'visible', 'yes');
                filter._blur();
            }
        }
    },

    _popup: null,

    _filter: null,

    _isActive: function() {
        return this.hasMod('active');
    },

    _toggleActivity: function() {
        this.toggleMod('active', 'yes');
    },

    _popupHeightHandler: function() {
        this._setPopupHeight();

        this.bindToWin('resize', $.throttle(100, this._setPopupHeight));
    },

    _setPopupHeight: function() {
        var popup = this._getPopup();
        var popupHeight = popup.height();
        var filter = this.findBlockInside('space-switcher-filter');
        var spaces = filter.findElem('spaces');
        var spacesInner = filter.findElem('spaces-inner');
        var input = filter.findElem('input');
        var inputHeight = input.outerHeight(true);
        var spacesHeight = spacesInner.outerHeight(true);
        var spacesInnerHeight = spacesHeight + inputHeight;
        var viewportHeight = $(window).height();
        var minPopupHeight = viewportHeight*0.8 - 40;

        if (popupHeight > minPopupHeight || spacesInnerHeight !== popupHeight) {
            spaces.css(
                {
                    height: (minPopupHeight - inputHeight < spacesInnerHeight) ?
                        minPopupHeight - inputHeight :
                        spacesHeight
                }
            );
        }
    },

    _getPopup: function() {
        return this._popup;
    },

    _getFilter: function() {
        return this._filter;
    },

    _onOutsideClick: function(e) {
        var $target = $(e.target);

        if (!this.containsDomElem($target) && this._isActive()) {
            this.delMod('active');
        }
    }
},
{
    live: function() {
        this.liveBindTo('control', 'click', function() {
            this._toggleActivity();
        })
    }
});