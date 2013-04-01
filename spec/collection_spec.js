var Backbone = require('backbone');
var OrderableCollection = require('../backbone.orderable').OrderableCollection;

var BasicModel = Backbone.Model.extend({});
var OrderableCollection = OrderableCollection.extend({
    model: BasicModel
});

describe('move()', function()
{
    it('should move an element to an index', function()
    {
        var collection = new OrderableCollection([ new BasicModel(), new BasicModel() ]);

        var model1 = collection.at(0);
        var model2 = collection.at(1);

        collection.move(model2, 0);

        expect(collection.at(0)).toBe(model2);
        expect(collection.at(1)).toBe(model1);
    });

    it('should move an element forwards correctly', function()
    {
        var collection = new OrderableCollection([ new BasicModel(), new BasicModel(), new BasicModel(), new BasicModel() ]);

        var model1 = collection.at(0);
        var model2 = collection.at(1);
        var model3 = collection.at(2);
        var model4 = collection.at(3);

        collection.move(model1, 2);

        expect(collection.at(0)).toBe(model2);
        expect(collection.at(1)).toBe(model3);
        expect(collection.at(2)).toBe(model1);
        expect(collection.at(3)).toBe(model4);
    });

    it('should not move an element past the end of the array', function()
    {
        var collection = new OrderableCollection([ new BasicModel(), new BasicModel() ]);

        var model1 = collection.at(0);
        var model2 = collection.at(1);

        collection.move(model1, 5);

        expect(collection.at(0)).toBe(model2);
        expect(collection.at(1)).toBe(model1);
    });

    it('should not move an element past the beginning of the array', function()
    {
        var collection = new OrderableCollection([ new BasicModel(), new BasicModel() ]);

        var model1 = collection.at(0);
        var model2 = collection.at(1);

        collection.move(model2, -3);

        expect(collection.at(0)).toBe(model2);
        expect(collection.at(1)).toBe(model1);
    });

    it('should impact the canonical representation', function()
    {
        var collection = new OrderableCollection([ new BasicModel({ attr: 1 }), new BasicModel({ attr: 2 }), new BasicModel({ attr: 3 }) ]);

        var model = collection.at(2);

        collection.move(model, 1);

        expect(JSON.stringify(collection)).toEqual(JSON.stringify([{ attr: 1 }, { attr: 3 }, { attr: 2 }]));
    });

    it('should fire an event with the model and the new index', function()
    {
        var collection = new OrderableCollection([ new BasicModel(), new BasicModel() ]);

        var model = collection.at(0);

        var eventFired = false;
        collection.on('move', function(movedModel, idx)
        {
            expect(movedModel).toBe(model);
            expect(idx).toEqual(1);
            eventFired = true;
        });

        collection.move(model, 1);

        expect(eventFired).toBe(true);
    });
});

