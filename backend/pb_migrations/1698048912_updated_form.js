/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2fa6vj7ga0bm8lc")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4qttvjti",
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
  const collection = dao.findCollectionByNameOrId("2fa6vj7ga0bm8lc")

  // remove
  collection.schema.removeField("4qttvjti")

  return dao.saveCollection(collection)
})
