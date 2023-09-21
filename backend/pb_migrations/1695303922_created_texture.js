/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "iuls3fwzjybx5rt",
    "created": "2023-09-21 13:45:22.979Z",
    "updated": "2023-09-21 13:45:22.979Z",
    "name": "texture",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bfnfd9nt",
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
  const collection = dao.findCollectionByNameOrId("iuls3fwzjybx5rt");

  return dao.deleteCollection(collection);
})
