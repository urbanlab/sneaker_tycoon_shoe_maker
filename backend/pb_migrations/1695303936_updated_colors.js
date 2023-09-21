/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zumh95amc1rwd5z")

  collection.name = "color"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zumh95amc1rwd5z")

  collection.name = "colors"

  return dao.saveCollection(collection)
})
