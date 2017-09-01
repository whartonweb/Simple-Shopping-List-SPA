var currentList = {};

function createShoppingList() {
    
    currentList.name = $('#shoppingListName').val();
    currentList.items = new Array();
   

    //Web Service Call
    $.ajax({
        type: "POST",
        dataType: "json",
        url: " api/ShoppingListsEF/",
        data: currentList,
        success: function (result) {
            currentList = result;
            showShoppingList();
            history.pushState({ id:result.id }, result.name, "?id=" + result.id);
        }
    });
};

function addItem() {
    var newItem = {};
    newItem.name = $("#newItemName").val();
    newItem.shoppingListId = currentList.id;

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "api/ItemsEF/",
        data: newItem,
        success: function (result) {
            currentList = result;
            drawItems();
            $("#newItemName").val("");
        }
    });
}

function deleteItem(itemId) {

    $.ajax({
        type: "Delete",
        dataType: "json",
        url: "api/ItemsEF/" + itemId,
        success: function (result) {
            currentList = result;
            drawItems();

        }
    });
}

function checkItem(itemId) {
    var changedItem = {};
    for (var i = 0; i < currentList.items.length; i++)
    {
        if (currentList.items[i].id == itemId)
        {
            changedItem = currentList.items[i];
        }
    }

    changedItem.checked = !changedItem.checked;

    $.ajax({
        type: "Put",
        dataType: "json",
        url: "api/ItemsEF/" + itemId,
        data: changedItem,
        success: function (result) {
            changedItem = result;
            drawItems();
         
        }
    });
}

function drawItems() {

    var $list = $("#shoppingListItems").empty();

    for (var i = 0; i < currentList.items.length; i++) {
        var currentItem = currentList.items[i];
        var $li = $("<li>").html(currentItem.name).attr("id", "item_" + i);
        var $deletBtn = $("<button onclick='deleteItem(" + currentItem.id +")'> Delete </button>").appendTo($li);
        var $checkBtn = $("<button onclick='checkItem(" + currentItem.id + ")'> Check </button>").appendTo($li);
        if (currentItem.checked) {
            $li.addClass("checked");
        }

        $li.appendTo($list);
    }
}

function getShoppingLIstById(id) {
    $.ajax({

        type: "Get",
        dataType: "json",
        url: " api/ShoppingListsEF/" + id,
        success: function(result){
            currentList= result;
            showShoppingList();
            drawItems();
        }
    });
}
function showShoppingList() {

    $('#shoppingListTitle').html(currentList.name);
    $('#shoppingListItems').empty();

    $("#createListDiv").hide();
    $("#shoppingListDiv").show();
    $("#newItemName").focus();
    $("#newItemName").unbind("keyup");
    $("#newItemName").keyup(function (e) {
        if (event.keyCode == 13) {
            addItem();
        }
    });
}

function hideShoppingList() {
    $("#createListDiv").show();
    $("#shoppingListDiv").hide();
    $("#shoppingListName").val("");
    $("#shoppingListName").focus();
    $("#shoppingListName").unbind("keyup");
    $("#shoppingListName").keyup(function (e) {
        if (event.keyCode == 13) {
            createShoppingList();
        }
    });
}

$(document).ready(function () {

    $("#shoppingListName").focus();
    $("#shoppingListName").keyup(function (e) {
        if (event.keyCode == 13) {
            createShoppingList() ;
        }
    });

    var pageUrl = window.location.href;
    var idIndex = pageUrl.indexOf("?id=");
    if (idIndex != -1)
    { getShoppingLIstById(pageUrl.substring(idIndex + 4)); }
    window.onpopstate = function (e) {
        if (event.state == null) {
            //hide shopping list
            hideShoppingList();
        } else {
            getShoppingLIstById(event.state.id);
        }

    };

});