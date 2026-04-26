export async function getDayByDate(db, date) {
  return db.collection("days").findOne({ date });
}

export async function getAllDays(db) {
  return db.collection("days").find().toArray();
}

export async function addPhotoToDay(db, date, photoUrl) {
  return db.collection("days").updateOne(
    { date },
    { $push: { photos: photoUrl } },
    { upsert: true }
  );
}

export async function setDayMood(db, date, mood) {
  return db.collection("days").updateOne(
    { date },
    { $set: { mood } },
    { upsert: true }
  );
}

export async function deletePhotoFromDay(db, date, photoUrl) {
  return db.collection("days").updateOne(
    { date },
    { $pull: { photos: photoUrl } }
  );
}
