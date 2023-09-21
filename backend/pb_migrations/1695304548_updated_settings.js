/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ripdklxdj3j7yi3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3p2ebgqh",
    "name": "init_prompt",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "urbxaskp",
    "name": "ending_prompt",
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
  const collection = dao.findCollectionByNameOrId("ripdklxdj3j7yi3")

  // remove
  collection.schema.removeField("3p2ebgqh")

  // remove
  collection.schema.removeField("urbxaskp")

  return dao.saveCollection(collection)
})
