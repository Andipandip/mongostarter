import { ObjectID } from 'mongodb';
describe('Basic Create', async () => {
  let videos; // collection initialized

  // Construct colletion videos
  beforeAll(async () => {
    videos = await global.mongoClient
      .db(process.env.DB_NAME)
      .collection('videos');
  });
  // Delete collection videos
  afterAll(async () => {
    await videos.drop();
  });
  it('insertOne() method', async () => {
    const insertOneVideo = await videos.insertOne({
      name: 'Mantap Cooy',
      year: 2018
    });
    const { n, ok } = insertOneVideo.result;

    expect({ n, ok }).toEqual({ n: 1, ok: 1 });

    expect(insertOneVideo.insertedCount).toBe(1);

    expect(insertOneVideo.insertedId).not.toBe(undefined);

    console.log(insertOneVideo.insertedId);

    let { name, year } = await videos.findOne({
      _id: ObjectID(insertOneVideo.insertedId)
    });
    expect({ name, year }).toEqual({ name: 'Mantap Cooy', year: 2018 });

    //Duplikat Id
  });
});
