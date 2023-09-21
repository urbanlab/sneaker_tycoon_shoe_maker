/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "zumh95amc1rwd5z",
    "created": "2023-09-21 13:44:14.923Z",
    "updated": "2023-09-21 13:44:14.923Z",
    "name": "colors",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "2pboi72v",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("zumh95amc1rwd5z");

  return dao.deleteCollection(collection);
})
