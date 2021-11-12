d; /*  Final coding project, week 6, Front End Technologies
by Amy Winter, November 13, 2021

Build a create-read-update-delete application using a remote API https://crudcrud.com/

I was not assigned a coding partner by Ken; this project is all my own work.

This is a prototype of an item tracking system for a small-scale online store similar to Etsy etc.  The business model is a shop run by my friend, Desert Oddities; she purchases vintage southwestern-related items at thrift stores, refurbishes them, and sells them online.

https://www.etsy.com/shop/DesertOddities

Possible objects are shop, owner, customer, and item.

This prototype will track shops and items.

A shop will have multiple items (arrays).  It will have only one property, shopName.

Items will have properties itemName, itemNum, type, status, and price.

*/

const baseUrl =
  "https://crudcrud.com/api/f770c19eee1c4acfa40526be802779f5/shops";

function makePost(url, string) {
  return $.ajax({
    url: url,
    type: "POST",
    datatype: "json",
    data: JSON.stringify(string),
    contentType: "application/json",
  });
}

function makePut(url, string) {
  return $.ajax({
    url: url,
    type: "PUT",
    //dataType: "json", //not used with this API
    data: JSON.stringify(string),
    contentType: "application/json",
  });
}

/*
//
function firstShop() {
  let shop01 = new Shop("Desert Oddities");
  let ring = new Item("Vintage Pueblo Ring", 01, "ring", "active", 125);
  shop01.items.push(ring);
  makePost(baseUrl, shop01).then((resp) => console.log(resp));
} */

class Shop {
  constructor(shopName) {
    this.shopName = shopName;
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

class ShopService {
  //static url = baseUrl;

  static getAllShops() {
    return $.get(baseURL);
  }

  static getShop(id) {
    return $.get(this.url + `/${id}`);
  }

  static createShop(shopName) {
    return $.post(this.url, shopName);
  }

  static updateShop(shopName) {
    return $.ajax({
      url: this.url + `/${shopName._id}`,
      dataType: "json",
      data: JSON.stringify(shopName),
      contentType: "application/json",
      type: "PUT",
    });
  }

  static deleteShop(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }
}

class DOMManager {
  static shops;

  static getAllShops() {
    ShopService.getAllShops().then((shops) => this.render(shops));
  }

  static createShop(shopName) {
    ShopService.createShop(new Shop(shopName))
      .then(() => {
        return ShopService.getAllShops();
      })
      .then((shops) => this.render(houses));
  }

  static deleteShop(id) {
    ShopService.deleteShop(id)
      .then(() => {
        return ShopService.getAllShops();
      })
      .then((shops) => this.render(shops));
  }

  static addItem() {
    for (let shop of this.shops) {
      if (shop._id == id) {
        shop.items.push(
          new Item(
            $(`#${item._id}-itemName`).val(),
            $(`#${item._id}-itemNum`).val(),
            $(`#${item._id}-type`).val(),
            $(`#${item._id}-status`).val(),
            $(`#${item._id}-price`).val()
          )
        );
        ShopService.updateShop(shop)
          .then(() => {
            return ShopService.getAllShops();
          })
          .then((shops) => this.render(shops));
      }
    }
  }

  static deleteItem(shopName, itemNum) {
    for (let shop of this.shops) {
      if (shopName == shopName) {
        for (let item of shopName.items) {
          if (itemNum == itemNum) {
            shopName.items.splice(shopName.items.indexOf(itemNum), 1);
            ShopService.updateShop(shopName)
              .then(() => {
                return ShopService.getAllShops();
              })
              .then((shops) => this.render(shops));
          }
        }
      }
    }
  }

  //render the shops data returned from the API call
  static render(shops) {
    this.shops = shops;
    let form = $("shopform");
    form.empty();

    for (let shopIdx in this.shops) {
      let shop = this.shops[shopIdx];
      let shopDiv = $(`<div class='row shop-div' idx='${shopIdx}'>
      <label class='col-8 col-form-label'>Shop Name: ${shop.shopName}</label>
      <div class='col-4 text-center'>
        <button class="btn btn-danger" id='delete-shop-${shop._id}'>Delete</button>
      </div>
    </div>`);
      form.append(shopDiv);

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
      }
    }

    //Delete Item - finding buttons that contain the string delete-item; these buttons contain the item IDs from the API
    form.find("button[id*='delete-item']").on("click", (e) => {
      let id = e.target.id.split("-")[2];
      DOMManager.deleteItem(id);
      e.preventDefault();
    });

    //GOTO 47:28:00 in class video

    //Add Item
    let addItemBtn = $(
      "<button class='btn btn-primary' id='add-item-btn'>Add Item</button>"
    );
    let newItemRow = $(
      <div class="form-row" id="add-item-row">
        STUFF HERE
      </div>
    ).hide();
    addItemBtn.on("click", function (e) {});
    $("shopform").append(addItemBtn);
    $("shopform").append(newItemRow);
    $("#add-item-cancel").on("click", function (e) {});
    $("final-add-item-btn").on("click", function (e) {});
  }
}

$(() => {
  DOMManager.getAllShops();
});

/*
  //see line 109 in codealong
  static render(shops) {
    this.shops = shops;
  }*/
