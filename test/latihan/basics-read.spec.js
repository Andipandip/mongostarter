describe('Basic Read', async () => {
  let movies;
  beforeAll(async () => {
    //inject movies
    movies = await global.mongoClient
      .db(process.env.DB_NAME)
      .collection('movies');
  });
  it('finOne()', async () => {
    let filter = 'Barry Prima';
    let result = await movies.findOne({ cast: filter });
    let { title, year, cast } = result;
    // console.log(result);
    expect(title).toBe('Savage Terror');
    expect(year).toBe(1980);
    expect(cast).toContain('Rukman Herman');

    let nullResult = await movies.findOne({ cast: 'Jawir' });
    expect(nullResult).toBeNull();
  });

  it('project', async () => {
    let filter = 'Barry Prima';
    let result = await movies.findOne(
      { cast: filter },
      {
        projection: {
          cast: 1,
          title: 1
        }
      }
    );
    expect(result).not.toBeNull();
    const keyObj = Object.keys(result);
    expect(keyObj.length).toBe(3);
    let result2 = await movies.findOne(
      { cast: filter },
      {
        projection: {
          cast: 1,
          title: 1,
          _id: 0
        }
      }
    );
    expect(result2).not.toBeNull();
    const keyObjNew = Object.keys(result2);
    expect(keyObjNew.length).toBe(2);
    console.log(result);
  });

  it('all', async () => {
    let result = await movies.find({
      cast: { $all: ['Barry Prima', 'Malfin Shayna'] }
    });
    //console.log(result);
    //  expect(result).not.toBeNull();

    let { title, cast, year } = await result.next();
    expect(title).toBe('Panther');
    expect(year).toBe(1995);
    expect(cast).toContain('Barry Prima');
    expect(cast).toContain('Malfin Shayna');

    console.log({ title, year, cast });
  });
});
