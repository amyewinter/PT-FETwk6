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
