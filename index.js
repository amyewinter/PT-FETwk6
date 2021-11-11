/*  Final coding project, week 6, Front End Technologies
Build a create-read-update-delete application using a remote API https://crudcrud.com/

This is a prototype of an item tracking system for a small-scale online store similar to Etsy etc.  The business model is  a shop run by my friend, Desert Oddities; she purchases southwestern-style jewelry and other items at thrift stores, refurbishes them, and sells them online.

https://www.etsy.com/shop/DesertOddities

Possible objects are shop, owner, customer, and item.

This prototype will track shops and items.

A shop will have at least one owner and multiple items (arrays).  It will have only one property, shopName.

Owners will have only one property as well, ownerName.

Customers are ignored for now.

Items will have properties itemName, itemNum, type, status, and price.

*/

class Shop {
  constructor(shopName) {
    this.shopName = shopName;
    this.items = [];
    this.owners = [];
  }

  addItem(itemName, itemNum, type, status, price) {
    this.items.push(new Item(itemName, itemNum, type, status, price));
  }

  addOwner(ownerName) {
    this.owners.push(new Owner(ownerName));
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
  static url = "";

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
