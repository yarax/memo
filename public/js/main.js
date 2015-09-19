var memo = angular.module('memo', []);
memo.controller('main', function ($scope, $http) {

    $scope.cardIndex = 0;
    $scope.cards = [];

    function shuffle(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    function nextCard(recurs) {
        if (!recurs) recurs = 0;
        if (recurs > $scope.cards.length) {
            $scope.currentCard = null;
            return;
        }
        var i = $scope.cardIndex;
        if (i >= $scope.cards.length) i = 0;
        $scope.currentCard = $scope.cards[i];
        $scope.cardIndex = i + 1;
        if ($scope.currentCard.score > 2) {
            nextCard(recurs + 1);
        }
    }

    $scope.categories = [];
    var getCategories = function () {
        $http.get('/api/categories').then(function (res) {
            $scope.categories = res.data;
        });
    };

    $scope.submitCreate = function () {
        $scope.created = false;
        if (!$scope.question || !$scope.answer || !$scope.category  ) return;
        $http.post('/api/card', {
            q: $scope.question,
            a: $scope.answer,
            category: $scope.category
        }).then(function () {
            //$scope.createShow = false;
            $scope.created = true;
            getCategories();
        });
    };

    $scope.showCategory = function (category) {
        $http.get('/api/cards?category=' + category).then(function (res) {
            $scope.cards = shuffle(res.data);
            nextCard();
        });
    };

    $scope.success = function () {
        $scope.showAnswer = false;
        $scope.currentCard.score = ($scope.currentCard.score || 0) + 1;
        nextCard();
    };
    $scope.fail = function () {
        $scope.showAnswer = false;
        setTimeout(function () {console.log($scope.showAnswer)}, 1000);
        if ($scope.currentCard.score === 0) return nextCard();
        if ($scope.currentCard.score === undefined) $scope.currentCard.score = 0;
        $scope.currentCard.score--;
        nextCard();
    };

    $scope.deleteCard = function (id) {
        $http.delete('/api/card/' + id).then(function (res) {
            $scope.currentCard.score = 3;
            nextCard();
            getCategories();
        });
    };


    getCategories();

});