/*  Final coding project, week 6, Front End Technologies
by Amy Winter, November 13, 2021

Build a create-read-update-delete application using a remote API https://crudcrud.com/

I was not assigned a coding partner by Ken; this project is all my own work using the class and lesson videos as examples.

This is a prototype of an item tracking system for a small-scale online store similar to Etsy etc.  The business model is a shop called , Desert Oddities; the owner purchases vintage southwestern-related items at local thrift stores, refurbishes them, and sells them online.

https://www.etsy.com/shop/DesertOddities

This prototype will track shops and items.

A shop will have multiple items (arrays).  It will have only one property, shopName.

Items will have properties itemName, itemNum, type, status, and price.

*/

//To Do list
//Sat - start at 48:29 of class video in Slack
//fix paths to node modules in index.html before final commit
//need to add code for add item button, to add items to shop - see line 133
//need click handler for deleting items even though button exists?

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

/*
//creating some data
function makeData() {
  let shop = new Shop("Winter Knits");
  let scarf = new Item("Boucle Scarf", 01, "scarf", "active", 25);
  shop.items.push(scarf);
  makePost(baseUrl, shop).then((resp) => console.log(resp));
} */

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

//Service - a set of static methods to make calls to the API functions defined above;
//no constructor needed as we are not creating these objects
//DOM Manager layer calls ShopService functions which call the API functions on lines 27-70

class ShopService {
  static getAllShops() {
    return $.get(baseUrl);
  }
}

//HTML document rendering
class DOMManager {
  static shops; //this is the returned JSON array of object literals from the API

  static getAllShops() {
    ShopService.getAllShops().then((shops) => this.render(shops));
  }

  //create shop
  //edit shop

  //delete shop
  static deleteShop(id) {
    ShopService.deleteShop(id)
      .then(() => {
        return ShopService.getAllShops();
      })
      .then((shops) => this.render(shops));
  }

  //create item
  //edit item
  //delete item

  //shops is the returned JSON array of object literals from the API
  //render the shops data returned from the API call
  static render(shops) {
    this.shops = shops;
    let form = $("#shopform");
    form.empty();

    //nested FOR loops get indices of shops and items
    //shop div display, including delete button; shopIdx = indices of shops from the array
    for (let shopIdx in this.shops) {
      let shop = this.shops[shopIdx];
      //if there are problems with display, check shopName/name discrepancy
      //need to add code for add item button, to add items to shop
      let shopDiv = $(`<div class='row shop-div' idx='${shopIdx}'>
        <label class='col-8 col-form-label'>Shop Name: ${shop.name}</label> 
        <div class='col-4 text-center'>
          <button class="btn btn-danger" id='delete-shop-${shop._id}'>Delete</button>
          <button class="btn btn-primary" id='add-item'>Add Item</button>
        </div>
      </div>`);
      form.append(shopDiv);

      //item div display, including delete button; itemIdx = indices of items, added to div class

      for (let itemIdx in shop.items) {
        let item = shop.items[itemIdx];
        let itemDiv = $(`<div class="row item-div" idx='${itemIdx}'>
      <div class='col-1'>
      </div>
      <label class='col-7 col-form-label'>Item Name: ${item.itemName}</label>
      <div class='col-4 text-right'>
        <button class='btn btn-danger' id='delete-item-${item._id}'>Delete</button>
      </div>
    </div>`);

        form.append(itemDiv);
      } //end of item FOR loop
    } // end of shop FOR loop

    //edit item button

    //delete shop button
    form.find("button[id*='delete-shop']").on("click", (e) => {
      let id = e.target.id.split("-")[2];
      DOMManager.deleteOwner(id);
      e.preventDefault();
    });

    //add owner button and inputs, hides/shows elements as user interacts with form
  } // end of static render
} //end of DOM Manager

//gets shop data on page load
$(() => {
  DOMManager.getAllShops();
});
