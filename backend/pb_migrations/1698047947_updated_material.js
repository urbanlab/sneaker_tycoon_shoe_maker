/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q4cv85iz97byhan")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jcxkehke",
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
  const collection = dao.findCollectionByNameOrId("q4cv85iz97byhan")

  // remove
  collection.schema.removeField("jcxkehke")

  return dao.saveCollection(collection)
})
