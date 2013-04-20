BEM.DOM.decl('space-switcher', {
    onSetMod: {
        js: function() {
            var self = this;

            self._popup = self.findElem('popup');

            self._setPopupHeight();

            self.bindToWin('resize', self._setPopupHeight);
        },
        active: function() {
            var self = this

            $.when(self._getData()).then(function() {
                console.log(self._data);
                self.toggleMod(self._popup, 'visible', 'yes');
            })
        }
    },

    _popup: null,

    _data: null,

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
    }
},
{
    live: function() {
        this.liveBindTo('control', 'click', function() {
            this._toggleActivity();
        })
    }
});