// backbone.collection.reorderable -- because apparently everyone just sorts everything
// method and event to more easily allow user-reordering as a collection idiom.
//
//
// License: WTFPL

// setup code derived from backbone-deep-model:
;(function(factory)
{
    if (typeof define === 'function' && define.amd)
        // AMD
        define([ 'underscore', 'backbone' ], factory);
    else if (typeof require === 'function')
        // Non-AMD CommonJS
        factory(require('underscore'), require('backbone'));
    else
        // globals
        factory(_, Backbone);
})(function(_, Backbone)
{
    // augment Collection with a method to move Models around
    var OrderableCollection = Backbone.Collection.extend({
        move: function(model, idx)
        {
            var oldIdx = this.models.indexOf(model);
            if (oldIdx >= 0)
            {
                // we already know about this model, so we can do something with it
                this.models.splice(oldIdx, 1);

                // adjust desired target if we just moved it around
                if (idx > this.models.length) { idx = this.models.length; }
                if (idx < 0) { idx = 0; }

                // new position
                this.models.splice(idx, 0, model);

                // inform the world
                this.trigger('move', model, idx);
            }
        }
    });
    Backbone.OrderableCollection = OrderableCollection;

    // semi-underdefined view that ties with OrderableCollection to
    // ease and automate both general collection view management and
    // view movement.
    var OrderableView = Backbone.View.extend({
        initialize: function()
        {
            var self = this;

            // super
            Backbone.View.prototype.initialize.apply(this, arguments);

            // keep track of the view we generate per model
            this._views = {};

            // track existing models
            this.collection.each(function(model) { self._addOne(model); });

            // handle new/removed instances
            this.collection.on('add', function(model) { self._addOne(model); });
            this.collection.on('move', function(model, idx) { self._move(model, idx); });
            this.collection.on('remove', function(model) { self._removeOne(model); });
        },

        // prerender and track a model
        _addOne: function(model)
        {
            var view = new this.options.instanceView({ model: model });
            this._views[model.cid] = view;

            this._addOneView(view, model);
            view.render();
        },

        // actually add the view to the dom. this is defined separately
        // so that it's easy to override. if you want to eg bind drag
        // events or add a remove button to the item, this is a great place
        // to do it.
        _addOneView: function(view, model)
        {
            this.$el.append(view.$el);
        },

        // this is just a default implementation of move assuming that each
        // model's element is the direct child of the collection view. this
        // is often not the case, so if _addOneView is overriden with other
        // behavior this should probably be overriden as well.
        _move: function(model, idx)
        {
            var modelEl = this._views[model.cid].el;
            this.$el.children(':nth-child(' + (idx + 1) + ')').before(modelEl);
        },

        // remove an model. pretty self-explanatory
        _removeOne: function(model)
        {
            // we want to remove the model from the dom, but we don't know if
            // the owner of the model actually wants it swept away, so simply
            // remove the element.
            this._views[model.cid].$el.remove();
            delete this._views[model.cid];
        }
    });
    Backbone.OrderableView = OrderableView;

    if (typeof module != 'undefined')
    {
        module.exports = {
            OrderableCollection: OrderableCollection,
            OrderableView: OrderableView
        };
    }

    return Backbone;
});

