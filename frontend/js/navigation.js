var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function () {
    var navigation = [
        {
            name: "Home",
            classis: "active",
            anchor: "home",
            subnav: []
        }, 
        {
            name: "Category",
            classis: "active",
            anchor: "category",
            subnav: [{
                name: "Sports",
                classis: "active",
                anchor: "sports"
            },
            {
                name: "News",
                classis: "active",
                anchor: "News"
            }]
       }];

    return {
        getnav: function () {
            return navigation;
        },
        makeactive: function (menuname) {
            for (var i = 0; i < navigation.length; i++) {
                if (navigation[i].name == menuname) {
                    navigation[i].classis = "active";
                } else {
                    navigation[i].classis = "";
                }
            }
            return menuname;
        },

    };
});