// server/models/Gallery.js

export async function getAllGalleryItems(db) {
  return db.collection("gallery").find().toArray();
}

export async function createGalleryItem(db, item) {
  return db.collection("gallery").insertOne({
    ...item,
    createdAt: new Date()
  });
}

export async function deleteGalleryItemByPhotoUrl(db, photoUrl) {
  return db.collection("gallery").deleteOne({ photoUrl });
}
