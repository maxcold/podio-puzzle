BEM.DOM.decl('space-switcher', {
    onSetMod: {
        js: function() {
            var self = this;

            self._popup = self.findElem('popup');

            self._popupHeightHandler();

            self.bindToWin('click', self._onOutsideClick);
        },
        active: function() {
            var self = this;
            var popup = self._getPopup();

            self.toggleMod(popup, 'visible', 'yes');
        }
    },

    _popup: null,

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

        if (popupHeight > minPopupHeight || spacesInnerHeight > popupHeight) {
            spaces.css({height: (minPopupHeight - inputHeight < spacesInnerHeight) ? minPopupHeight - inputHeight : spacesHeight});
        }
    },

    _getPopup: function() {
        return this._popup;
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