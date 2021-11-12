/*  Final coding project, week 6, Front End Technologies
by Amy Winter, November 13, 2021

Build a create-read-update-delete application using a remote API https://crudcrud.com/

I was not assigned a coding partner by Ken; this project is all my own work using the class and lesson videos as examples.

This is a prototype of an item tracking system for a small-scale online store similar to Etsy etc.  The business model is a shop called , Desert Oddities; the owner purchases vintage southwestern-related items at local thrift stores, refurbishes them, and sells them online.

https://www.etsy.com/shop/DesertOddities

Possible objects are shop, owner, customer, and item.

This prototype will track shops and items.

A shop will have multiple items (arrays).  It will have only one property, shopName.

Items will have properties itemName, itemNum, type, status, and price.

*/
//API endpoint - valid until 12/11/2021
const baseUrl =
  "https://crudcrud.com/api/f770c19eee1c4acfa40526be802779f5/shops";

//function to POST data
function makePost(url, string) {
  return $.ajax({
    url: url,
    type: "POST",
    datatype: "json",
    data: JSON.stringify(string),
    contentType: "application/json",
  });
}

//function to PUT data
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
    return $.get(baseUrl);
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
      url: baseUrl + `/${id}`,
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
    ShopService.createShop(shopName)
      .then(() => {
        return ShopService.getAllShops();
      })
      .then((shops) => this.render(shops));
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

    //shop div display, including delete button
    for (let shopIdx in this.shops) {
      let shop = this.shops[shopIdx];
      let shopDiv = $(`<div class='row shop-div' idx='${shopIdx}'>
      <label class='col-8 col-form-label'>Shop Name: ${shop.shopName}</label>
      <div class='col-4 text-center'>
        <button class="btn btn-danger" id='delete-shop-${shop._id}'>Delete</button>
      </div>
    </div>`);
      form.append(shopDiv);

      //item div display, including delete button

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

    //Delete Item button click event - finding buttons that contain the string delete-item; these buttons contain the item IDs from the API
    form.find("button[id*='delete-item']").on("click", (e) => {
      let id = e.target.id.split("-")[2];
      DOMManager.deleteItem(id);
      e.preventDefault();
    });

    //Add Item button - provides for adding a new button
    let addItemBtn = $(
      "<button class='btn btn-primary' id='add-item-btn'>Add Item</button>"
    );

    //AddItem row - provides space to enter item info; need to add additional fields for all properties
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
<button class='btn btn-success' id='final-add-item-btn'>Add</button>
</div>
<div class='col-2'>
<button class='btn btn-warning' id='add-item-cancel'>Cancel</button>
</div></div>`
    ).hide();

    //click event handler for Add Item button
    addItemBtn.on("click", function (e) {
      $(this).hide();
      newItemRow.show();
      e.preventDefault();
    });
    form.append(addItemBtn);
    form.append(newItemRow);
    $("#add-item-cancel").on("click", function (e) {
      $("#new-item-name").val("");
      newItemRow.hide();
      addItemBtn.show();
      e.preventDefault();
    });
    $("final-add-item-btn").on("click", function (e) {
      //gonna have problems with these variables I think; have to match them up to item properties see line 134
      let name = $("#new-item-name").val();
      let num = $("#new-item-num").val();
      let itemType = $("#new-item-type").val();
      let status = $("#new-item-status").val();
      let price = $("#new-item-price").val();
      if (!!name) {
        DOMManager.createItem(name);
      }
      e.preventDefault;
    });

    //edit item
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
      let shopIdx = Number.parseInt(ownerDiv.attr("idx"));
      let shopId = shopDiv
        .find("button[id*='delete-shop']")
        .attr("id")
        .split("-")[2];
      console.log(shopId + " " + shopIdx + " " + itemIdx);

      let newItemRow = $(
        <div class="row item-div" idx="${itemIdx}">
          <div class="col-2"></div>
          <label class="col-form-label itemname">Item Name: </label>
          <label class="col-form-label itemnum">Item Number: </label>
          <label class="col-form-label itemtype">Item Type: </label>
          <label class="col-form-label itemstatus">Item Status: </label>
          <label class="col-form-label itemprice">Item Price: </label>
        </div>
      );
    });
  }
}

$(() => {
  DOMManager.getAllShops();
});
