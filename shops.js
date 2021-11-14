/*  Final coding project, week 6, Front End Technologies
by Amy Winter, November 13, 2021

Build a create-read-update-delete application using a remote API https://crudcrud.com/

I was not assigned a coding partner by Ken; this project is all my own work using the class and lesson videos as examples.

This is a prototype of an item tracking system for a small-scale online store similar to Etsy etc.  A shop will have an array for items, and a name.  

Items will have properties itemName, itemNum, type, status, and price.

NOTES

//editing items
//items do not have IDs, only shops have IDs
//index of item in shop array is going to be itemnum -1 !!!

*/
//-------------------------------------------------------------------------------------------
//Entities

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

//-------------------------------------------------------------------------------------------
//Service - a set of static methods to make calls to the API

class shopService {
  //API endpoint - valid until 12/11/2021
  static url =
    "https://crudcrud.com/api/f770c19eee1c4acfa40526be802779f5/shops";

  static getAllShops() {
    return $.get(this.url);
  }
}

//---------------------------------------------------------------------------------------
//HTML document rendering
class DOMManager {
  static shops; //this is the returned JSON array of object literals from the API

  static getAllShops() {
    shopService.getAllShops().then((shops) => this.render(shops));
  }

  static render(shops) {
    this.shops = shops;
    $("#addshopform").hide;
    $("#additemform").hide;
    let form = $("#shopform");
    form.empty();

    //-------------ADD SHOP FUNCTIONALITY-------------------------

    //adds Add Shop button to top of form
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

    //-------------FOR LOOPS TO DISPLAY SHOPS AND ITEMS ON PAGE LOAD ---------------------

    //nested FOR loops get indices of shops and items
    //loop for shop div display, includes delete and add item buttons; shopIdx = indices of shops from the array

    for (let shopIdx in this.shops) {
      let shop = this.shops[shopIdx];

      let shopDiv = $(`<div class='row shop-div' idx='${shopIdx}'>
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
    } //end shop loop
  } //end HTML renderer
} //end DOMManager

//----------------------------------------------------------------------------------------------
//gets shop data on page load
$(() => {
  DOMManager.getAllShops();
});
