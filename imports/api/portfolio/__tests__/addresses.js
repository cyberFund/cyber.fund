import test from 'ava';
const testAddress = {
	_id: '__test_address__',
	value: ''
}
test(t => {
    t.deepEqual([1, 2], [1, 2]);
});
