/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zumh95amc1rwd5z")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "z8sikymy",
    "name": "machine_name",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zumh95amc1rwd5z")

  // remove
  collection.schema.removeField("z8sikymy")

  return dao.saveCollection(collection)
})
