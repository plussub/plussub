import { findNext } from '@/subtitle/tab/findNext';

describe('findNext', () => {
  it('test', () => {
    const pos = findNext(2100, [
      {
        from: 0,
        to: 1000
      },
      {
        from: 2000,
        to: 3000
      },
      {
        from: 5000,
        to: 10000
      },
      {
        from: 11000,
        to: 12500
      }
    ]);
    // match on 1 because from 2000 to 3000 overlaps and mid hits
    expect(pos).toEqual(1);
  });


  it('test2', () => {
    const pos = findNext(2100, [
      {
        from: 0,
        to: 1000
      },
      {
        from: 2000,
        to: 2050
      },
      {
        from: 5000,
        to: 10000
      },
      {
        from: 11000,
        to: 12500
      }
    ]);
    // match on 2 because from 5000 is the next
    expect(pos).toEqual(2);
  });
});
