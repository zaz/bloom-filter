const BloomFilter = require("../bloomfilter")

const vows = require("vows")
const assert = require("assert")

const suite = vows.describe("bloomfilter")

const zero1000 = new Array(1000).fill(0)
const   zero20 = new Array(20).fill(0)

const jabberwocky = "`Twas brillig, and the slithy toves\n  Did gyre and gimble in the wabe:\nAll mimsy were the borogoves,\n  And the mome raths outgrabe.\n\n\"Beware the Jabberwock, my son!\n  The jaws that bite, the claws that catch!\nBeware the Jubjub bird, and shun\n  The frumious Bandersnatch!\"\n\nHe took his vorpal sword in hand:\n  Long time the manxome foe he sought --\nSo rested he by the Tumtum tree,\n  And stood awhile in thought.\n\nAnd, as in uffish thought he stood,\n  The Jabberwock, with eyes of flame,\nCame whiffling through the tulgey wood,\n  And burbled as it came!\n\nOne, two! One, two! And through and through\n  The vorpal blade went snicker-snack!\nHe left it dead, and with its head\n  He went galumphing back.\n\n\"And, has thou slain the Jabberwock?\n  Come to my arms, my beamish boy!\nO frabjous day! Callooh! Callay!'\n  He chortled in his joy.\n\n`Twas brillig, and the slithy toves\n  Did gyre and gimble in the wabe;\nAll mimsy were the borogoves,\n  And the mome raths outgrabe.";

suite.addBatch({
  "bloom filter": {
    "basic": () => {
      let f = new BloomFilter(zero1000, 4)
      let n1 = "Bess"
      let n2 = "Jane"
      f.add(n1)
      assert.equal(f.test(n1), true)
      assert.equal(f.test(n2), false)
    },
    "jabberwocky": () => {
      let f = new BloomFilter(zero1000, 4)
      let n1 = jabberwocky
      let n2 = jabberwocky + "\n"
      f.add(n1)
      assert.equal(f.test(n1), true)
      assert.equal(f.test(n2), false)
    },
    "basic uint32": () => {
      let f = new BloomFilter(zero1000, 4)
      let n1 = "\u0100"
      let n2 = "\u0101"
      let n3 = "\u0103"
      f.add(n1)
      assert.equal(f.test(n1), true)
      assert.equal(f.test(n2), false)
      assert.equal(f.test(n3), false)
    },
    "wtf": () => {
      let f = new BloomFilter(zero20, 10)
      f.add("abc")
      assert.equal(f.test("wtf"), false)
    },
    "works with integer types": () => {
      let f = new BloomFilter(zero1000, 4)
      f.add(1)
      assert.equal(f.test(1), true)
      assert.equal(f.test(2), false)
    },
    "size": () => {
      let f = new BloomFilter(zero1000, 4)
      for (let i = 0; i < 100; ++i) f.add(i)
      assert.inDelta(f.size(), 99.953102, 1e-6)
      for (let i = 0; i < 1000; ++i) f.add(i)
      assert.inDelta(f.size(), 950.424571, 1e-6)
    }
  }
})

suite.export(module)
