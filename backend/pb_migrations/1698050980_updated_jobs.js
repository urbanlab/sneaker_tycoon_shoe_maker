/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yc6m300o97t4q5r")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "walymbfu",
    "name": "json",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yc6m300o97t4q5r")

  // remove
  collection.schema.removeField("walymbfu")

  return dao.saveCollection(collection)
})
