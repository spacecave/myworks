;(function() {
    var testview = Backbone.View.extend({
        el: $('#main'),

        template: _.template($('#indexTemp').html()),

        initialize: function() {
            _.bindAll(this, 'render');

            this.render();
        },

        save: function(event) {
            event.stopPropagation();
            event.preventDefault();
            this.model.set({
                test: 'now you see me again'
            });
        },

        render: function() {
            $(this.el).append(this.template(this.model.toJSON));
        }
    });

    var testview = new testview();
})();