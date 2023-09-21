/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "2fa6vj7ga0bm8lc",
    "created": "2023-09-21 13:44:44.887Z",
    "updated": "2023-09-21 13:44:44.887Z",
    "name": "form",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "dfz7puit",
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
  const collection = dao.findCollectionByNameOrId("2fa6vj7ga0bm8lc");

  return dao.deleteCollection(collection);
})
