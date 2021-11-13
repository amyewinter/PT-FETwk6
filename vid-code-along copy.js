class Shop {
  constructor(name) {
    this.name = name;
    this.items = [];
  }

  additem(name, area) {
    this.items.push(new Item(name, num, type, status, price));
  }
}

class Item {
  constructor(name, num, type, status, price) {
    this.name = name;
    this.num = num;
    this.type = type;
    this.status = status;
    this.price = price;
  }
}

class shopService {
  //API endpoint - valid until 12/11/2021
  static url =
    "https://crudcrud.com/api/f770c19eee1c4acfa40526be802779f5/shops";

  static getAllShops() {
    return $.get(this.url);
  }

  static getShop(id) {
    return $.get(this.url + `/${id}`);
  }

  static createShop(shop) {
    return $.post(this.url, shop);
  }

  static updateShop(shop) {
    return $.ajax({
      url: this.url + `/${shop._id}`,
      // dataType: "json",
      data: JSON.stringify(shop),
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
    shopService.getAllShops().then((shops) => this.render(shops));
  }

  static createShop(name) {
    shopService
      .createShop(new Shop(name))
      .then(() => {
        return shopService.getAllShops();
      })
      .then((shops) => this.render(shops));
  }

  static deleteShop(id) {
    shopService
      .deleteShop(id)
      .then(() => {
        return shopService.getAllShops();
      })
      .then((shops) => this.render(shops));
  }

  static addItem(id) {
    for (let shop of this.shops) {
      if (shop._id == id) {
        shop.items.push(
          new item(
            $(`#${shop._id}-item-name`).val(),
            $(`#${shop._id}-item-num`).val(),
            $(`#${shop._id}-item-type`).val(),
            $(`#${shop._id}-item-status`).val(),
            $(`#${shop._id}-item-price`).val()
          )
        );
        shopService
          .updateShop(shop)
          .then(() => {
            return shopService.getAllShops();
          })
          .then((shops) => this.render(shops));
      }
    }
  }

  static deleteItem(shopId, itemId) {
    for (let shop of this.shops) {
      if (shop._id == shopId) {
        for (let item of shop.items) {
          if (item._id == itemId) {
            shop.items.splice(shop.items.indexOf(item), 1);
            shopService
              .updateShop(shop)
              .then(() => {
                return shopService.getAllShops();
              })
              .then((shops) => this.render(shops));
          }
        }
      }
    }
  }
  static render(shops) {
    this.shops = shops;
    $("#app").empty();
    for (let shop of shops) {
      $("#app").prepend(
        `<div id="${shop._id}" class="card">
                <div class="card-header">
                <h2>${shop.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deleteshop('${shop._id}')">Delete</button>
                </div>
<div class="card-body">
<div class="card">
<div class="row">
<div class="col-sm">
<input type="text" id="${shop._id}-item-name" class="form-control" placeholder="item Name"/>
</div>
<div class="col-sm">
<input type="text" id="${shop._id}-item-area" class="form-control" placeholder="item Area"/>
</div>
</div>
<button id="${shop._id}-new.item" onclick="DOMManager.additem('${shop._id}')" class="btn btn-primary form-control">Add</button>
</div></div>
</div><br/>`
      );

      for (let item of shop.items) {
        $(`#${shop._id}`)
          .find(".card-body")
          .append(
            `<p><span id="name-${item._id}"><strong>Name: </strong> ${item.name}</span>
              <span id="area-${item._id}"><strong>Area: </strong> ${item.area}</span>
              <button class="btn btn-danger" onclick="DOMManager.deleteitem('${shop._id}', '${item._id}')">Delete item</button>`
          );
      }
    }
  }
}

$("#create-new-shop").click(() => {
  DOMManager.createshop($("#new-shop-name").val());
  $("#new-shop-name").val("");
});

DOMManager.getAllshops();
