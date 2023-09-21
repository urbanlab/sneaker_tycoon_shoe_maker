/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2fa6vj7ga0bm8lc")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r3ly1bkh",
    "name": "image",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2fa6vj7ga0bm8lc")

  // remove
  collection.schema.removeField("r3ly1bkh")

  return dao.saveCollection(collection)
})
