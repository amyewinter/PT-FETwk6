/*Final coding project, week 6, Front End Technologies
VERSION 4
by Amy Winter, December 2, 2021

Build a create-read-update-delete application using a remote API https://crudcrud.com/

I was not assigned a coding partner by Ken; this project is all my own work using the class and lesson videos as examples.

This is a prototype of an item tracking system for a small-scale online store similar to Etsy etc.  A shop will have an array for items, and a name.  

Items will have properties of name and price.

To-do list:
X Display all shops
X Display all items
X Add shop
Edit shop
X Delete shop
Add item - stuck on this see line 126
Edit item
Delete item

Nice to have:
Edit shops and items (change properties)
Make add/edit forms show/hide based on button click
Additional properties for item:  item number, item status (active, sold, etc), item type

*/

//Entities  -----------------------------------
class Shop {
  constructor(shop) {
    this.name = shop;
    this.items = [];
  }

  addItem(itemName, price) {
    this.items.push(new Item(itemName, price));
  }
}

class Item {
  constructor(name, price) {
    this.itemName = name;
    this.price = price;
  }
}

//Service -------------------------------------------
//a set of static methods to make calls to the API

class ShopService {
  //API endpoint - valid until 1/10/2022
  static url =
    "https://crudcrud.com/api/f770c19eee1c4acfa40526be802779f5/shops";

  //get all shops
  static getAllShops() {
    return $.get(this.url);
  }

  //get a specific shop by ID
  static getShop(id) {
    return $.get(this.url + `/${id}`);
  }

  //add shop
  static createShop(shop) {
    console.log("creating shop " + shop);
    return $.ajax({
      url: this.url,
      dataType: "json",
      data: JSON.stringify(shop),
      contentType: "application/json",
      type: "POST",
    });
  }

  //update shop
  static updateShop(id) {
    return $.ajax({
      url: this.url + id,
      dataType: "json", //not used with PUT requests with this API per Ken?
      data: JSON.stringify({
        shop: id.name,
        items: id.items,
      }),
      contentType: "application/json",
      type: "PUT",
    });
  }

  //delete shop
  static deleteShop(id) {
    return $.ajax({
      url: `${this.url}/${id}`,
      type: "DELETE",
    });
  }
} //end Service

//HTML document rendering ------------------
class DOMManager {
  //this is the returned JSON array of object literals from the API
  static shops;

  //calls the ShopService function and then outputs the list of shops to the document
  static getAllShops() {
    console.log("from getAllShops");
    ShopService.getAllShops().then((shops) => this.render(shops));
  }

  //add shop function
  static createShop(shop) {
    console.log("from createShop adding " + shop);
    ShopService.createShop(new Shop(shop))
      .then(() => {
        return ShopService.getAllShops();
      })
      .then((shops) => this.render(shops));
    console.log("shop created:" + shop);
  }

  //add item
  //for some reason this.shops is an empty array; it is not finding a match for ID so it can't add item
  static addItem(id) {
    console.log("Starting addItem function");
    console.log("ID = " + id);

    for (let shop of this.shops) {
      if (shop._id == id) {
        console.log($(`#${shop._id}-new-item-name`).val());
        console.log($(`#${shop._id}-new-item-price`).val());
        shop.items.push(
          new Item(
            $(`#${shop._id}-new-item-name`).val(),
            $(`#${shop._id}-new-item-price`).val()
          )
        );
        ShopService.updateShop(id)
          .then(() => {
            return ShopService.getAllShops();
          })
          .then((shops) => this.render(shops));
        console.log("finished adding item");
      }
    }
  }

  //delete item
  static deleteItem(shopId, name) {
    for (let shop of this.shops) {
      if (shop._id == shopId) {
        for (let i = 0; i < shop.items; i++) {
          const item = shops.items[i];
          if (item.name == name) {
            shop.items.splice(i, 1);
            ShopService.updateShop(shop)
              .then(() => {
                return ShopService.getAllShops();
              })
              .then((shops) => this.render(shops));
          }
        }
      }
    }
  }

  //delete shop
  static deleteShop(id) {
    ShopService.deleteShop(id)
      .then(() => {
        return ShopService.getAllShops();
      })
      .then((shops) => this.render(shops));
  }

  //Document rendering --------------------------

  //shops is the returned JSON array of object literals from the API
  //render the shops data returned from the API call and clear out the entry form

  static render(shops) {
    this.shops = shops;
    let dataDiv = $("#data-div");
    let addForm = $("#formcontainer"); //add this later to show/hide the addShop form
    dataDiv.empty();
    addForm.empty();

    //form to add a new shop
    addForm.prepend(`<form id="shopform">
    <div class='form-row' id='add-shop-row'>
      <div class='col-8'>
        <h5>Add A Shop</h5>
      <input type='text' id='new-shop-name' class='form-control' placeholder='Shop Name' />
      </div>
      <div class='col-4'>
      <button class='btn btn-sm btn-dark' id='final-add-shop-btn'>Add</button>
      <button class='btn btn-sm btn-warning' id='add-shop-cancel'>Cancel</button></div></div>
    </form>`);

    //onclick for add Shop button in index.html
    $("#final-add-shop-btn").on("click", function (e) {
      let name = $("#new-shop-name").val();
      console.log(name);
      if (!!name) {
        DOMManager.createShop(name);
      }
      e.preventDefault();
    });

    //onclick for cancel button on addShop form
    $("#add-shop-cancel").on("click", function (e) {
      $("#new-shop-name").val("");
      e.preventDefault();
    });

    //display of shops and items
    for (let shop of shops) {
      dataDiv.prepend(`<div class='row shop-div' id='${shop._id}'>
        <label class='col col-form-label'><h3>${shop.name}</h3></label>
        <div class='col'>
        <button class="btn btn-sm btn-info" id='edit-shop-${shop._id}'>Edit Shop</button>
          <button class="btn  btn-sm btn-warning" id='delete-shop-${shop._id}' onclick="DOMManager.deleteShop('${shop._id}')">Delete Shop</button>
        </div>
        <form id="itemform">
        <div class='form-row' id='add-item-row'>
        <h6>Add An Item</h6>
    <div class='col-sm-4'>
    <input type='text' id='${shop._id}-new-item-name' class='form-control' placeholder='Item Name' />   <input type='text' id='${shop._id}-new-item-price' class='form-control' placeholder='Item Price' />
    </div>
    <button class='btn btn-dark btn-sm' id='${shop._id}-add-item-btn' onclick="DOMManager.addItem('${shop._id}')">Add Item</button>
    <button class='btn btn-warning btn-sm' id='add-item-cancel'>Cancel</button>
    </div></div>
      </div>`);

      for (let itemIdx in shop.items) {
        let item = shop.items[itemIdx];
        let itemDiv =
          $(`<h6>Shop Inventory</h6><div class="row item-div" idx='${itemIdx}'>
      <div class='col-1'>
      </div>
      <label class='col-7 col-form-label'>Name: ${item.itemName}<br/>
      Price: ${item.price}<br/>      
      </label>
      <div class='col-4 text-right'>
        <button class='btn btn-sm btn-warning' id='delete-item-${item._id}'>Delete Item</button>
      </div>
    </div>`);
        dataDiv.append(itemDiv);
      } //end of item display FOR loop
    }
  }
}

//gets shop data on page load

DOMManager.getAllShops();
