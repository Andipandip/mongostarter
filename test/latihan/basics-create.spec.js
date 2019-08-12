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
      name: 'Rambo 3',
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
    expect({ name, year }).toEqual({ name: 'Rambo 3', year: 2018 });

    //Duplikat Id

    try {
      await videos.insertOne({
        _id: insertOneVideo.insertedId,
        name: 'Rambo 4',
        year: '2018'
      });
    } catch (e) {
      expect(e).not.toBeUndefined();
      expect(e.errmsg).toContain('E11000 duplicate key error collection');
      console.log(e.errmsg);
    }
  });
});
