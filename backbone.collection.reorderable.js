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
        factory(require('underscore'), require('Backbone'));
    else
        // globals
        factory(_, Backbone);
})(function(_, Backbone)
{
    var OrderableCollection = Backbone.Collection.extend({
        move: function(model, idx)
        {
            var oldIdx = this.models.indexOf(model);
            if (oldIdx >= 0)
            {
                // we already know about this model, so we can do something with it
                this.models.splice(oldIdx, 1);

                // adjust desired target if we just moved it around
                var targetIdx = idx;
                if (targetIdx >= oldIdx)
                {
                    targetIdx += 1;
                }

                // new position
                this.models.splice(targetIdx, 0, model);

                // inform the world
                this.trigger('moved', model, idx);
            }
        }
    });

    Backbone.OrderableCollection = OrderableCollection;

    if (typeof module != 'undefined')
        module.exports = OrderableCollection;

    return Backbone;
});

