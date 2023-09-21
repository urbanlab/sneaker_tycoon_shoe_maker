/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yc6m300o97t4q5r")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uqa1w5ku",
    "name": "form",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "2fa6vj7ga0bm8lc",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yc6m300o97t4q5r")

  // remove
  collection.schema.removeField("uqa1w5ku")

  return dao.saveCollection(collection)
})
