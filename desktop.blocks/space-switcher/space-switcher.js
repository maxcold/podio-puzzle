BEM.DOM.decl('space-switcher', {
    onSetMod: {
        js: function() {
            this._popup = this.findElem('popup');

            this._setPopupHeight();

            this.bindToWin('resize', this._setPopupHeight);
        },
        active: function() {
            this.toggleMod(this._popup, 'visible', 'yes');
        }
    },

    _popup: null,

    _toggleActivity: function() {
        this.toggleMod('active', 'yes');
    },

    _setPopupHeight: function() {
        var viewportHeight = $(window).height();
        var popup = this._getPopup();

        popup.css({height: viewportHeight*0.8 - 40});
    },

    _getPopup: function() {
        return this._popup;
    }
},
{
    live: function() {
        this.liveBindTo('control', 'click', function() {
            this._toggleActivity();
        })
    }
});