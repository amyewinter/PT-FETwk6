/*  Final coding project, week 6, Front End Technologies
by Amy Winter, November 13, 2021

Build a create-read-update-delete application using a remote API https://crudcrud.com/

I was not assigned a coding partner by Ken; this project is all my own work using the class and lesson videos as examples.

This is a prototype of an item tracking system for a small-scale online store similar to Etsy etc.  A shop will have an array for items, and a name.  

Items will have properties itemName, itemNum, type, status, and price.

*/

//To Do list
//X Get and display list of shops
//X Add shop
//Edit shop(name)
// X Delete shop

//X Get and display list of items
//Add item to specified shop
//Edit item
//Delete item

//fix paths to node modules in index.html before final commit
//need to add code for add item button, to add items to shop - see line 133
//need click handler for deleting items even though button exists?
//------------------------------------------------------------------------------------------------
//API endpoint - valid until 12/11/2021
const baseUrl =
  "https://crudcrud.com/api/f770c19eee1c4acfa40526be802779f5/shops";

//function to POST/CREATE data
function makePost(url, string) {
  return $.ajax({
    url: url,
    type: "POST",
    datatype: "json",
    data: JSON.stringify(string),
    contentType: "application/json",
  });
}

//function to PUT/UPDATE data
function makePut(url, string) {
  return $.ajax({
    url: url,
    type: "PUT",
    //dataType: "json", //not used with PUT requests with this API
    data: JSON.stringify(string),
    contentType: "application/json",
  });
}

//function to DELETE data

function deleteData(url, string) {
  return $.ajax({
    url: url,
    type: "DELETE",
    datatype: "json",
    data: JSON.stringify(string),
    contentType: "application/json",
  });
}

//function to GET data
function getData(url, string) {
  return $.ajax({
    url: url,
    type: "GET",
    datatype: "json",
    data: JSON.stringify(string),
    contentType: "application/json",
  });
}
//---------------------------------------------------------------------------------------------

//creating some data to help work with display
function makeData() {
  let shop = new Shop("Desert Oddities");
  let scarf = new Item("Vintage Pueblo Ring", 01, "ring", "active", 125);
  shop.items.push(scarf);
  makePost(baseUrl, shop).then((resp) => console.log(resp));
}
//-------------------------------------------------------------------------------------------
//Entities
class Shop {
  constructor(shopName) {
    this.name = shopName;
    this.items = [];
  }
}

class Item {
  constructor(itemName, itemNum, type, status, price) {
    this.itemName = itemName;
    this.itemNum = itemNum;
    this.type = type;
    this.status = status;
    this.price = price;
  }
}

//-------------------------------------------------------------------------------------------
//Service - a set of static methods to make calls to the API functions defined above;
//no constructor needed as we are not creating objects
//DOM Manager layer calls ShopService functions which call the API functions on lines 27-70

class ShopService {
  static getAllShops() {
    return $.get(baseUrl);
  }

  //add shop
  static createShop(name) {
    let newShop = new Shop(name);
    return makePost(baseUrl, newShop);
  }

  //edit shop

  //delete shop
  static deleteShop(id) {
    return $.ajax({
      url: baseUrl + `/${id}`,
      type: "DELETE",
    });
  }

  //add item
  //edit item
  //delete item
}

//---------------------------------------------------------------------------------------
//HTML document rendering
class DOMManager {
  static shops; //this is the returned JSON array of object literals from the API

  //calls the ShopService function and then outputs the list of shops to the document
  static getAllShops() {
    ShopService.getAllShops().then((shops) => this.render(shops));
  }

  //add shop function
  static createShop(name) {
    ShopService.createShop(name)
      .then(() => {
        return ShopService.getAllShops();
      })
      .then((shops) => this.render(shops));
  }
  //edit shop function

  //delete shop function
  static deleteShop(id) {
    ShopService.deleteShop(id)
      .then(() => {
        return ShopService.getAllShops();
      })
      .then((shops) => this.render(shops));
  }

  //add item
  //edit item

  //delete item

  //-------------------------------------------------------------------------------------------------------------------------
  //Document rendering

