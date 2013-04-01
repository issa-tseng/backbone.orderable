;(function($) { $(function() {

// define our model/collection
var Person = Backbone.Model.extend({});
var People = Backbone.OrderableCollection.extend({ model: Person });

// define our view
var PersonView = Backbone.View.extend({
    tagName: 'div',
    className: 'person',
    render: function()
    {
        this.$el.data('backbone-model', this.model);
        this.$el.text(this.model.get('name'));
    }
});

var PeopleView = Backbone.OrderableView.extend({
    tagName: 'ul',
    className: 'people',

    events: { 'click .remove': 'removeClicked' },

    render: function()
    {
        this.$el.awesomereorder();
    },

    _addOneView: function(personView, person)
    {
        var self = this;

        var li = $('<li/>');
        li.append($('<a href="#" class="remove">remove</div>'))

        li.append(personView.$el);

        this.$el.append(li);
        this.$el.trigger('awesomereorder-listupdated');

        this.listenTo(person, 'remove', function() { li.remove(); });

        li.on('awesomereorder-dropped', function()
        {
            self.collection.move(person, li.prevAll().length);
        });
    },

    _move: function(model, idx)
    {

        var li = this._views[model.cid].$el.closest('li');
        this.$el.find('> :nth-child(' + (idx + 1) + ')').before(li);
    },

    removeClicked: function(event)
    {
        event.preventDefault();
        this.collection.remove($(event.target).closest('li').find('.person').data('backbone-model'));
    }
});

// make our backbone collection and view
var people = new People(data);
var peopleView = new PeopleView({
    collection: people,
    instanceView: PersonView
});

// drop in the collection
peopleView.render();
$('.interactive').append(peopleView.el);

// populate and maintain the canonical output
var updateCanonical = function() { $('.canonical').text(JSON.stringify(people)); };
updateCanonical();
people.on('move add remove', updateCanonical);

}) })(jQuery);

