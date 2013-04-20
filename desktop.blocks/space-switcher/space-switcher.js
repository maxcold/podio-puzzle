BEM.DOM.decl('space-switcher', {
    onSetMod: {
        js: function() {
            var self = this;

            self._popup = self.findElem('popup');

        },
        active: function() {
            var self = this;

            self.toggleMod(self._popup, 'visible', 'yes');
        }
    },

    _popup: null,

    _toggleActivity: function() {
        var self = this;

        self.toggleMod('active', 'yes');
    }
},
{
    live: function() {
        this.liveBindTo('click', function() {
            this._toggleActivity();
        })
    }
});