/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yc6m300o97t4q5r")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eya1wojx",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "pending",
        "started",
        "finished"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yc6m300o97t4q5r")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eya1wojx",
    "name": "index3groupdefaultstatus",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "pending",
        "started",
        "finished"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
