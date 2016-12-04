// Creates a new bloom filter.
// *a* is the array used to initialize the bloom filter.
//     For an empty bloom filter use:  a = new Array(n).fill(0)
// *k* is the number of hash functions.
class BloomFilter {
	constructor(a, k) {
		this.m = a.length * 32
		this.k = k
		this.buckets = a
	}

	// See http://willwhim.wpengine.com/2011/09/03/producing-n-hash-functions-by-hashing-only-once/
	locations(v) {
		var m = this.m,
			a = hash_a(String(v)),
			b = mod(hash_b(a), m),
			a = mod(a, m),
			l = []
		for (var i = 0; i < this.k; ++i) {
			l[i] = a
			a = (a + b) % m
		}
		return l
	}

	// Set ith bit to 1
	set(i) { this.buckets[Math.floor(i/32)] |= 1 << i }
	// Check if ith bit is 1
	get(i) { return this.buckets[Math.floor(i/32)] & (1 << (i % 32)) }

	add(v) { this.locations(v).forEach(this.set, this) }
	test(v) { return this.locations(v).every(this.get, this) }

	// Estimated cardinality.
	size() {
		var bits = 0
		for (let b of this.buckets) bits += popcnt(b)
		return -this.m * Math.log(1 - bits / this.m) / this.k
	}
}

// Return true (positive) modulus of x
mod = (x, m) => ((x % m) + m) %m


// http://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel
function popcnt(v) {
	v -= (v >> 1) & 0x55555555
	v = (v & 0x33333333) + ((v >> 2) & 0x33333333)
	return ((v + (v >> 4) & 0xf0f0f0f) * 0x1010101) >> 24
}

// Fowler/Noll/Vo (FNV) hash function
function hash_a(v) {
	var a = 2166136261
	for (var i = 0, n = v.length; i < n; ++i) {
		var c = v.charCodeAt(i),
				d = c & 0xff00
		if (d) a = fnv_multiply(a ^ d >> 8)
		a = fnv_multiply(a ^ c & 0xff)
	}
	return fnv_mix(a)
}

// One additional iteration of FNV, given a hash.
hash_b = a => fnv_mix(fnv_multiply(a))

// a * 16777619 mod 2**32
fnv_multiply = a => a + (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24)

// See https://web.archive.org/web/20131019013225/http://home.comcast.net/~bretm/hash/6.html
function fnv_mix(a) {
	a += a << 13
	a ^= a >>> 7
	a += a << 3
	a ^= a >>> 17
	a += a << 5
	return a & 0xffffffff
}

module.exports = BloomFilter
