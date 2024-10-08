// HUMAN-DESIGNED LEVELS -- Mapped using an array of beats,
// an array of corresponding notes (expressed as lanes on
// which they should drop), and a bpm which gets converted
// to milliseconds per beat later on. The offset attribute
// is manually adjusted so that game and song align. "src"
// tells gamescreen.js what resource link to play audio from.
// testingStartAtBeat does exactly what you expect it to.

export const LEVELS = [
  { // MDK - Fingerdash
    beats: [
      0, 1, 2, 3,
      4, 5, 6, 7,
      8, 9, 10, 11,
      12, 13, 14, 15,
      16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5,
      20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5,
      24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5,
      28, 28.5, 29, 29.5, 30, 30.25, 30.75, 31, 31.5,
      32, 33, 34, 35,
      36, 37, 38, 38.25, 38.5, 38.75, 39, 39.25, 39.5, 39.75,
      40, 41, 42, 43,
      44, 45, 46, 47,
      48, 49, 50, 51,
      52, 53, 54, 54.25, 54.5, 54.75, 55, 55.25, 55.5, 55.75,
      56, 57, 58, 59,
      60, 61, 62, 62.5, 63,
      // wo - ba kit - ve ke de
      64, 65.25, 65.5, 67, 67.25, 67.75,
      // ve - be anthem - ba
      68, 69.25, 69.75, 70.75, 71.75,  
      // dem bem pe - eh
      72.5, 73, 73.5, 74.5,
      // oe oe um um
      76, 76.5, 77.25, 77.75,
      // wo - ba kit - ve ke de
      80, 81.25, 81.5, 83, 83.25, 83.75,
      // ve - be anthem - ba
      84, 85.25, 85.75, 86.75, 87.75,
      // dem bem pe - eh
      88.5, 89, 89.5, 90.5,
      // oe oe um um - [pre]
      92, 92.5, 93.25, 93.75, 95,
      // [drop] - ...
      96, 96.5, 96.75, 97.5, 98, 98.25, 99,
      100, 100.5, 100.75, 101.5, 102.25, 102.5, 102.75, 103, 103.25, 103.5,
      104, 104.5, 104.75, 105.5, 106,
      108, 108.5, 108.75, 109.5, 110.25, 110.75, 111, 111.25,
      112, 112.75, 113.5, 114.25,
      116, 116.75, 117.5, 118.25, 119, 119.5,
      120, 120.75, 121.5, 122.25,
      124, 124.75, 125.5, 126.25,
      128, 128.75, 129.5, 130.25, 131, 131.5,
      132, 132.75, 133.5, 134.25, 135, 135.5,
      136, 136.5, 137, 137.5, 138, 138.5, 139, 139.5,
      140, 140.25, 140.5, 140.75, 141, 141.25, 141.5, 141.75, 142, 142.25, 142.5, 142.75,
      // aaaand we stop at big beat drop
      144, 144.5,
    ],
    whereTheyreDropping: [
      [0, 1], [1, 2], [2, 3], [1, 2],
      [0, 1], [1, 2], [2, 3], [1, 2],
      [0, 3], [1, 2], [0, 1], [2, 3],
      [0, 2], [1, 3], [1, 2], [0, 3],
      [0], [1], [0], [1], [3], [2], [3], [2],
      [1], [2], [0], [3], [0], [1], [2], [3],
      [0], [1], [0, 2, 3], [1], [0], [1], [0, 2, 3], [1],
      [0], [1], [0, 2, 3], [1], [0], [1], [2], [3], [3],
      [0, 1, 2, 3], [0], [2], [1],
      [3], [1], [0], [1], [2], [3], [0], [1], [2], [3],
      [0, 1], [2, 3], [2], [1],
      [0], [0, 1], [0], [2, 3],
      [1], [2], [0], [3],
      [2], [1], [3], [2], [1], [0], [3], [2], [1], [0],
      [1], [3], [2], [0],
      [0, 2], [1, 3], [2, 3], [0, 1], [0, 1],
      // wo - ba kit - ve ke de
      [1, 2, 3], [0], [1], [0], [3], [1],
      // ve - be anthem - ba
      [2], [2], [1], [3], [3],
      // dem bem pe - eh
      [0], [2], [1], [3],
      // oe oe um um
      [1], [0], [3], [2],
      // wo - ba kit - ve ke de
      [1, 2], [0, 3], [1, 2], [2], [0], [3],
      // ve - be anthem - ba
      [1], [3], [2], [1], [3],
      // dem bem pe - eh
      [0], [2], [1], [3],
      // oe oe um um - [pre]
      [1], [0], [3], [2], [0],
      // [drop] - ...
      [0, 3], [2], [1], [0], [3], [0], [2],
      [3], [1], [2], [1], [2], [1], [2], [1], [2], [1],
      [0], [3], [3], [0], [0],
      [0], [3], [3], [0], [3], [3], [2], [3],
      [0], [0], [3], [3],
      [2], [2], [1], [1], [0], [0],
      [1], [1], [2], [2],
      [1], [1], [3], [3],
      [0, 2], [0, 2], [1, 3], [1, 3], [2], [0],
      [0, 2], [0, 2], [1, 3], [1, 3], [0], [2],
      [0, 2], [1, 3], [0, 2], [1, 3], [0, 2], [1, 3], [0, 2], [1, 3],
      [0], [3], [1], [2], [0], [3], [1], [2], [0], [3], [1], [2],
      // aaaand we stop at big beat drop
      [0, 1, 2, 3], [2],
    ],
    src: "../resources/songs/fingerdash.m4a",
    bpm: 112, offset: 230, testingStartAtBeat: 0,
  },
  { // Seven Nation Army
    beats: [
      0, 1, 2, 3,
      4, 5, 6, 7,
      8, 9, 10, 11,
      12, 13, 14, 15,
      16, 17, 18, 19,
      20, 21, 22, 23,
      24, 25, 26, 27,
      28, 29, 30, 31,
      32, 32.5, 33, 33.5, 34, 34.5, 35.5,
      36.5, 37, 37.5, 38.25, 39, 39.5,
      40, 41, 42, 43,
      44, 44.75, 46, 46.75,
      48, 48.5, 49, 49.5, 50, 50.5, 51.5,
      52.5, 53, 53.5, 54.25, 55, 55.5,
      56, 57, 58, 59,
      60, 60.75, 62, 63, 63.5,
      64, 64.5, 65, 65.5, 66, 66.5, 67.25,
      69, 70, 70.5, 71, 71.5,
      72, 73.5, 74.25, 74.75, 75.5,
      76, 77, 78, 79,
      80, 81.5, 82.25, 82.75, 83.5,
      84, 84.75, 85.5, 86, 87,
      88, 89.5, 90.25, 90.75, 91.5,
      92, 93, 94, 95,
      96, 97.5, 98.25, 98.75, 99.5,
      100, 101, 102, 103,
      104,
      108,
      112, 113.5, 114.25, 114.75, 115.5,
      116, 118,
      120, 121.5, 122.25, 122.75, 123.5,
      124, 126,
    ],
    whereTheyreDropping: [
      [1], [2], [0], [1],
      [2], [0], [2], [1],
      [3], [3], [0], [1],
      [0], [1], [2], [1],
      [0, 2, 3], [0, 1, 2], [1, 2, 3], [0, 1, 3],
      [2], [0], [1], [2],
      [3], [1], [2], [0],
      [1, 3], [1, 2], [0, 1], [1],
      [3], [2], [0], [0], [1], [3], [2],
      [2], [0], [1, 2], [0, 2], [1, 3], [0],
      [0, 3], [1, 2], [0, 3], [1, 2],
      [0], [0], [2, 3], [2, 3],
      [0, 1], [2, 3], [1], [0], [2, 3], [1], [3],
      [2], [1], [0], [3], [2], [3],
      [1, 2], [0, 1], [2, 3], [0, 2],
      [1], [1], [1], [2], [3],
      [0], [3], [2], [3], [1], [3], [3],
      [0], [2], [1], [2], [0],
      [0, 1, 2, 3], [1], [2], [1], [0],
      [1], [3], [0], [3],
      [0, 3], [1], [2], [1], [0],
      [2], [1], [2], [0], [3],
      [0, 1, 2, 3], [1], [2], [1], [0],
      [1], [3], [0], [3],
      [0, 3], [1], [2], [1], [0],
      [1, 2], [0, 3], [1, 3], [0, 2],
      [1],
      [3],
      [0, 2], [3], [2], [3], [1],
      [0], [2],
      [1, 3], [0], [1], [0], [2],
      [3], [1],
    ],
    src: "../resources/songs/seven-nation-army.m4a",
    bpm: 120, offset: 1600, testingStartAtBeat: 0,
  }
]
