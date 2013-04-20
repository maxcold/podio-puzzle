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

            $.when(self._loadData()).then(function() {
                var organizations = self._getData();
                var bemjson = [];

                console.log(organizations)

                bemjson = organizations.map(function(org) {
                   return {
                       block: 'organization',
                       content: [
                           {
                               elem: 'icon',
                               src: (org.image && org.image.thumbnail_link) || ''
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
                                       url: org.url,
                                       content: org.name
                                   }
                               ]
                           }
                       ]
                   };
                });

                console.log(BEMHTML.apply(bemjson))
                self.toggleMod(popup, 'visible', 'yes');
            })
        }
    },

    _popup: null,

    _data: null,

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