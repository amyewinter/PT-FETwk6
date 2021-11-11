/*  Final coding project, week 6, Front End Technologies
Build a create-read-update-delete application using a remote API https://crudcrud.com/

This is a prototype of an item tracking system for a small-scale online store similar to Etsy etc.  The business model is a shop run by my friend, Desert Oddities; she purchases vintage southwestern-related items at thrift stores, refurbishes them, and sells them online.

https://www.etsy.com/shop/DesertOddities

Possible objects are shop, owner, customer, and item.

This prototype will track shops and items.

A shop will have at least one owner and multiple items (arrays).  It will have only one property, shopName.

Owners will have only one property as well, ownerName.

Customers are ignored for now.

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

function firstShop() {
  let shop01 = new Shop("Desert Oddities");
  let amy = new Owner("Amy Mullins");
  let ring = new Item("Vintage Pueblo Ring", 01, "ring", "active", 125);
  shop01.items.push(ring);
  shop01.owners.push(amy);
  makePost(baseUrl, shop01).then((resp) => console.log(resp));
}

class Shop {
  constructor(shopName) {
    this.shopName = shopName;
    this.items = [];
    this.owners = [];
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

class Owner {
  constructor(ownerName) {
    this.ownerName = ownerName;
  }
}

class ShopService {
  static url = baseUrl;

  static getAllShops() {
    return $.get(this.url);
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

$( () => {
  DOMManager.getAllShops();
});

  //see line 109 in codealong
  static render(shops) {
    this.shops = shops;
  }
}
