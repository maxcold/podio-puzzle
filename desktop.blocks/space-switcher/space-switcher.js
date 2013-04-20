BEM.DOM.decl('space-switcher', {
    onSetMod: {
        js: function() {
            var self = this;

            self._popup = self.findElem('popup');
            self._popupInner = self.findElem('popup-inner');

            self._popupHeightHandler();

            self.bindToWin('click', self._onOutsideClick);
        },
        active: function() {
            var self = this;
            var popup = self._getPopup();

            $.when(self._getData()).then(function() {
                console.log(self._data);
                self.toggleMod(popup, 'visible', 'yes');
            })
        }
    },

    _popup: null,

    _popupInner: null,

    _data: null,

    _isActive: function() {
        return this.hasMod('active');
    },

    _toggleActivity: function() {
        this.toggleMod('active', 'yes');
    },

    _popupHeightHandler: function() {
        this._setPopupHeight();

        this.bindToWin('resize', this._setPopupHeight);
    },

    _setPopupHeight: function() {
        var popup = this._getPopup();
        var popupHeight = popup.height();
        var popupInner = this._getPopupInner();
        var popupInnerHeight = popupInner.height();
        var viewportHeight = $(window).height();
        var minPopupHeight = viewportHeight*0.8 - 40;

        console.log()

        if (popupHeight > minPopupHeight || popupInnerHeight > minPopupHeight) {
            popup.css({height: minPopupHeight});
        }
    },

    _getPopupInner: function() {
        return this._popupInner;
    },

    _getPopup: function() {
        return this._popup;
    },

    _getData: function() {
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