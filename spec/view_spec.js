var Backbone = require('backbone');
Backbone.$ = require('jquery');

var OrderableCollection = require('../backbone.orderable').OrderableCollection;
var OrderableView = require('../backbone.orderable').OrderableView;

var BasicModel = Backbone.Model.extend({});
var OrderableCollection = OrderableCollection.extend({
    model: BasicModel
});

var BasicView = Backbone.View.extend({
    tagName: 'div',
    className: 'basic',
    render: function() { this.$el.text(this.model.get('name')); }
});
var OrderableView = OrderableView.extend({
    tagName: 'div',
    className: 'basicList'
});

describe('add model', function()
{
    it('should add the element to the list', function()
    {
        var list = new OrderableCollection();
        var listView = new OrderableView({ collection: list, instanceView: BasicView });

        expect(listView.$el.children().length).toEqual(0);

        list.add(new BasicModel());

        expect(listView.$el.children().length).toEqual(1);
    });

    it('should render with the correct renderer on add', function()
    {
        var list = new OrderableCollection();
        var listView = new OrderableView({ collection: list, instanceView: BasicView });
        list.add(new BasicModel({ name: 'your face' }));

        expect(listView.$el.children(':first').attr('class')).toEqual('basic');
        expect(listView.$el.children(':first').text()).toEqual('your face');
    });

    it('should automatically render and add elements already in the collection', function()
    {
        var list = new OrderableCollection([ { name: 'your face' }, { name: 'it\'s bad' } ]);
        var listView = new OrderableView({ collection: list, instanceView: BasicView });

        expect(listView.$el.children().length).toEqual(2);

        expect(listView.$el.children(':first').text()).toEqual('your face');
        expect(listView.$el.children(':last').text()).toEqual('it\'s bad');
    });
});

describe('remove model', function()
{
    it('should remove dom elements when the models are removed', function()
    {
        var list = new OrderableCollection([ { name: 'to my everyday friend' }, { name: 'cheers' } ]);
        var listView = new OrderableView({ collection: list, instanceView: BasicView });

        var model1 = list.at(0);

        list.remove(model1);

        expect(listView.$el.children().length).toEqual(1);
        expect(listView.$el.children(':first').text()).toEqual('cheers');
    });
});

describe('move model', function()
{
    it('should move dom elements when they\'re moved in the collection', function()
    {
        var list = new OrderableCollection([ { name: 'that means you\'re on my twelve' }, { name: 'good' } ]);
        var listView = new OrderableView({ collection: list, instanceView: BasicView });

        var model2 = list.at(1);

        list.move(model2, 0);

        expect(listView.$el.children().length).toEqual(2);
        expect(listView.$el.children(':first').text()).toEqual('good');
    });
});

