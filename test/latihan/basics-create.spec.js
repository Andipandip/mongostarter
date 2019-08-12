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
  it('insertMany() method', async () => {
    let megaManYears = [
      1987,
      1988,
      1990,
      1991,
      1992,
      1993,
      1995,
      1996,
      2008,
      2010
    ];
    let docs = megaManYears.map((year, idx) => {
      return {
        name: `Rambo ${idx + 1}`,
        year
      };
    });
    let insertResult = await videos.insertMany(docs);

    expect(insertResult.insertedCount).toBe(10);

    expect(Object.values(insertResult.insertedIds).length).toBe(10);
    // cek
    console.log(Object.values(insertResult.insertedIds));
  });

  it('Method updateOne() with upsert', async () => {
    let upsertResult = await videos.updateOne(
      {
        name: 'Rambo 8u'
      },
      {
        $set: {
          name: 'Call Rambo',
          year: '2018'
        }
      },
      { upsert: true }
    );

    expect(upsertResult.result.nModified).toBe(0);
    console.log('One Upsert', upsertResult.result);

    upsertResult = await videos.updateOne(
      { name: 'Rambo 8' },
      // we'll update the year to 2018
      {
        $set: {
          name: 'Call of Duty',
          year: 2018
        }
      },
      { upsert: true }
    );
    // we can see the second upsert result does not have an upserted key
    console.log('second upsert result', upsertResult.result);
    expect(upsertResult.result.nModified).toBe(1);
  });
});