  //shops is the returned JSON array of object literals from the API
  //render the shops data returned from the API call and clear out the entry form
  static render(shops) {
    this.shops = shops;
    let form = $("#shopform");
    form.empty();

    //adds button at top of form to add shop

    let addShopBtn = $(
      "<button class='btn btn-sm btn-dark mb-2' id='add-shop-btn'>Add Shop</button>"
    );

    //AddShop row - adds input field for adding shop when button is clicked
    let newShopRow = $(
      `<div class='form-row' id='add-shop-row'>
<div class='col-8'>
<input type='text' id='new-shop-name' class='form-control' placeholder='Shop Name' />
</div>
<div class='col-4'>
<button class='btn btn-sm btn-dark' id='final-add-shop-btn'>Add</button>
<button class='btn btn-sm btn-warning' id='add-shop-cancel'>Cancel</button>
</div></div>`
    ).hide();

    //click event handler for Add Shop button - hides button, displays shop add input row
    addShopBtn.on("click", function (e) {
      $(this).hide();
      newShopRow.show();
      e.preventDefault();
    });

    form.append(addShopBtn);
    form.append(newShopRow);
    $("#add-item-cancel").on("click", function (e) {
      $("#new-item-name").val("");
      newItemRow.hide();
      addItemBtn.show();
      e.preventDefault();
    });

    $("#final-add-shop-btn").on("click", function (e) {
      let name = $("#new-shop-name").val();
      if (!!name) {
        DOMManager.createShop(name);
      }
      e.preventDefault();
    });

    //nested FOR loops get indices of shops and items
    //loop for shop div display, includes delete and add item buttons; shopIdx = indices of shops from the array
    for (let shopIdx in this.shops) {
      let shop = this.shops[shopIdx];
      //if there are problems with display, check shopName/name discrepancy
      //need to add functionality for add item button, to add items to shop
      let shopDiv = $(`<di class='row shop-div' idx='${shopIdx}'>
        <label class='col col-form-label'>Shop Name: ${shop.name}</label>
        <div class='col'>
        <button class="btn btn-sm btn-dark" id='add-item'>Add Item</button>
        <button class="btn btn-sm btn-info" id='edit-shop-${shop._id}'>Edit Shop</button>
          <button class="btn  btn-sm btn-warning" id='delete-shop-${shop._id}'>Delete Shop</button>
          
        </div>
      </div>`);
      form.append(shopDiv);

      //loop for item div display, including edit & delete buttons; itemIdx = indices of items, added to div class

      for (let itemIdx in shop.items) {
        let item = shop.items[itemIdx];
        let itemDiv = $(`<div class="row item-div" idx='${itemIdx}'>
      <div class='col-1'>
      </div>
      <label class='col-7 col-form-label'>Item Name: ${item.itemName} (${item.itemNum})<br/>
      Item Type: ${item.type}<br/>
      Item Status: ${item.status}<br/>
      Item Price: ${item.price}<br/>      
      </label>
      <div class='col-4 text-right'>
      <button class='btn btn-sm btn-info' id='edit-item-${item._id}'>Edit Item</button>
        <button class='btn btn-sm btn-warning' id='delete-item-${item._id}'>Delete Item</button>
      </div>
    </div>`);

        form.append(itemDiv);
      } //end of item display FOR loop

      //editing items - onclick for button - getting indexes of shop and item to be edited
      form.find("button[id*='edit-item]").on("click", (e) => {
        e.preventDefault();
        let itemDiv = $(e.target);
        while (!itemDiv.hasClass("item-div")) {
          itemDiv = itemDiv.parent();
        }
        let itemIdx = Number.parseInt(itemDiv.attr("idx"));
        let shopDiv = itemDiv;
        while (!shopDiv.hasClass("shop-div")) {
          shopDiv = shopDiv.prev();
        }
        let shopIdx = Number.parseInt(shopDiv.attr("idx"));
        let shopId = shopDiv
          .find("button[id*='delete-shop']")
          .attr("id")
          .split("-")[2];
        console.log(shopId + " " + shopIdx + " " + itemIdx);

        let newItemRow = $(
          `<div class='form-row' id='add-item-row'>
    <div class='col-8'>
    <input type='text' id='new-item-name' class='form-control' placeholder='Item Name' /><br/>
    <input type='text' id='new-item-num' class='form-control' placeholder='Item Number' /><br/>
    <input type='text' id='new-item-type' class='form-control' placeholder='Item Type' /><br/>
    <input type='text' id='new-item-status' class='form-control' placeholder='Item Status' /><br/>
    <input type='text' id='new-item-price' class='form-control' placeholder='Item Price' />
    </div>
    <div class='col-2 text-center'>
    <button class='btn btn-info' id='final-add-item-btn'>Change</button>
    </div>
    <div class='col-2'>
    <button class='btn btn-warning' id='add-item-cancel'>Cancel</button>
    </div></div>`
        ).hide();
        newItemRow
          .find(".new-item-name")
          .empty()
          .append("<input type='text' class='form-control'>");
        newItemRow.find("input").val(this.shops[shopIdx].items[itemIdx]);
        newItemRow
          .find(".new-item-num")
          .empty()
          .append("<input type='text' class='form-control'>");
        newItemRow.find("input").val(this.shops[shopIdx].items[itemIdx]);
        newItemRow
          .find(".new-item-type")
          .empty()
          .append("<input type='text' class='form-control'>");
        newItemRow.find("input").val(this.shops[shopIdx].items[itemIdx]);
        newItemRow
          .find(".new-item-status")
          .empty()
          .append("<input type='text' class='form-control'>");
        newItemRow.find("input").val(this.shops[shopIdx].items[itemIdx]);
        newItemRow
          .find(".new-item-price")
          .empty()
          .append("<input type='text' class='form-control'>");
        newItemRow.find("input").val(this.shops[shopIdx].items[itemIdx]);

        newItemRow.find(".cancel-changes button").on("click", (e) => {
          e.preventDefault();
          newItemRow.remove();
          itemDiv.show();
        });
      });
    } // end of shop display FOR loop

    //--------------------------------------------------------------

    //delete shop button onclick
    form.find("button[id*='delete-shop']").on("click", (e) => {
      let id = e.target.id.split("-")[2];
      DOMManager.deleteShop(id);
      e.preventDefault();
    });

    //edit item button onclick
  } // end of static render
} //end of DOM Manager

//----------------------------------------------------------------------------------------------
//gets shop data on page load
$(() => {
  DOMManager.getAllShops();
});
